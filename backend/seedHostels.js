const { createHash } = require('node:crypto');
const mongoose = require('mongoose');
const Hostel = require('./models/Hostel');
const Room = require('./models/Room');
const User = require('./models/User');
require('dotenv').config();

function seedId(...parts) {
  const hash = createHash('sha256').update(parts.join(':')).digest('hex');
  return new mongoose.Types.ObjectId(hash.slice(0, 24));
}

async function seedHostels() {
  const ownerEmail = process.argv[2]?.trim().toLowerCase();
  if (!process.env.MONGODB_URI || !ownerEmail) {
    throw new Error('Set MONGODB_URI and run npm run seed:hostels -- owner@example.com');
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const owner = await User.findOne({ email: ownerEmail, role: 'owner' });
  if (!owner) throw new Error('No owner account matches the supplied email.');

  const hostels = [
    {
      name: "Demo - Sunrise Hostel",
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
      status: "active",
      isApproved: true,
      isFeatured: true,
      images: [
        "/images/hostels/sample1.jpg"
      ],
      images360: []
    },
    {
      name: "Demo - Everest View Hostel",
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
      status: "active",
      isApproved: true,
      isFeatured: true,
      images: [
        "/images/hostels/sample2.jpg"
      ],
      images360: []
    },
    {
      name: "Demo - City Center Hostel",
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
      status: "active",
      isApproved: true,
      isFeatured: false,
      images: [
        "/images/hostels/sample3.jpg"
      ],
      images360: []
    },
    {
      name: "Demo - Peaceful Stay Hostel",
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
      status: "active",
      isApproved: true,
      isFeatured: true,
      images: [
        "/images/hostels/sample4.jpg"
      ],
      images360: []
    },
    {
      name: "Demo - Green Valley Hostel",
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
      status: "active",
      isApproved: true,
      isFeatured: false,
      images: [
        "/images/hostels/sample5.jpg"
      ],
      images360: []
    },
    {
      name: "Demo - Royal Girls Hostel",
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
      status: "active",
      isApproved: true,
      isFeatured: true,
      images: [
        "/images/hostels/sample1.jpg"
      ],
      images360: []
    },
    {
      name: "Demo - Student Hub Hostel",
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
      status: "active",
      isApproved: true,
      isFeatured: false,
      images: [
        "/images/hostels/sample2.jpg"
      ],
      images360: []
    },
    {
      name: "Demo - Heritage Hostel",
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
      status: "active",
      isApproved: true,
      isFeatured: true,
      images: [
        "/images/hostels/sample3.jpg"
      ],
      images360: []
    }
  ];

  const roomTypes = ['Single', 'Double', 'Triple'];
  for (const sample of hostels) {
    const hostelId = seedId('demo-hostel', owner.id, sample.name);
    await Hostel.updateOne(
      { _id: hostelId },
      { $setOnInsert: { ...sample, owner: owner._id } },
      { upsert: true, runValidators: true }
    );

    const roomIds = [];
    for (const [index, roomType] of roomTypes.entries()) {
      const roomNumber = String(101 + index);
      const roomId = seedId('demo-room', hostelId, roomNumber);
      const { min, max } = sample.priceRange;
      await Room.updateOne(
        { _id: roomId },
        { $setOnInsert: {
          hostel: hostelId,
          roomNumber,
          roomType,
          monthlyPrice: Math.round(max - index * (max - min) / 2)
        } },
        { upsert: true, runValidators: true }
      );
      roomIds.push(roomId);
    }

    await Hostel.updateOne(
      { _id: hostelId },
      { $addToSet: { rooms: { $each: roomIds } } }
    );
  }

  console.log(`Seeded ${hostels.length} demo hostels with ${roomTypes.length} rooms each.`);
}

seedHostels()
  .catch(error => {
    console.error('Demo seed failed:', error.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.disconnect());
