import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TAWK_CONFIG, shouldShowChat } from '../config/chat';

const TawkToChat = ({ 
  propertyId = TAWK_CONFIG.PROPERTY_ID, 
  widgetId = TAWK_CONFIG.WIDGET_ID 
}) => {
  const location = useLocation();
  useEffect(() => {
    // Check if chat should be shown on current page
    if (!shouldShowChat(location.pathname)) {
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
      return;
    }

    // Don't load if IDs are not set
    if (propertyId === "YOUR_PROPERTY_ID" || widgetId === "YOUR_WIDGET_ID") {
      console.warn('Tawk.to: Please set your Property ID and Widget ID in the configuration');
      return;
    }

    // Debug: Log the IDs being used
    console.log('Tawk.to: Loading with Property ID:', propertyId);
    console.log('Tawk.to: Loading with Widget ID:', widgetId);

    // Check if Tawk.to is already loaded
    if (window.Tawk_API && window.Tawk_LoadStart) {
      // Show widget if it was hidden
      if (window.Tawk_API.showWidget) {
        window.Tawk_API.showWidget();
      }
      return;
    }

    // Initialize Tawk_API
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();

    // Create and inject the script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    
    // Handle script loading errors
    script.onerror = function() {
      console.error('Tawk.to: Failed to load chat widget script');
    };
    
    script.onload = function() {
      console.log('Tawk.to: Script loaded successfully');
    };
    
    // Add the script to the document head
    document.head.appendChild(script);

    // Customize the widget when it loads
    window.Tawk_API.onLoad = function() {
      console.log('Tawk.to chat widget loaded successfully!');
      
      // Set custom attributes
      window.Tawk_API.setAttributes({
        'name': 'Hostel Hub Support',
        'email': 'support@hostelhub.com'
      }, function(error) {
        if (error) {
          console.error('Error setting Tawk.to attributes:', error);
        }
      });

      // Customize appearance
      window.Tawk_API.customStyle = {
        visibility: {
          desktop: {
            position: TAWK_CONFIG.SETTINGS.position,
            xOffset: '20px',
            yOffset: '20px'
          },
          mobile: {
            position: TAWK_CONFIG.SETTINGS.position,
            xOffset: '10px',
            yOffset: '10px'
          }
        }
      };
    };

    // Handle chat events
    window.Tawk_API.onChatMaximized = function() {
      console.log('Chat maximized');
    };

    window.Tawk_API.onChatMinimized = function() {
      console.log('Chat minimized');
    };

    window.Tawk_API.onChatStarted = function() {
      console.log('Chat started');
    };

    // Cleanup function
    return () => {
      // Don't remove script on route changes, just hide/show widget
      if (window.Tawk_API && window.Tawk_API.hideWidget) {
        window.Tawk_API.hideWidget();
      }
    };
  }, [propertyId, widgetId, location.pathname]);

  return null; // This component doesn't render anything visible
};

export default TawkToChat;