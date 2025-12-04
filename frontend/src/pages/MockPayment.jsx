import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const MockPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentData, setPaymentData] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setPaymentData({
      amount: params.get('amount'),
      purchaseOrderId: params.get('purchase_order_id'),
      purchaseOrderName: params.get('purchase_order_name'),
      returnUrl: params.get('return_url')
    });
  }, [location]);

  const handlePaymentSuccess = () => {
    setLoading(true);
    const mockTransactionId = `mock_txn_${Date.now()}`;
    const mockPidx = `mock_pidx_${Date.now()}`;
    
    const callbackUrl = `/payment-callback?` +
      `pidx=${mockPidx}&` +
      `transaction_id=${mockTransactionId}&` +
      `status=Completed&` +
      `purchase_order_id=${paymentData.purchaseOrderId}`;
    
    // Simulate payment processing delay
    setTimeout(() => {
      navigate(callbackUrl);
    }, 2000);
  };

  const handlePaymentFailure = () => {
    setLoading(true);
    const callbackUrl = `/payment-callback?` +
      `pidx=mock_pidx_failed&` +
      `status=Failed&` +
      `purchase_order_id=${paymentData.purchaseOrderId}`;
    
    setTimeout(() => {
      navigate(callbackUrl);
    }, 1000);
  };

  const handlePaymentCancel = () => {
    setLoading(true);
    const callbackUrl = `/payment-callback?` +
      `pidx=mock_pidx_cancelled&` +
      `status=Cancelled&` +
      `purchase_order_id=${paymentData.purchaseOrderId}`;
    
    setTimeout(() => {
      navigate(callbackUrl);
    }, 500);
  };

  const formatAmount = (paisa) => {
    return (parseInt(paisa) / 100).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-md mx-auto pt-20 px-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v2a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Mock Khalti Payment</h1>
            <p className="text-gray-600">Test Payment Gateway</p>
          </div>

          <div className="border-t border-b border-gray-200 py-4 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Order:</span>
              <span className="font-medium">{paymentData.purchaseOrderName}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600">Amount:</span>
              <span className="font-bold text-lg text-green-600">
                Rs. {formatAmount(paymentData.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Order ID:</span>
              <span className="font-mono text-sm">{paymentData.purchaseOrderId}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-yellow-600 mt-0.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h3 className="text-sm font-medium text-yellow-800">Test Mode</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  This is a mock payment for testing. No real money will be charged.
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Processing payment...</p>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handlePaymentSuccess}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                ✅ Simulate Successful Payment
              </button>
              
              <button
                onClick={handlePaymentFailure}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                ❌ Simulate Failed Payment
              </button>
              
              <button
                onClick={handlePaymentCancel}
                className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                🚫 Cancel Payment
              </button>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Test Credentials: Use any values for testing
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MockPayment;