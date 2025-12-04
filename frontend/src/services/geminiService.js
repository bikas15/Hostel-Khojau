import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiChatService {
  constructor() {
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY || 'AIzaSyB8kL6ccXlx8PlUJTmQJLIL6nbaAEGvXMs';
    this.genAI = null;
    this.model = null;
    this.chat = null;
    this.initialized = false;
    
    // Debug logging
    console.log('Environment variables:', {
      hasApiKey: !!this.apiKey,
      apiKeyLength: this.apiKey ? this.apiKey.length : 0,
      envVarExists: !!process.env.REACT_APP_GEMINI_API_KEY
    });
  }

  async initialize() {
    if (this.initialized) return;

    if (!this.apiKey || this.apiKey === 'your_gemini_api_key_here') {
      console.error('Gemini API key not found. Please set REACT_APP_GEMINI_API_KEY in your .env file');
      console.log('Current API key:', this.apiKey);
      return;
    }

    console.log('Initializing Gemini AI with API key length:', this.apiKey.length);

    try {
      this.genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      
      // Initialize chat with context about Hostel Hub
      this.chat = this.model.startChat({
        history: [
          {
            role: 'user',
            parts: [{ text: this.getSystemPrompt() }]
          },
          {
            role: 'model',
            parts: [{ text: 'Hello! I\'m your Hostel Hub assistant. I\'m here to help you find the perfect hostel, answer questions about bookings, pricing, locations, and anything else related to hostels. How can I assist you today?' }]
          }
        ],
        generationConfig: {
          maxOutputTokens: 500,
          temperature: 0.7,
        },
      });

      this.initialized = true;
      console.log('Gemini AI chatbot initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Gemini AI:', error);
    }
  }

  getSystemPrompt() {
    return `You are a helpful AI assistant for Hostel Hub, a platform that helps students and travelers find hostels in Nepal, particularly in Kathmandu, Lalitpur, and Bhaktapur.

ABOUT HOSTEL HUB:
- We connect students and travelers with hostel owners
- We offer Boys Hostels, Girls Hostels, and Co-ed hostels
- Price ranges typically from Rs. 800 to Rs. 2000 per month
- We have hostels in major cities: Kathmandu, Lalitpur, Bhaktapur, Pokhara
- Users can search hostels by location, type, and price range
- We have a map search feature to find hostels by location
- Users can book rooms directly through our platform

FEATURES:
- Interactive map to find hostels
- Filter by city, hostel type, and price range
- View hostel details, photos, and amenities
- Direct booking system
- User reviews and ratings
- Owner dashboard for hostel management

COMMON QUESTIONS TO HELP WITH:
- How to search for hostels
- Booking process and requirements
- Pricing information
- Location-specific recommendations
- Hostel types and amenities
- How to contact hostel owners
- Account registration and login

TONE: Be friendly, helpful, and professional. Keep responses concise but informative. Always try to guide users to use the platform features.`;
  }

  async sendMessage(message) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.chat) {
      return {
        success: false,
        message: 'Chatbot is not available at the moment. Please try again later.'
      };
    }

    try {
      const result = await this.chat.sendMessage(message);
      const response = await result.response;
      const text = response.text();

      return {
        success: true,
        message: text,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error sending message to Gemini:', error);
      return {
        success: false,
        message: 'Sorry, I encountered an error. Please try again or contact support.',
        error: error.message
      };
    }
  }

  // Get quick response for common questions
  getQuickResponse(question) {
    const quickResponses = {
      'hello': 'Hello! Welcome to Hostel Hub. How can I help you find the perfect hostel today?',
      'hi': 'Hi there! I\'m here to help you with all your hostel needs. What are you looking for?',
      'help': 'I can help you with:\n• Finding hostels by location\n• Booking information\n• Pricing details\n• Hostel amenities\n• How to use our platform\n\nWhat would you like to know?',
      'price': 'Our hostels typically range from Rs. 800 to Rs. 2000 per month, depending on location and amenities. You can filter by price range on our search page.',
      'location': 'We have hostels in Kathmandu, Lalitpur, Bhaktapur, and Pokhara. Use our map search feature to find hostels in your preferred area.',
      'booking': 'To book a hostel: 1) Browse available hostels 2) Select your preferred room 3) Fill in your details 4) Complete the booking process. You\'ll need to create an account first.'
    };

    const lowerQuestion = question.toLowerCase();
    for (const [key, response] of Object.entries(quickResponses)) {
      if (lowerQuestion.includes(key)) {
        return response;
      }
    }
    return null;
  }

  // Reset chat history
  async resetChat() {
    this.chat = null;
    this.initialized = false;
    await this.initialize();
  }
}

export default new GeminiChatService();