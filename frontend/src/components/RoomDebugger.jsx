import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { API_BASE_URL } from '../api';

// Use the correct backend URL
const RoomDebugger = () => {
  const [roomId, setRoomId] = useState('');
  const [roomDetails, setRoomDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRoomDetails = async () => {
    if (!roomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `${API_BASE_URL}/bookings/room-details/${roomId}`,
        { headers: { 'x-auth-token': token } }
      );
      setRoomDetails(response.data);
      console.log('Room details:', response.data);
    } catch (error) {
      console.error('Error getting room details:', error);
      toast.error('Failed to get room details: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  const resetRoomAvailability = async () => {
    if (!roomId.trim()) {
      toast.error('Please enter a room ID');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookings/reset-room-availability/${roomId}`,
        {},
        { headers: { 'x-auth-token': token } }
      );
      
      toast.success('Room availability reset successfully!');
      console.log('Reset result:', response.data);
      
      // Refresh room details
      getRoomDetails();
    } catch (error) {
      console.error('Error resetting room availability:', error);
      toast.error('Failed to reset room availability: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 m-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Room Debugger
      </h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room ID
          </label>
          <input
            type="text"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter room ID to debug"
          />
        </div>

        <div className="flex space-x-2">
          <button
            onClick={getRoomDetails}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Loading...' : 'Get Details'}
          </button>
          
          <button
            onClick={resetRoomAvailability}
            disabled={loading}
            className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Resetting...' : 'Reset Availability'}
          </button>
        </div>

        {roomDetails && (
          <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <h3 className="text-lg font-medium text-gray-800 mb-3">Room Details</h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Room Number:</span>
                <span>{roomDetails.room.roomNumber}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Room Type:</span>
                <span>{roomDetails.room.roomType}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Monthly Price:</span>
                <span>Rs. {roomDetails.room.monthlyPrice}</span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Available:</span>
                <span className={roomDetails.room.isAvailable ? 'text-green-600' : 'text-red-600'}>
                  {roomDetails.room.isAvailable ? 'Yes' : 'No'}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Hostel:</span>
                <span>{roomDetails.room.hostel?.name || 'N/A'}</span>
              </div>
            </div>

            {roomDetails.activeBookings && roomDetails.activeBookings.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-800 mb-2">Active Bookings:</h4>
                <div className="space-y-2">
                  {roomDetails.activeBookings.map((booking, index) => (
                    <div key={booking._id} className="text-xs bg-yellow-50 p-2 rounded">
                      <div>User: {booking.userId?.name || 'Unknown'}</div>
                      <div>Status: {booking.status}</div>
                      <div>Check-in: {new Date(booking.checkInDate).toLocaleDateString()}</div>
                      <div>Duration: {booking.totalMonthsStaying} month(s)</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-800 mb-2">How to use:</h3>
          <ol className="text-sm text-blue-700 space-y-1">
            <li>1. Get a room ID from the hostel details page</li>
            <li>2. Click "Get Details" to see room status</li>
            <li>3. If room shows "Available: No", click "Reset Availability"</li>
            <li>4. Try booking again</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RoomDebugger;