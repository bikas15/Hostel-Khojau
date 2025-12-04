# Tawk.to Chatbot Setup Instructions

## 🚀 Quick Setup Guide

### Step 1: Create Tawk.to Account
1. Go to [https://www.tawk.to/](https://www.tawk.to/)
2. Click "Sign up for free"
3. Create your account with email and password

### Step 2: Create a Property
1. After login, click "Add New Property"
2. Enter your website details:
   - **Property Name**: Hostel Hub
   - **Website URL**: http://localhost:3000 (for development)
   - **Category**: Travel & Tourism
3. Click "Create Property"

### Step 3: Get Your IDs
1. Go to your property dashboard
2. Click on "Administration" → "Chat Widget"
3. You'll see a code snippet like this:
   ```html
   <script type="text/javascript">
   var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
   (function(){
   var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
   s1.async=true;
   s1.src='https://embed.tawk.to/PROPERTY_ID/WIDGET_ID';
   s1.charset='UTF-8';
   s1.setAttribute('crossorigin','*');
   s0.parentNode.insertBefore(s1,s0);
   })();
   </script>
   ```
4. Copy the **PROPERTY_ID** and **WIDGET_ID** from the URL

### Step 4: Configure Your App
1. Create a `.env` file in your `frontend` folder:
   ```bash
   cp .env.example .env
   ```

2. Add your IDs to the `.env` file:
   ```env
   REACT_APP_TAWK_PROPERTY_ID=your_actual_property_id
   REACT_APP_TAWK_WIDGET_ID=your_actual_widget_id
   ```

3. Restart your development server:
   ```bash
   npm start
   ```

### Step 5: Customize Your Chat (Optional)
1. In Tawk.to dashboard, go to "Administration" → "Chat Widget"
2. Customize:
   - **Widget Color**: Match your brand colors
   - **Position**: Bottom right (recommended)
   - **Welcome Message**: "Hi! Welcome to Hostel Hub. How can we help you find the perfect hostel?"
   - **Offline Message**: "We're currently offline, but feel free to leave us a message!"

### Step 6: Set Up AI Chatbot (Optional)
1. Go to "Administration" → "Chatbots"
2. Click "Create New Bot"
3. Set up common questions and answers:
   - "What types of hostels do you have?"
   - "How do I book a room?"
   - "What are your prices?"
   - "Where are you located?"

## 🎯 Features Included

### ✅ What's Working:
- **Auto-loading**: Chat widget loads on all pages
- **Page-specific control**: Show/hide on specific pages
- **Custom styling**: Matches your app theme
- **Mobile responsive**: Works on all devices
- **Custom buttons**: Additional chat triggers
- **Event tracking**: Console logs for debugging

### 🎨 Customization Options:
- **Position**: bottom-right, bottom-left, top-right, top-left
- **Colors**: Customizable to match your brand
- **Messages**: Welcome and offline messages
- **Pages**: Control which pages show the chat
- **Buttons**: Custom chat trigger buttons

## 🔧 Configuration Files:

### `frontend/src/config/chat.js`
- Main configuration file
- Environment variable integration
- Page visibility controls

### `frontend/src/components/TawkToChat.jsx`
- Main chat widget component
- Handles loading and initialization
- Event management

### `frontend/src/components/ChatButton.jsx`
- Custom chat trigger buttons
- Customizable positioning and styling

## 🚨 Troubleshooting:

### Chat not showing?
1. Check your Property ID and Widget ID are correct
2. Make sure `.env` file is in the `frontend` folder
3. Restart your development server
4. Check browser console for errors

### Chat showing on wrong pages?
1. Edit `frontend/src/config/chat.js`
2. Modify `showOnPages` or `hideOnPages` arrays
3. Restart your app

### Styling issues?
1. Check `TAWK_CONFIG.SETTINGS` in `chat.js`
2. Customize colors and position
3. Use browser dev tools to inspect

## 📱 Testing:
1. Open your app in browser
2. Look for chat widget in bottom-right corner
3. Click to open chat
4. Test on different pages
5. Test on mobile devices

## 🎉 You're Done!
Your Hostel Hub app now has a professional chatbot that can help users with:
- Finding hostels
- Booking assistance
- General inquiries
- Support requests

The chat is completely free and will help improve user experience on your platform!