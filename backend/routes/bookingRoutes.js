const express = require('express');
const router = express.Router();
const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hostel = require('../models/Hostel');
const auth = require('../middleware/auth');
const { check, validationResult } = require('express-validator');
const { initializeKhaltiPayment, verifyKhaltiPayment } = require('../utils/khalti');
const { createBookingNotification } = require('../utils/notifications');

// Helper function to reset room availability (for testing)
router.post('/reset-room-availability/:roomId', auth, async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.roomId, 
      { isAvailable: true }, 
      { new: true }
    );
    
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    res.json({ 
      success: true, 
      message: 'Room availability reset to available',
      room: {
        _id: room._id,
        roomNumber: room.roomNumber,
        isAvailable: room.isAvailable
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to reset room availability',
      error: error.message 
    });
  }
});

// Get room details (for debugging)
router.get('/room-details/:roomId', auth, async (req, res) => {
  try {
    const room = await Room.findById(req.params.roomId).populate('hostel', 'name');
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    
    const activeBookings = await Booking.find({
      roomId: req.params.roomId,
      status: { $in: ['pending', 'confirmed'] }
    }).populate('userId', 'name');
    
    res.json({
      room,
      activeBookings,
      isAvailable: room.isAvailable
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to get room details',
      error: error.message 
    });
  }
});

// Utility function to check and update room availability
const updateRoomAvailability = async (roomId) => {
  try {
    const activeBookings = await Booking.find({
      roomId: roomId,
      status: { $in: ['pending', 'confirmed'] }
    });
    
    const isAvailable = activeBookings.length === 0;
    await Room.findByIdAndUpdate(roomId, { isAvailable });
    return isAvailable;
  } catch (error) {
    console.error('Error updating room availability:', error);
    return false;
  }
};

// Fix room availability (admin/debug route)
router.post('/fix-room-availability/:roomId', auth, async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const isAvailable = await updateRoomAvailability(roomId);
    res.json({ 
      success: true, 
      message: `Room availability updated to: ${isAvailable}`,
      roomId,
      isAvailable
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to update room availability',
      error: error.message 
    });
  }
});

