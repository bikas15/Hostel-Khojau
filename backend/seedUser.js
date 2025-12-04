const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
require('dotenv').config();

async function seedTestUser() {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.error('MongoDB connection error:', err));
    
    const email = 'testuser@example.com';
    const plainPassword = 'testpassword123';

    // Remove any existing test user
    await User.deleteOne({ email });

    const hashedPassword = await bcrypt.hash(plainPassword, 12);

    const user = new User({
      name: 'Test User',
      email,
      password: hashedPassword,
      role: 'user',
      isApproved: true
    });

    await user.save();
    console.log('Test user created:');
    console.log({ email, password: plainPassword });
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedTestUser();