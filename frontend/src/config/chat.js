// Tawk.to Configuration
// Replace these with your actual Tawk.to Property ID and Widget ID
// Get these from your Tawk.to dashboard after creating an account

export const TAWK_CONFIG = {
  // Your actual Property ID from Tawk.to dashboard
  PROPERTY_ID: "6880eb66debf5719175844b4",
  
  // Your actual Widget ID from Tawk.to dashboard  
  WIDGET_ID: "1j0rpf2tk",
  
  // Chat widget settings
  SETTINGS: {
    // Widget position: 'br' (bottom-right), 'bl' (bottom-left), 'tr' (top-right), 'tl' (top-left)
    position: 'br',
    
    // Widget color theme
    color: '#ef4444', // Red color matching your Hostel Hub theme
    
    // Welcome message
    welcomeMessage: "Hi! Welcome to Hostel Hub. How can we help you find the perfect hostel?",
    
    // Offline message
    offlineMessage: "We're currently offline, but feel free to leave us a message!",
    
    // Show on pages
    showOnPages: ['/', '/home', '/hostel', '/map-search'],
    
    // Hide on pages (optional)
    hideOnPages: ['/login', '/signup']
  }
};

// Helper function to check if chat should be shown on current page
export const shouldShowChat = (pathname) => {
  const { showOnPages, hideOnPages } = TAWK_CONFIG.SETTINGS;
  
  // If hideOnPages is defined and current page is in it, don't show
  if (hideOnPages && hideOnPages.includes(pathname)) {
    return false;
  }
  
  // If showOnPages is defined, only show on those pages
  if (showOnPages && showOnPages.length > 0) {
    return showOnPages.includes(pathname);
  }
  
  // Default: show on all pages
  return true;
};