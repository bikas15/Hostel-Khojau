const mongoose = require('mongoose');
const Hostel = require('./models/Hostel');
const User = require('./models/User');
require('dotenv').config();

async function seedHostels() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
    
    // Find an owner user (make sure you have at least one owner in your users collection)
    const owner = await User.findOne({ role: 'owner' });
    if (!owner) {
      throw new Error('No owner user found. Please register an owner first.');
    }

    const hostels = [
      {
        name: "Sunrise Hostel",
        location: "Thamel",
        address: "Thamel Marg, Kathmandu 44600",
        coordinates: {
          latitude: 27.7172,
          longitude: 85.3240
        },
        city: "Kathmandu",
        description: "A cozy hostel in the heart of Kathmandu.",
        hostelType: "Co-ed",
        priceRange: { min: 1000, max: 1500 },
        amenities: ["WiFi", "Laundry", "24/7 Security"],
        rooms: [],
        bookings: [],
        owner: owner._id,
        contact: { phone: "9800000001", email: "info@sunrisehostel.com" },
        status: "active",
        isApproved: true,
        isFeatured: true,
        images: [
          "/images/hostels/sample1.jpg"
        ],
        images360: []
      },
      {
        name: "Everest View Hostel",
        location: "Lakeside",
        address: "Lakeside Road, Pokhara 33700",
        coordinates: {
          latitude: 28.2096,
          longitude: 83.9856
        },
        city: "Pokhara",
        description: "Enjoy mountain views and peaceful surroundings.",
        hostelType: "Boys Hostel",
        priceRange: { min: 1200, max: 1800 },
        amenities: ["WiFi", "Breakfast", "Parking"],
        rooms: [],
        bookings: [],
        owner: owner._id,
        contact: { phone: "9800000002", email: "info@everestview.com" },
        status: "active",
        isApproved: true,
        isFeatured: true,
        images: [
          "/images/hostels/sample2.jpg"
        ],
        images360: []
      },
      {
        name: "City Center Hostel",
        location: "Patan Durbar Square",
        address: "Patan Durbar Square, Lalitpur 44700",
        coordinates: {
          latitude: 27.6744,
          longitude: 85.3244
        },
        city: "Lalitpur",
        description: "Affordable stay near major attractions.",
        hostelType: "Girls Hostel",
        priceRange: { min: 900, max: 1300 },
        amenities: ["WiFi", "Kitchen", "Hot Water"],
        rooms: [],
        bookings: [],
        owner: owner._id,
        contact: { phone: "9800000003", email: "info@citycenter.com" },
        status: "active",
        isApproved: true,
        isFeatured: false,
        images: [
          "/images/hostels/sample3.jpg"
        ],
        images360: []
      },
      {
        name: "Peaceful Stay Hostel",
        location: "Bhaktapur Durbar Square",
        address: "Durbar Square, Bhaktapur 44800",
        coordinates: {
          latitude: 27.6710,
          longitude: 85.4298
        },
        city: "Bhaktapur",
        description: "Quiet and peaceful environment for students.",
        hostelType: "Boys Hostel",
        priceRange: { min: 800, max: 1200 },
        amenities: ["WiFi", "Study Room", "Cafeteria"],
        rooms: [],
        bookings: [],
        owner: owner._id,
        contact: { phone: "9800000004", email: "info@peacefulstay.com" },
        status: "active",
        isApproved: true,
        isFeatured: true,
        images: [
          "/images/hostels/sample4.jpg"
        ],
        images360: []
      },
      {
        name: "Green Valley Hostel",
        location: "Kirtipur Municipality",
        address: "Kirtipur Municipality, Kathmandu 44618",
        coordinates: {
          latitude: 27.6789,
          longitude: 85.2951
        },
        city: "Kirtipur",
        description: "Surrounded by greenery, perfect for nature lovers.",
        hostelType: "Co-ed",
        priceRange: { min: 1100, max: 1600 },
        amenities: ["WiFi", "Garden", "Laundry"],
        rooms: [],
        bookings: [],
        owner: owner._id,
        contact: { phone: "9800000005", email: "info@greenvalley.com" },
        status: "active",
        isApproved: true,
        isFeatured: false,
        images: [
          "/images/hostels/sample5.jpg"
        ],
        images360: []
      },
      {
        name: "Royal Girls Hostel",
        location: "Baneshwor",
        address: "Baneshwor, Kathmandu 44600",
        coordinates: {
          latitude: 27.6915,
          longitude: 85.3438
        },
        city: "Kathmandu",
        description: "Safe and comfortable stay for girls.",
        hostelType: "Girls Hostel",
        priceRange: { min: 1300, max: 1700 },
        amenities: ["WiFi", "Security", "Mess"],
        rooms: [],
        bookings: [],
        owner: owner._id,
        contact: { phone: "9800000006", email: "info@royalgirls.com" },
        status: "active",
        isApproved: true,
        isFeatured: true,
        images: [
          "/images/hostels/sample6.jpg"
        ],
        images360: []
      },
      {
        name: "Student Hub Hostel",
        location: "Pulchowk",
        address: "Pulchowk Campus Area, Lalitpur 44700",
        coordinates: {
          latitude: 27.6781,
          longitude: 85.3168
        },
        city: "Lalitpur",
        description: "Ideal for engineering students, close to campus.",
        hostelType: "Boys Hostel",
        priceRange: { min: 950, max: 1400 },
        amenities: ["WiFi", "Study Room", "Parking"],
        rooms: [],
        bookings: [],
        owner: owner._id,
        contact: { phone: "9800000007", email: "info@studenthub.com" },
        status: "active",
        isApproved: true,
        isFeatured: false,
        images: [
          "/images/hostels/sample7.jpg"
        ],
        images360: []
      },
      {
        name: "Heritage Hostel",
        location: "Patan",
        address: "Patan Museum Area, Lalitpur 44700",
        coordinates: {
          latitude: 27.6766,
          longitude: 85.3250
        },
        city: "Lalitpur",
        description: "Experience heritage living with modern facilities.",
        hostelType: "Co-ed",
        priceRange: { min: 1050, max: 1550 },
        amenities: ["WiFi", "Cultural Events", "Laundry"],
        rooms: [],
        bookings: [],
        owner: owner._id,
        contact: { phone: "9800000008", email: "info@heritagehostel.com" },
        status: "active",
        isApproved: true,
        isFeatured: true,
        images: [
          "/images/hostels/sample8.jpg"
        ],
        images360: []
      }
    ];

    await Hostel.deleteMany({});
    await Hostel.insertMany(hostels);
    console.log('Sample hostels inserted!');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}
seedHostels();