// Mock Khalti Service for Testing
class MockKhaltiService {
  static initiateMockPayment(bookingData) {
    return new Promise((resolve) => {
      // Simulate API delay
      setTimeout(() => {
        // Create mock payment URL with test parameters
        const mockPaymentUrl = `/mock-payment?` + 
          `amount=${bookingData.totalPrice * 100}&` +
          `purchase_order_id=${bookingData._id}&` +
          `purchase_order_name=${encodeURIComponent(`Booking for ${bookingData.hostelName}`)}&` +
          `return_url=${encodeURIComponent('http://localhost:3000/payment-callback')}`;
        
        resolve({
          success: true,
          payment_url: mockPaymentUrl,
          pidx: `mock_pidx_${Date.now()}`
        });
      }, 1000);
    });
  }

  static simulatePaymentSuccess(purchaseOrderId) {
    const mockTransactionId = `mock_txn_${Date.now()}`;
    const mockPidx = `mock_pidx_${Date.now()}`;
    
    // Redirect to payment callback with success parameters
    const callbackUrl = `/payment-callback?` +
      `pidx=${mockPidx}&` +
      `transaction_id=${mockTransactionId}&` +
      `status=Completed&` +
      `purchase_order_id=${purchaseOrderId}`;
    
    return callbackUrl;
  }

  static simulatePaymentFailure(purchaseOrderId) {
    const callbackUrl = `/payment-callback?` +
      `pidx=mock_pidx_failed&` +
      `status=Failed&` +
      `purchase_order_id=${purchaseOrderId}`;
    
    return callbackUrl;
  }
}

export default MockKhaltiService;