import React from 'react';
import { MessageCircle } from 'lucide-react';

const ChatButton = ({ 
  position = 'bottom-right', 
  customStyle = {},
  showText = true 
}) => {
  const handleChatClick = () => {
    // Trigger custom AI chatbot
    const chatButton = document.querySelector('[title="Chat with AI Assistant"]');
    if (chatButton) {
      chatButton.click();
    } else {
      console.log('AI chatbot is not loaded yet');
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-left':
        return 'bottom-6 left-6';
      case 'bottom-right':
        return 'bottom-6 right-6';
      case 'top-right':
        return 'top-6 right-6';
      case 'top-left':
        return 'top-6 left-6';
      default:
        return 'bottom-6 right-6';
    }
  };

  return (
    <button
      onClick={handleChatClick}
      className={`fixed ${getPositionClasses()} z-50 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center gap-2 px-4 py-3`}
      style={customStyle}
      title="Chat with us"
    >
      <MessageCircle className="h-5 w-5" />
      {showText && (
        <span className="font-medium text-sm hidden sm:inline">
          Need Help?
        </span>
      )}
    </button>
  );
};

export default ChatButton;