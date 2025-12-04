# Hostel Hub - Setup & Usage Guide

A comprehensive hostel booking platform with mock Khalti payment integration, AI chatbot, and real-time features.

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or cloud)
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hostel-hub
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file in the `backend` directory:
```env
# Database
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/hostel-hub?retryWrites=true&w=majority
MONGO_URI=mongodb+srv://your-username:your-password@cluster0.mongodb.net/hostel-hub?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your-super-secret-jwt-key

# Khalti Test Configuration (Mock Payment)
KHALTI_SECRET_KEY=test_secret_key_f59e8b7d18b4499ca40f68195a846b9b
KHALTI_PUBLIC_KEY=test_public_key_dc74e0fd797d4cd49c4dcc3b20b99cc2a
KHALTI_GATEWAY_URL=https://a.khalti.com

# Server Configuration
BACKEND_URI=http://localhost:5000
FRONTEND_URI=http://localhost:5173
```

Start the backend server:
```bash
npm start
# or for development
npm run dev
```
**Backend runs on:** `http://localhost:5000`

### 3. Frontend Setup
```bash
cd frontend
npm install
```

Create `.env` file in the `frontend` directory:
```env
# Google Gemini AI Configuration (for chatbot)
REACT_APP_GEMINI_API_KEY=your-gemini-api-key

# Khalti Test Configuration
KHALTI_SECRET_KEY=test_secret_key_f59e8b7d18b4499ca40f68195a846b9b
KHALTI_PUBLIC_KEY=test_public_key_dc74e0fd797d4cd49c4dcc3b20b99cc2a
KHALTI_GATEWAY_URL=https://a.khalti.com
```

Start the frontend server:
```bash
npm run dev
```
**Frontend runs on:** `http://localhost:5173`

## 🎯 Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | `http://localhost:5173` | Main application |
| **Backend API** | `http://localhost:5000` | REST API server |
| **Payment Demo** | `http://localhost:5173/payment-demo` | Test payment flow |
| **Mock Payment** | `http://localhost:5173/mock-payment` | Khalti mock gateway |
| **Admin Dashboard** | `http://localhost:5173/admin/dashboard` | Admin panel |
| **Owner Dashboard** | `http://localhost:5173/owner/hostels` | Hostel owner panel |

## 👥 User Roles & Access

### 1. **Regular Users**
- Browse and search hostels
- Book rooms with mock payment
- View booking history
- Chat with hostel owners
- Leave reviews

**Test Account:**
- Create new account via signup
- Or use existing user credentials

### 2. **Hostel Owners**
- Register and manage hostels
- Add/edit rooms
- View bookings and revenue
- Chat with customers
- Manage reviews

**How to become owner:**
1. Sign up with role "owner"
2. Wait for admin approval
3. Register your hostel
4. Add rooms to your hostel

### 3. **Administrators**
- Approve hostel owners
- Manage all hostels
- View system analytics
- Moderate content

**Admin Access:**
- Create admin account in database
- Or promote existing user to admin role

## 🏨 Core Features

### Hostel Management
- **Browse Hostels:** View all available hostels with filters
- **Hostel Details:** Photos, 360° views, amenities, location
- **Room Types:** Single, Double, Triple, Dorm rooms
- **Pricing:** Monthly rental rates
- **Availability:** Real-time room availability

### Booking System
- **Room Selection:** Choose from available rooms
- **Date Selection:** Check-in date and duration
- **Mock Payment:** Test Khalti payment integration
- **Booking Confirmation:** Automatic confirmation system
- **Booking History:** View past and current bookings

### Payment Integration
- **Mock Khalti Gateway:** Safe testing environment
- **Payment Scenarios:** Success, failure, cancellation
- **Transaction Tracking:** Complete payment history
- **Automatic Refunds:** For cancelled bookings

### Communication
- **Real-time Chat:** Direct messaging between users and owners
- **AI Chatbot:** Powered by Google Gemini AI
- **Review System:** Rate and review hostels
- **Notifications:** Toast notifications for all actions

## 🔧 API Endpoints

### Authentication
```
POST /api/auth/register    - User registration
POST /api/auth/login       - User login
GET  /api/auth/user        - Get current user
```

### Hostels
```
GET    /api/hostels           - Get all hostels
GET    /api/hostels/:id       - Get hostel details
POST   /api/hostels           - Create hostel (owner)
PUT    /api/hostels/:id       - Update hostel (owner)
DELETE /api/hostels/:id       - Delete hostel (owner)
GET    /api/hostels/:id/rooms - Get hostel rooms
```

### Bookings
```
POST /api/bookings/:hostelId/book              - Create booking
GET  /api/bookings/my-bookings                 - Get user bookings
GET  /api/bookings/complete-khalti-payment     - Payment callback
POST /api/bookings/:bookingId/cancel-payment   - Cancel payment
GET  /api/bookings/room-details/:roomId        - Debug room details
POST /api/bookings/reset-room-availability/:roomId - Reset room availability
```

### Owner Routes
```
GET  /api/owner/hostels                    - Get owner hostels
POST /api/owner/hostels/:id/rooms          - Add room to hostel
GET  /api/owner/bookings                   - Get hostel bookings
```

### Admin Routes
```
GET  /api/admin/dashboard     - Admin dashboard data
POST /api/admin/approve-owner - Approve hostel owner
GET  /api/admin/users         - Get all users
```

### Chat & Reviews
```
GET    /api/chats                    - Get user chats
POST   /api/chats                    - Send message
POST   /api/chats/:id/message        - Reply to chat
GET    /api/reviews/:hostelId        - Get hostel reviews
POST   /api/reviews/:hostelId        - Add review
DELETE /api/reviews/:hostelId/:id    - Delete review
```

## 🧪 Testing the Application

### 1. **Basic Flow Test**
1. Visit `http://localhost:5173`
2. Sign up as a new user
3. Browse available hostels
4. Select a room and book it
5. Complete mock payment
6. Check booking in "My Bookings"

### 2. **Owner Flow Test**
1. Sign up with role "owner"
2. Wait for admin approval (or approve via database)
3. Register a new hostel
4. Add rooms to your hostel
5. View bookings in owner dashboard

### 3. **Payment Testing**
1. Visit `http://localhost:5173/payment-demo`
2. Use the test booking form
3. Try all payment scenarios:
   - ✅ Successful payment
   - ❌ Failed payment
   - 🚫 Cancelled payment

### 4. **Room Availability Debug**
If you encounter "Room not available" errors:
1. Go to `/payment-demo`
2. Use the Room Debugger tool
3. Enter the room ID
4. Click "Reset Availability"
5. Try booking again
