import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Loader } from 'lucide-react';
import geminiService from '../services/geminiService';

const AIChatbot = ({ position = 'bottom-right' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && !isInitialized) {
      initializeChat();
    }
  }, [isOpen, isInitialized]);

  const initializeChat = async () => {
    setIsLoading(true);
    await geminiService.initialize();
    
    // Add welcome message
    const welcomeMessage = {
      id: Date.now(),
      text: "Hello! I'm your Hostel Hub AI assistant. I can help you find hostels, answer questions about bookings, pricing, and more. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date().toISOString()
    };
    
    setMessages([welcomeMessage]);
    setIsInitialized(true);
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    // Check for quick response first
    const quickResponse = geminiService.getQuickResponse(inputMessage);
    
    if (quickResponse) {
      const botMessage = {
        id: Date.now() + 1,
        text: quickResponse,
        sender: 'bot',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
      return;
    }

    // Send to Gemini AI
    const response = await geminiService.sendMessage(inputMessage);
    
    let botText = response.success ? response.message : getFallbackResponse(inputMessage);
    
    const botMessage = {
      id: Date.now() + 1,
      text: botText,
      sender: 'bot',
      timestamp: new Date().toISOString(),
      error: !response.success
    };

    setMessages(prev => [...prev, botMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const quickActions = [
    { text: 'Find hostels in Kathmandu', action: 'Find hostels in Kathmandu' },
    { text: 'How to book a room?', action: 'How do I book a room?' },
    { text: 'Price ranges', action: 'What are the price ranges?' },
    { text: 'Help', action: 'help' }
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  const getFallbackResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi')) {
      return "Hello! Welcome to Hostel Hub! 🏨 I can help you find hostels, answer questions about booking, and provide information about our platform. What would you like to know?";
    }
    
    if (message.includes('kathmandu')) {
      return "We have several great hostels in Kathmandu! Areas include Thamel, Baneshwor, and Kirtipur. Prices typically range from Rs. 1000-1700/month. You can use our map search to find exact locations.";
    }
    
    if (message.includes('price') || message.includes('cost')) {
      return "Our hostel prices typically range from Rs. 800 to Rs. 2000 per month, depending on location and amenities. You can filter by price range on our search page.";
    }
    
    if (message.includes('book')) {
      return "To book a hostel: 1) Browse available hostels 2) Select your preferred room 3) Fill in your details 4) Complete the booking process. You'll need to create an account first.";
    }
    
    if (message.includes('help')) {
      return "I can help you with:\n• Finding hostels by location\n• Booking information\n• Pricing details\n• Hostel amenities\n• How to use our platform\n\nWhat would you like to know?";
    }
    
    return "I'm here to help you with Hostel Hub! I can assist with finding hostels, booking information, pricing, and platform features. What specific information do you need?";
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed ${getPositionClasses()} z-50 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 flex items-center justify-center w-14 h-14`}
        title="Chat with AI Assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${getPositionClasses()} z-40 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col mb-20`}>
          {/* Header */}
          <div className="bg-red-500 text-white p-4 rounded-t-lg flex items-center gap-2">
            <Bot className="h-5 w-5" />
            <div>
              <h3 className="font-semibold">Hostel Hub AI</h3>
              <p className="text-xs opacity-90">Always here to help</p>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg p-3 ${
                    message.sender === 'user'
                      ? 'bg-red-500 text-white'
                      : message.error
                      ? 'bg-red-100 text-red-800 border border-red-200'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && (
                      <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    {message.sender === 'user' && (
                      <User className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-800 rounded-lg p-3 max-w-xs">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <Loader className="h-4 w-4 animate-spin" />
                    <span className="text-sm">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Actions */}
          {messages.length === 1 && !isLoading && (
            <div className="px-4 pb-2">
              <p className="text-xs text-gray-500 mb-2">Quick actions:</p>
              <div className="flex flex-wrap gap-1">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action.action)}
                    className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded transition-colors"
                  >
                    {action.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about hostels..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 text-white rounded-lg px-3 py-2 transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatbot;