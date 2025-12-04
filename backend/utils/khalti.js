const axios = require("axios");

// Check if we're in test/mock mode
const isMockMode = process.env.KHALTI_SECRET_KEY?.includes('test_') || process.env.NODE_ENV === 'development';

async function verifyKhaltiPayment(pidx) {
  // Mock verification for testing
  if (isMockMode || pidx.startsWith('mock_pidx_')) {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (pidx.includes('failed')) {
          resolve({
            status: 'Failed',
            transaction_id: null,
            total_amount: 0
          });
        } else if (pidx.includes('cancelled')) {
          resolve({
            status: 'Cancelled',
            transaction_id: null,
            total_amount: 0
          });
        } else {
          resolve({
            status: 'Completed',
            transaction_id: `mock_txn_${Date.now()}`,
            total_amount: 1000, // This will be overridden by actual amount check
            pidx: pidx
          });
        }
      }, 500);
    });
  }

  const headersList = {
    "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify({ pidx });

  const reqOptions = {
    url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/lookup/`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  try {
    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    console.error("Error verifying Khalti payment:", error.response?.data || error.message);
    throw error;
  }
}

async function initializeKhaltiPayment(details) {
  // Mock initialization for testing
  if (isMockMode) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockPidx = `mock_pidx_${Date.now()}`;
        resolve({
          pidx: mockPidx,
          payment_url: `${process.env.FRONTEND_URI || 'http://localhost:5173'}/mock-payment?amount=${details.amount}&purchase_order_id=${details.purchase_order_id}&purchase_order_name=${encodeURIComponent(details.purchase_order_name)}&return_url=${encodeURIComponent(details.return_url)}`,
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes from now
        });
      }, 1000);
    });
  }

  const headersList = {
    "Authorization": `Key ${process.env.KHALTI_SECRET_KEY}`,
    "Content-Type": "application/json",
  };

  const bodyContent = JSON.stringify(details);

  const reqOptions = {
    url: `${process.env.KHALTI_GATEWAY_URL}/api/v2/epayment/initiate/`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  try {
    const response = await axios.request(reqOptions);
    return response.data;
  } catch (error) {
    console.error("Error initializing Khalti payment:", error.response?.data || error.message);
    throw error;
  }
}

module.exports = { verifyKhaltiPayment, initializeKhaltiPayment };