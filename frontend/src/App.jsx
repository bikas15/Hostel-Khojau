import { Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import './index.css';
import Hostel from './pages/Hostel';
import HostelDetails from './pages/HostelDetail';
import RegisterHostelForm from './components/RegisterHostelForm';
import OwnerDashboard from './pages/OwnerDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentCallback from './pages/PaymentCallback';
import MockPayment from './pages/MockPayment';
import PaymentDemo from './pages/PaymentDemo';
import TestBooking from './components/TestBooking';
import PendingApproval from './components/PendingApproval';
import MyBookings from './pages/MyBookings';
import MapSearch from './components/MapSearch';
import AIChatbot from './components/AIChatbot';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/hostel" element={<Hostel />} />
        <Route path="/hostels/:id" element={<HostelDetails />} />
        <Route path="/register-hostel" element={<RegisterHostelForm />} />
        <Route path="/owner/hostels" element={<OwnerDashboard />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/payment-callback" element={<PaymentCallback />} />
        <Route path="/mock-payment" element={<MockPayment />} />
        <Route path="/payment-demo" element={<PaymentDemo />} />
        <Route path="/test-booking" element={<TestBooking />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/map-search" element={<MapSearch />} /> 
      </Routes>
      
      {/* AI Chatbot - Available on all pages */}
      <AIChatbot position="bottom-right" />
      
      {/* Global Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default App;