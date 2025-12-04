import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import TestBooking from '../components/TestBooking';
import RoomDebugger from '../components/RoomDebugger';

const PaymentDemo = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Khalti Mock Payment Demo
          </h1>
          <p className="text-lg text-gray-600">
            Test the hostel booking flow with mock Khalti payment integration
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Demo Instructions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4 text-gray-800">
              🚀 How It Works
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Select Hostel & Room</h3>
                  <p className="text-sm text-gray-600">Choose your preferred hostel and room from the available options</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Fill Booking Details</h3>
                  <p className="text-sm text-gray-600">Enter check-in date and duration of stay</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Mock Payment</h3>
                  <p className="text-sm text-gray-600">Get redirected to mock Khalti payment page</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Test Scenarios</h3>
                  <p className="text-sm text-gray-600">Test successful payment, failure, or cancellation</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-sm font-medium text-green-800 mb-2">✅ Features Included:</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Mock Khalti payment gateway</li>
                <li>• Real booking flow simulation</li>
                <li>• Payment success/failure handling</li>
                <li>• Automatic room availability updates</li>
                <li>• Booking status management</li>
              </ul>
            </div>

            <div className="mt-4 flex space-x-3">
              <Link
                to="/hostels"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
              >
                Browse Hostels
              </Link>
              <Link
                to="/my-bookings"
                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white text-center py-2 px-4 rounded-lg transition-colors"
              >
                My Bookings
              </Link>
            </div>
          </div>

          {/* Test Booking Form */}
          <div>
            <TestBooking />
          </div>

          {/* Room Debugger */}
          <div>
            <RoomDebugger />
          </div>
        </div>

        {/* Payment Flow Diagram */}
        <div className="mt-12 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-6 text-gray-800 text-center">
            📊 Payment Flow Diagram
          </h2>
          
          <div className="flex flex-wrap justify-center items-center space-x-4 space-y-4">
            <div className="bg-blue-100 px-4 py-2 rounded-lg text-center">
              <div className="font-medium text-blue-800">User Selects Room</div>
              <div className="text-sm text-blue-600">Hostel Details Page</div>
            </div>
            
            <div className="text-2xl text-gray-400">→</div>
            
            <div className="bg-purple-100 px-4 py-2 rounded-lg text-center">
              <div className="font-medium text-purple-800">Payment Initiated</div>
              <div className="text-sm text-purple-600">Backend API Call</div>
            </div>
            
            <div className="text-2xl text-gray-400">→</div>
            
            <div className="bg-yellow-100 px-4 py-2 rounded-lg text-center">
              <div className="font-medium text-yellow-800">Mock Khalti Page</div>
              <div className="text-sm text-yellow-600">Test Payment Options</div>
            </div>
            
            <div className="text-2xl text-gray-400">→</div>
            
            <div className="bg-green-100 px-4 py-2 rounded-lg text-center">
              <div className="font-medium text-green-800">Payment Callback</div>
              <div className="text-sm text-green-600">Booking Confirmed</div>
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            🔧 Technical Implementation
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Frontend Components:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• MockPayment.jsx - Payment simulation page</li>
                <li>• PaymentCallback.jsx - Handle payment results</li>
                <li>• mockKhaltiService.js - Mock payment service</li>
                <li>• HostelDetail.jsx - Booking form integration</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Backend Integration:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• khalti.js - Mock payment utilities</li>
                <li>• bookingRoutes.js - Booking API endpoints</li>
                <li>• Booking.js - Database model</li>
                <li>• Payment verification & callback handling</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default PaymentDemo;