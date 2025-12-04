const Notification = require('../models/Notification');

// Create a notification for booking events
const createBookingNotification = async (ownerId, type, bookingData) => {
  try {
    let title, message;
    
    switch (type) {
      case 'new_booking':
        title = '🎉 New Booking Received!';
        message = `You have a new booking for ${bookingData.hostelName} - Room ${bookingData.roomNumber}. Customer: ${bookingData.customerName}`;
        break;
      case 'booking_confirmed':
        title = '✅ Booking Confirmed';
        message = `Booking for ${bookingData.hostelName} - Room ${bookingData.roomNumber} has been confirmed. Payment received: Rs. ${bookingData.totalPrice}`;
        break;
      case 'booking_cancelled':
        title = '❌ Booking Cancelled';
        message = `Booking for ${bookingData.hostelName} - Room ${bookingData.roomNumber} has been cancelled by ${bookingData.customerName}`;
        break;
      case 'payment_received':
        title = '💰 Payment Received';
        message = `Payment of Rs. ${bookingData.totalPrice} received for ${bookingData.hostelName} - Room ${bookingData.roomNumber}`;
        break;
      default:
        title = 'Booking Update';
        message = 'You have a booking update';
    }

    const notification = new Notification({
      userId: ownerId,
      type: 'booking',
      title,
      message,
      bookingId: bookingData.bookingId,
      hostelId: bookingData.hostelId,
    });

    await notification.save();
    console.log(`Notification created for owner ${ownerId}: ${title}`);
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

// Create a general notification
const createNotification = async (userId, type, title, message, additionalData = {}) => {
  try {
    const notification = new Notification({
      userId,
      type,
      title,
      message,
      ...additionalData
    });

    await notification.save();
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = {
  createBookingNotification,
  createNotification
};