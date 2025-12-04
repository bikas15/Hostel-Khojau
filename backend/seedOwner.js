const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function seedOwner() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
    
    const owner = new User({
      name: "Owner User",
      email: "owner@example.com",
      password: "password123", // Change to a hashed password if needed
      role: "owner"
    });
    await owner.save();
    console.log('Owner user created:', owner);
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedOwner();