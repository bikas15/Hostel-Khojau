# Khalti Mock Payment Integration

This document explains how to use the mock Khalti payment system for testing hostel bookings without real money transactions.

## 🚀 Quick Start

### 1. Access the Demo
Visit: `http://localhost:3000/payment-demo`

### 2. Test the Flow
1. **Login** to your account
2. **Browse hostels** at `/hostels` or use the test booking form
3. **Select a room** and fill booking details
4. **Get redirected** to mock Khalti payment page
5. **Choose payment outcome**: Success, Failure, or Cancel
6. **See the result** in your bookings

## 📁 File Structure

### Frontend Files
```
frontend/src/
├── pages/
│   ├── MockPayment.jsx          # Mock Khalti payment page
│   ├── PaymentCallback.jsx      # Handle payment results
│   └── PaymentDemo.jsx          # Demo page with instructions
├── services/
│   └── mockKhaltiService.js     # Mock payment service
└── components/
    └── TestBooking.jsx          # Test booking form
```

### Backend Files
```
backend/
├── utils/
│   └── khalti.js               # Mock payment utilities
├── routes/
│   └── bookingRoutes.js        # Booking API with payment
└── models/
    └── Booking.js              # Booking database model
```

## 🔧 Configuration

### Environment Variables
Both frontend and backend are configured with test credentials:

**Frontend (.env):**
```env
KHALTI_SECRET_KEY=test_secret_key_f59e8b7d18b4499ca40f68195a846b9b
KHALTI_PUBLIC_KEY=test_public_key_dc74e0fd797d4cd49c4dcc3b20b99cc2a
KHALTI_GATEWAY_URL=https://a.khalti.com
```

**Backend (.env):**
```env
KHALTI_SECRET_KEY=test_secret_key_f59e8b7d18b4499ca40f68195a846b9b
KHALTI_PUBLIC_KEY=test_public_key_dc74e0fd797d4cd49c4dcc3b20b99cc2a
KHALTI_GATEWAY_URL=https://a.khalti.com
```

## 🎯 How It Works

### 1. Booking Initiation
- User selects a room and fills booking details
- Frontend calls `/api/bookings/:hostelId/book`
- Backend creates a pending booking record
- Mock payment URL is generated and returned

### 2. Mock Payment Page
- User is redirected to `/mock-payment` with booking details
- Three options available:
  - ✅ **Simulate Successful Payment**
  - ❌ **Simulate Failed Payment**  
  - 🚫 **Cancel Payment**

### 3. Payment Callback
- Mock payment redirects to `/payment-callback`
- Backend verifies the mock payment
- Booking status is updated accordingly
- Room availability is managed automatically

### 4. Booking Completion
- Successful payments confirm the booking
- Failed/cancelled payments free up the room
- User can view booking status in "My Bookings"

## 🧪 Testing Scenarios

### Success Flow
1. Select "Simulate Successful Payment"
2. Booking status changes to "confirmed"
3. Room becomes unavailable
4. Payment status: "completed"

### Failure Flow
1. Select "Simulate Failed Payment"
2. Booking status changes to "cancelled"
3. Room becomes available again
4. Payment status: "failed"

### Cancellation Flow
1. Select "Cancel Payment"
2. Booking status changes to "cancelled"
3. Room becomes available again
4. Payment status: "cancelled"

## 🔍 API Endpoints

### Create Booking
```
POST /api/bookings/:hostelId/book
Headers: { 'x-auth-token': 'user_token' }
Body: {
  roomId: 'room_id',
  checkInDate: '2024-01-01',
  totalMonthsStaying: 1
}
```

### Payment Verification
```
GET /api/bookings/complete-khalti-payment?pidx=mock_pidx_123&transaction_id=mock_txn_123&purchase_order_id=booking_id
```

### Get User Bookings
```
GET /api/bookings/my-bookings
Headers: { 'x-auth-token': 'user_token' }
```

## 🎨 UI Components

### MockPayment.jsx Features
- Clean, professional payment interface
- Three test scenarios with clear buttons
- Loading states and animations
- Amount and order details display
- Test mode warning banner

### PaymentCallback.jsx Features
- Automatic payment verification
- Loading spinner during processing
- Toast notifications for results
- Automatic redirection after completion
- Error handling for failed verifications

## 🚨 Important Notes

1. **Test Mode Only**: This is for development/demo purposes only
2. **No Real Money**: No actual payments are processed
3. **Mock Data**: All payment IDs and transaction IDs are generated locally
4. **Database Updates**: Booking and room statuses are updated realistically
5. **User Authentication**: Login is required for booking functionality

## 🔄 Switching to Production

To use real Khalti payments:

1. **Get Real Credentials**: Sign up at [Khalti](https://khalti.com)
2. **Update Environment Variables**: Replace test keys with production keys
3. **Remove Mock Logic**: The backend automatically detects test vs production keys
4. **Test Thoroughly**: Use Khalti's sandbox environment first

## 📱 Mobile Responsive

The mock payment interface is fully responsive and works on:
- Desktop browsers
- Mobile devices
- Tablets
- Different screen orientations

## 🎉 Ready to Test!

Your Khalti mock payment system is now ready. Visit `/payment-demo` to start testing the complete booking flow with simulated payments.