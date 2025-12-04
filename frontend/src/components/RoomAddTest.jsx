import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

// Use the correct backend URL
const API_BASE_URL = 'http://localhost:5000/api';

const RoomAddTest = () => {
  const [hostels, setHostels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomData, setRoomData] = useState({
    hostelId: '',
    roomNumber: '',
    roomType: 'Single',
    monthlyPrice: ''
  });

  useEffect(() => {
    fetchHostels();
  }, []);

  const fetchHostels = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login first');
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/owner/hostels`, {
        headers: { 'x-auth-token': token }
      });
      setHostels(response.data);
      console.log('Hostels fetched:', response.data);
    } catch (error) {
      console.error('Error fetching hostels:', error);
      toast.error('Failed to fetch hostels: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (!token) {
      toast.error('Please login first');
      return;
    }

    if (!roomData.hostelId || !roomData.roomNumber || !roomData.roomType || !roomData.monthlyPrice) {
      toast.error('Please fill all fields');
      return;
    }

    setLoading(true);
    console.log('Adding room with data:', roomData);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/owner/hostels/${roomData.hostelId}/rooms`,
        {
          roomNumber: roomData.roomNumber,
          roomType: roomData.roomType,
          monthlyPrice: parseInt(roomData.monthlyPrice)
        },
        {
          headers: { 'x-auth-token': token }
        }
      );

      console.log('Room added successfully:', response.data);
      toast.success('Room added successfully!');
      
      // Reset form
      setRoomData({
        hostelId: '',
        roomNumber: '',
        roomType: 'Single',
        monthlyPrice: ''
      });

      // Refresh hostels
      fetchHostels();
    } catch (error) {
      console.error('Error adding room:', error);
      console.error('Error response:', error.response?.data);
      toast.error('Failed to add room: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6 m-4">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
        Test Room Addition
      </h2>
      
      <form onSubmit={handleAddRoom} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Hostel
          </label>
          <select
            name="hostelId"
            value={roomData.hostelId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select a hostel</option>
            {hostels.map(hostel => (
              <option key={hostel._id} value={hostel._id}>
                {hostel.name} (Status: {hostel.status})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Number
          </label>
          <input
            type="text"
            name="roomNumber"
            value={roomData.roomNumber}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 101, A1, etc."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Room Type
          </label>
          <select
            name="roomType"
            value={roomData.roomType}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="Single">Single</option>
            <option value="Double">Double</option>
            <option value="Triple">Triple</option>
            <option value="Dorm">Dorm</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monthly Price (Rs.)
          </label>
          <input
            type="number"
            name="monthlyPrice"
            value={roomData.monthlyPrice}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 5000"
            min="1"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Adding Room...
            </div>
          ) : (
            'Add Room'
          )}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-sm font-medium text-blue-800 mb-2">Debug Info:</h3>
        <p className="text-sm text-blue-700">Hostels found: {hostels.length}</p>
        <p className="text-sm text-blue-700">Selected hostel: {roomData.hostelId || 'None'}</p>
        <p className="text-sm text-blue-700">Check browser console for detailed logs</p>
      </div>
    </div>
  );
};

export default RoomAddTest;