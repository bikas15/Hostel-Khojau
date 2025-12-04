import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../api';

const TestBooking = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState({
    hostelId: '6740b8b5e8b8c123456789ab', // Replace with actual hostel ID
    roomId: '6740b8b5e8b8c123456789cd',   // Replace with actual room ID
    checkInDate: new Date().toISOString().split('T')[0],
    totalMonthsStaying: 1
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestBooking = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(
        `/bookings/${bookingData.hostelId}/book`,
        {
          roomId: bookingData.roomId,
          checkInDate: bookingData.checkInDate,
          totalMonthsStaying: parseInt(bookingData.totalMonthsStaying)
        },
        {
          headers: { 'x-auth-token': token }
        }
      );

      if (response.data.success && response.data.payment?.payment_url) {
        toast.success('Redirecting to payment...');
        // Redirect to mock payment page
        window.location.href = response.data.payment.payment_url;
      } else {
        toast.error('Payment initiation failed');
      }
    } catch (error) {
      console.error('Booking error:', error);
      toast.error(error.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 m-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Test Khalti Mock Payment
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Hostel ID
          </label>
          <input
            type="text"
            name="hostelId"
            value={bookingData.hostelId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter hostel ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room ID
          </label>
          <input
            type="text"
            name="roomId"
            value={bookingData.roomId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter room ID"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Check-in Date
          </label>
          <input
            type="date"
            name="checkInDate"
            value={bookingData.checkInDate}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Total Months Staying
          </label>
          <input
            type="number"
            name="totalMonthsStaying"
            value={bookingData.totalMonthsStaying}
            onChange={handleInputChange}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handleTestBooking}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Processing...
            </div>
          ) : (
            'Test Mock Khalti Payment'
          )}
        </button>
      </div>

      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="text-sm font-medium text-yellow-800 mb-2">Test Instructions:</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Make sure you're logged in</li>
          <li>• Use valid hostel and room IDs from your database</li>
          <li>• The payment will redirect to mock Khalti page</li>
          <li>• You can test success, failure, or cancellation</li>
        </ul>
      </div>
    </div>
  );
};

export default TestBooking;