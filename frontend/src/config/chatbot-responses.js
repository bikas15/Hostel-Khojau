// Predefined responses for common questions about Hostel Hub
export const CHATBOT_RESPONSES = {
  // Greetings
  greetings: [
    "Hello! Welcome to Hostel Hub. How can I help you find the perfect hostel today?",
    "Hi there! I'm here to assist you with all your hostel needs. What are you looking for?",
    "Welcome to Hostel Hub! I can help you find hostels, answer booking questions, and more."
  ],

  // Hostel search related
  search: {
    general: "You can search for hostels using our search filters. Try filtering by city (Kathmandu, Lalitpur, Bhaktapur), hostel type (Boys, Girls, Co-ed), or price range. You can also use our interactive map search feature!",
    
    kathmandu: "We have several great hostels in Kathmandu including areas like Thamel, Baneshwor, and Kirtipur. Prices typically range from Rs. 1000-1700 per month. Would you like me to help you find specific hostels in Kathmandu?",
    
    lalitpur: "Lalitpur has excellent hostels near Patan and Pulchowk areas, perfect for students. Prices range from Rs. 900-1600 per month. Many are close to engineering colleges.",
    
    bhaktapur: "Bhaktapur offers peaceful hostel environments, great for students who prefer quieter locations. Prices start from Rs. 800 per month.",
    
    pokhara: "We have hostels in Pokhara's Lakeside area with beautiful mountain views. Perfect for students and travelers alike."
  },

  // Booking process
  booking: {
    process: "To book a hostel: 1) Browse available hostels on our platform 2) Select your preferred room type 3) Click 'Book Now' 4) Fill in your details 5) Complete the payment process. You'll need to create an account first.",
    
    requirements: "For booking, you'll need: Valid ID, Contact information, and payment method. Some hostels may require advance payment or security deposit.",
    
    payment: "We accept various payment methods including online banking, mobile wallets, and card payments. Payment is processed securely through our platform."
  },

  // Pricing information
  pricing: {
    general: "Our hostel prices typically range from Rs. 800 to Rs. 2000 per month, depending on location, amenities, and room type.",
    
    breakdown: "Price ranges by city:\n• Kathmandu: Rs. 1000-1700/month\n• Lalitpur: Rs. 900-1600/month\n• Bhaktapur: Rs. 800-1200/month\n• Pokhara: Rs. 1200-1800/month",
    
    factors: "Pricing depends on: Location, Room type (Single/Double/Triple/Dorm), Amenities included, and Hostel facilities."
  },

  // Hostel types
  types: {
    general: "We offer three types of hostels:\n• Boys Hostels - Male-only accommodation\n• Girls Hostels - Female-only accommodation\n• Co-ed Hostels - Mixed accommodation",
    
    boys: "Boys hostels provide safe, comfortable accommodation for male students and professionals. They often include study rooms, common areas, and security features.",
    
    girls: "Girls hostels offer secure, women-only accommodation with enhanced security measures, common kitchens, and supportive environments.",
    
    coed: "Co-ed hostels welcome both male and female residents, often with separate floors or wings for privacy while maintaining common social areas."
  },

  // Features and amenities
  features: {
    general: "Common hostel amenities include: WiFi, Laundry facilities, 24/7 Security, Study rooms, Common kitchens, Hot water, Parking, and Mess facilities.",
    
    map: "Use our interactive map search feature to find hostels by location. You can see exact locations, nearby facilities, and get directions.",
    
    reviews: "Check hostel reviews and ratings from other students to make informed decisions. You can also leave reviews after your stay."
  },

  // Account and platform help
  account: {
    signup: "To create an account: 1) Click 'Sign Up' 2) Choose your role (User/Owner) 3) Fill in your details 4) Verify your email 5) Start browsing hostels!",
    
    owner: "Hostel owners can register their properties for free! Create an owner account, get admin approval, then list your hostel with photos, amenities, and pricing.",
    
    dashboard: "Users can access 'My Bookings' to manage their reservations. Owners have a dashboard to manage their hostel listings and bookings."
  },

  // Contact and support
  support: {
    general: "For additional support, you can:\n• Use this chat for instant help\n• Contact hostel owners directly through our platform\n• Check our FAQ section\n• Email us for complex issues",
    
    owner_contact: "You can message hostel owners directly through our platform. Look for the 'Message Owner' button on hostel detail pages.",
    
    technical: "For technical issues, try refreshing the page or clearing your browser cache. If problems persist, please contact our support team."
  },

  // Error responses
  errors: {
    not_understood: "I'm not sure I understand that question. Could you please rephrase it? I can help with hostel searches, bookings, pricing, and platform features.",
    
    no_results: "I couldn't find specific information about that. Try asking about:\n• Finding hostels in specific cities\n• Booking process\n• Pricing information\n• Hostel types and amenities",
    
    technical_error: "I'm experiencing some technical difficulties. Please try again in a moment or contact our support team if the issue persists."
  }
};

// Keywords for matching user queries
export const KEYWORDS = {
  greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
  
  locations: {
    kathmandu: ['kathmandu', 'ktm', 'thamel', 'baneshwor', 'kirtipur'],
    lalitpur: ['lalitpur', 'patan', 'pulchowk'],
    bhaktapur: ['bhaktapur', 'bkt'],
    pokhara: ['pokhara', 'lakeside']
  },
  
  booking: ['book', 'booking', 'reserve', 'reservation', 'how to book'],
  pricing: ['price', 'cost', 'fee', 'charge', 'expensive', 'cheap', 'budget'],
  types: ['boys', 'girls', 'co-ed', 'coed', 'mixed', 'male', 'female'],
  features: ['amenities', 'facilities', 'wifi', 'laundry', 'security', 'kitchen'],
  help: ['help', 'support', 'assistance', 'problem', 'issue']
};

// Function to find appropriate response based on user input
export const findResponse = (userInput) => {
  const input = userInput.toLowerCase();
  
  // Check for greetings
  if (KEYWORDS.greetings.some(keyword => input.includes(keyword))) {
    return CHATBOT_RESPONSES.greetings[Math.floor(Math.random() * CHATBOT_RESPONSES.greetings.length)];
  }
  
  // Check for location-specific queries
  for (const [location, keywords] of Object.entries(KEYWORDS.locations)) {
    if (keywords.some(keyword => input.includes(keyword))) {
      return CHATBOT_RESPONSES.search[location];
    }
  }
  
  // Check for booking queries
  if (KEYWORDS.booking.some(keyword => input.includes(keyword))) {
    return CHATBOT_RESPONSES.booking.process;
  }
  
  // Check for pricing queries
  if (KEYWORDS.pricing.some(keyword => input.includes(keyword))) {
    return CHATBOT_RESPONSES.pricing.general;
  }
  
  // Check for hostel type queries
  if (KEYWORDS.types.some(keyword => input.includes(keyword))) {
    return CHATBOT_RESPONSES.types.general;
  }
  
  // Check for help queries
  if (KEYWORDS.help.some(keyword => input.includes(keyword))) {
    return CHATBOT_RESPONSES.support.general;
  }
  
  // Default response for unmatched queries
  return CHATBOT_RESPONSES.errors.not_understood;
};