import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm your Hostel Hub AI assistant 🏨 I can help you find the perfect hostel, answer questions about booking, pricing, and more. What can I help you with today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Simple AI responses based on keywords
  const getAIResponse = (userMessage) => {
    const message = userMessage.toLowerCase();
    
    // Greeting responses
    if (message.includes('hi') || message.includes('hello') || message.includes('hey')) {
      return "Hello! Welcome to Hostel Hub 🏨 I'm here to help you find the perfect accommodation. What type of hostel are you looking for?";
    }
    
    // Search queries
    if (message.includes('find') || message.includes('search') || message.includes('looking for')) {
      return "I'd love to help you find a hostel! 🔍 You can:\n\n• Browse all hostels on our main page\n• Use Map Search to see locations\n• Filter by city, type, or price\n\nWhat's your preferred location? (Kathmandu, Lalitpur, Bhaktapur, or Pokhara)";
    }
    
    // Location queries
    if (message.includes('kathmandu') || message.includes('ktm')) {
      return "Kathmandu has excellent hostels! 🏙️ Popular areas:\n\n• Thamel - Vibrant, tourist-friendly\n• Baneshwor - Great connectivity\n• Kirtipur - Near universities\n\nPrices range from Rs. 8,000-18,000/month. Would you like boys, girls, or co-ed hostels?";
    }
    
    if (message.includes('lalitpur') || message.includes('patan')) {
      return "Lalitpur is perfect for students! 🎓 Key areas:\n\n• Patan Durbar Square - Heritage location\n• Pulchowk - Near engineering campus\n\nTypical prices: Rs. 9,000-16,000/month. Check our map for exact locations!";
    }
    
    if (message.includes('bhaktapur')) {
      return "Bhaktapur offers peaceful living! 🏛️ Great for students who prefer quieter environments. Prices around Rs. 8,000-12,000/month. Perfect for focused studying!";
    }
    
    if (message.includes('pokhara')) {
      return "Pokhara hostels have amazing mountain views! 🏔️ Lakeside area is popular. Prices: Rs. 12,000-18,000/month. Great for both students and tourists!";
    }
    
    // Hostel type queries
    if (message.includes('boys') || message.includes('male') || message.includes('men')) {
      return "We have many boys hostels available! 👨‍🎓 They typically offer:\n\n• Separate floors/buildings\n• Male-only facilities\n• Study-friendly environment\n\nWhich city interests you most?";
    }
    
    if (message.includes('girls') || message.includes('female') || message.includes('women')) {
      return "Our girls hostels are very popular! 👩‍🎓 Features include:\n\n• Enhanced security\n• Female-only spaces\n• Safe environment\n\nWould you like options in a specific city?";
    }
    
    if (message.includes('co-ed') || message.includes('mixed') || message.includes('coed')) {
      return "Co-ed hostels offer great social environments! 👫 They provide:\n\n• Mixed common areas\n• Separate sleeping quarters\n• Diverse community\n\nWhich location would you prefer?";
    }
    
    // Pricing queries
    if (message.includes('price') || message.includes('cost') || message.includes('expensive') || message.includes('cheap') || message.includes('budget')) {
      return "Here's our pricing breakdown! 💰\n\n• Budget: Rs. 5,000-10,000/month\n• Standard: Rs. 10,000-15,000/month\n• Premium: Rs. 15,000-20,000/month\n\nPrices vary by location and amenities. What's your budget range?";
    }
    
    // Booking queries
    if (message.includes('book') || message.includes('reserve') || message.includes('how to book')) {
      return "Booking is super easy! 📝 Here's how:\n\n1. Browse hostels or use Map Search\n2. Click 'View Details' on your choice\n3. Select available room\n4. Pick check-in date\n5. Complete secure payment\n6. Get instant confirmation!\n\nReady to start browsing?";
    }
    
    // Amenities queries
    if (message.includes('wifi') || message.includes('internet')) {
      return "Most hostels offer free WiFi! 📶 Look for the WiFi amenity when browsing. Need help finding hostels with reliable internet?";
    }
    
    if (message.includes('food') || message.includes('mess') || message.includes('kitchen')) {
      return "Food arrangements vary! 🍽️\n\n• Some have mess facilities\n• Others provide kitchen access\n• Many are near restaurants\n\nCheck individual hostel amenities for specific food options!";
    }
    
    if (message.includes('security') || message.includes('safety') || message.includes('safe')) {
      return "Safety is our top priority! 🔒 Most hostels offer:\n\n• 24/7 Security guards\n• CCTV monitoring\n• Secure entry systems\n• Safe storage lockers\n\nAll our partner hostels meet safety standards!";
    }
    
    // Help and support
    if (message.includes('help') || message.includes('support') || message.includes('problem')) {
      return "I'm here to help! 🤝 I can assist with:\n\n• Finding hostels by location/type\n• Pricing information\n• Booking process\n• Amenities and facilities\n• General questions\n\nWhat specific help do you need?";
    }
    
    // Default response
    return "I'd be happy to help you with that! 🏨 I can assist with:\n\n• Finding hostels in specific cities\n• Comparing prices and amenities\n• Booking process guidance\n• Answering questions about facilities\n\nCould you be more specific about what you're looking for?";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        text: getAIResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? 'rotate-180' : ''
        }`}
        title="Chat with AI Assistant"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-96 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <h3 className="font-semibold">Hostel Hub AI Assistant</h3>
            </div>
            <p className="text-xs opacity-90">Ask me anything about hostels!</p>
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
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {message.sender === 'bot' && <Bot className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    {message.sender === 'user' && <User className="h-4 w-4 mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="text-sm whitespace-pre-line">{message.text}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3 max-w-xs">
                  <div className="flex items-center gap-2">
                    <Bot className="h-4 w-4" />
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about hostels, pricing, booking..."
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isTyping}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 text-white rounded-lg px-4 py-2 transition-colors"
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

export default AIChat;