// Create a booking
router.post(
  '/:hostelId/book',
  [
    auth,
    check('roomId', 'Room ID is required').not().isEmpty(),
    check('checkInDate', 'Check-in date is required').isISO8601(),
    check('totalMonthsStaying', 'Total months staying is required').isInt({ min: 1 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { roomId, checkInDate, totalMonthsStaying } = req.body;
      const hostel = await Hostel.findById(req.params.hostelId);
      if (!hostel || !hostel.isApproved) {
        return res.status(404).json({ message: 'Hostel not found or not approved' });
      }

      const room = await Room.findById(roomId);
      console.log('Room details:', { 
        roomId, 
        roomExists: !!room, 
        isAvailable: room?.isAvailable,
        roomNumber: room?.roomNumber 
      });
      
      if (!room) {
        return res.status(400).json({ message: 'Room not found' });
      }
      
      if (!room.isAvailable) {
        return res.status(400).json({ 
          message: 'Room not available',
          roomDetails: {
            roomId: room._id,
            roomNumber: room.roomNumber,
            isAvailable: room.isAvailable
          }
        });
      }

      const checkIn = new Date(checkInDate);
      const checkOut = new Date(checkIn);
      checkOut.setMonth(checkOut.getMonth() + totalMonthsStaying);

      const overlappingBookings = await Booking.find({
        roomId: roomId,
        status: { $in: ['pending', 'confirmed'] },
        $or: [
          { checkInDate: { $lte: checkOut, $gte: checkIn } },
          {
            $and: [
              { checkInDate: { $lte: checkIn } },
              {
                $expr: {
                  $gte: [
                    { $dateAdd: { startDate: '$checkInDate', unit: 'month', amount: '$totalMonthsStaying' } },
                    checkIn,
                  ],
                },
              },
            ],
          },
          {
            $and: [
              { checkInDate: { $lte: checkOut } },
              {
                $expr: {
                  $lte: [
                    { $dateAdd: { startDate: '$checkInDate', unit: 'month', amount: '$totalMonthsStaying' } },
                    checkOut,
                  ],
                },
              },
            ],
          },
        ],
      });

      if (overlappingBookings.length > 0) {
        return res.status(400).json({ message: 'Room is booked for the selected period' });
      }

      const totalAmount = room.monthlyPrice * totalMonthsStaying;
      const amountInPaisa = Math.round(totalAmount * 100);
      if (amountInPaisa < 1000) {
        return res.status(400).json({ message: 'Total amount must be at least Rs. 10 (1000 paisa) for payment' });
      }

      const booking = new Booking({
        userId: req.user.id,
        hostelId: req.params.hostelId,
        roomId: roomId,
        checkInDate,
        totalMonthsStaying,
        totalPrice: totalAmount,
        status: 'pending',
        paymentMethod: 'khalti',
      });

      await booking.save();

      const paymentInitate = await initializeKhaltiPayment({
        amount: amountInPaisa,
        purchase_order_id: booking._id.toString(),
        purchase_order_name: `Booking for ${hostel.name}`,
        return_url: `${process.env.FRONTEND_URI || 'http://localhost:5173'}/payment-callback`,
        website_url: process.env.FRONTEND_URI || 'http://localhost:5173',
        customer_info: {
          name: req.user.name || 'Guest',
          email: req.user.email || 'guest@example.com',
          phone: '9800000001',
        },
      });

      booking.paymentId = paymentInitate.pidx;
      await booking.save();

      // Room availability will be managed by the utility function
      await updateRoomAvailability(roomId);

      await Hostel.findByIdAndUpdate(req.params.hostelId, {
        $push: { bookings: booking._id },
      });

      const populatedBooking = await Booking.findById(booking._id)
        .populate('userId', 'name email')
        .populate('hostelId', 'name owner')
        .populate('roomId', 'roomNumber roomType monthlyPrice');

      // Send notification to hostel owner about new booking
      if (populatedBooking.hostelId.owner) {
        await createBookingNotification(populatedBooking.hostelId.owner, 'new_booking', {
          bookingId: booking._id,
          hostelId: req.params.hostelId,
          hostelName: populatedBooking.hostelId.name,
          roomNumber: populatedBooking.roomId.roomNumber,
          customerName: populatedBooking.userId.name,
          totalPrice: totalAmount
        });
      }

      res.status(201).json({
        success: true,
        booking: populatedBooking,
        payment: paymentInitate,
      });
    } catch (err) {
      console.error('Error in /book:', err.response?.data || err.message);
      res.status(400).json({ success: false, message: 'Payment initiation failed', error: err.message });
    }
  }
);

// Verify payment callback
router.get('/complete-khalti-payment', async (req, res) => {
  const {
    pidx,
    transaction_id,
    purchase_order_id,
  } = req.query;

  try {
    const paymentInfo = await verifyKhaltiPayment(pidx);
    
    // Handle failed or cancelled payments
    if (paymentInfo?.status !== 'Completed') {
      await Booking.findByIdAndUpdate(purchase_order_id, {
        $set: { status: 'cancelled', paymentStatus: 'failed' },
      });
      const booking = await Booking.findById(purchase_order_id);
      if (booking) {
        await updateRoomAvailability(booking.roomId);
      }
      return res.status(400).json({
        success: false,
        message: 'Payment verification failed',
        paymentInfo,
      });
    }

    const booking = await Booking.findById(purchase_order_id);
    if (!booking) {
      return res.status(400).json({
        success: false,
        message: 'Booking not found',
      });
    }

    // Skip amount verification for mock payments
    const isMockPayment = pidx.startsWith('mock_pidx_') || process.env.KHALTI_SECRET_KEY?.includes('test_');
    if (!isMockPayment && booking.totalPrice * 100 !== Number(paymentInfo.total_amount)) {
      await Booking.findByIdAndUpdate(purchase_order_id, {
        $set: { status: 'cancelled', paymentStatus: 'failed' },
      });
      await Room.findByIdAndUpdate(booking.roomId, { isAvailable: true });
      return res.status(400).json({
        success: false,
        message: 'Amount mismatch',
      });
    }

    await Booking.findByIdAndUpdate(purchase_order_id, {
      $set: { status: 'confirmed', paymentStatus: 'completed' },
    });

    // Send payment confirmation notification to owner
    const confirmedBooking = await Booking.findById(purchase_order_id)
      .populate('hostelId', 'name owner')
      .populate('roomId', 'roomNumber')
      .populate('userId', 'name');

    if (confirmedBooking.hostelId.owner) {
      await createBookingNotification(confirmedBooking.hostelId.owner, 'booking_confirmed', {
        bookingId: purchase_order_id,
        hostelId: confirmedBooking.hostelId._id,
        hostelName: confirmedBooking.hostelId.name,
        roomNumber: confirmedBooking.roomId.roomNumber,
        customerName: confirmedBooking.userId.name,
        totalPrice: confirmedBooking.totalPrice
      });
    }

    const paymentData = {
      pidx,
      transactionId: transaction_id,
      productId: purchase_order_id,
      amount: booking.totalPrice * 100,
      dataFromVerificationReq: paymentInfo,
      apiQueryFromUser: req.query,
      paymentGateway: 'khalti',
      status: 'success',
    };

    res.json({
      success: true,
      message: 'Payment Successful',
      paymentData,
    });
  } catch (err) {
    console.error('Error in /complete-khalti-payment:', err.response?.data || err.message);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: err.message,
    });
  }
});

// Get booking by ID
router.get('/booking/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('hostelId', 'name')
      .populate('roomId', 'roomNumber roomType monthlyPrice');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow the booking user or the hostel owner to access the details
    if (booking.userId.toString() !== req.user.id && 
        !(await Hostel.findOne({ _id: booking.hostelId, owner: req.user.id }))) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Handle payment cancellation
router.post('/:bookingId/cancel-payment', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Only allow cancellation by the booking user
    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Update booking status
    booking.status = 'cancelled';
    booking.paymentStatus = 'cancelled';
    await booking.save();

    // Make room available again
    await Room.findByIdAndUpdate(booking.roomId, { isAvailable: true });

    res.json({ 
      success: true,
      message: 'Payment cancelled successfully'
    });
  } catch (err) {
    console.error('Error cancelling payment:', err);
    res.status(500).json({ 
      success: false,
      message: 'Failed to cancel payment'
    });
  }
});

// Get user's bookings
router.get('/my-bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('hostelId', 'name')
      .populate('roomId', 'roomNumber roomType monthlyPrice');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cancel a booking
router.delete('/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    booking.paymentStatus = 'refunded';

    await updateRoomAvailability(booking.roomId);

    await booking.save();
    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a booking record (only for cancelled bookings)
router.delete('/:bookingId/delete', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Unauthorized to delete this booking' });
    }

    if (booking.status !== 'cancelled') {
      return res.status(400).json({ message: 'Only cancelled bookings can be deleted' });
    }

    await Booking.findByIdAndDelete(req.params.bookingId);
    res.json({ message: 'Booking record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;