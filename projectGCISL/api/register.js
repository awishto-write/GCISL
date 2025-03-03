const User = require('./models/User');
const bcrypt = require('bcryptjs');
const connectDB = require('./utils/db');
require('dotenv').config();

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Connect to database
  await connectDB();

  const { firstName, lastName, email, phoneNumber, password, statusType } = req.body;
  const fullName = `${firstName} ${lastName}`;

  // List of allowed admin names
  const allowedAdminNames = [
    'Naomi Dion-Gokan',
    'Justin Keanini',
    'Teni Olugboyega',
    'Darcie Bagott',
    'Cory Bolkan',
  ];

  try {
    // Check if attempting to register as admin and name is authorized
    if (statusType === 'admin' && !allowedAdminNames.includes(fullName)) {
      return res.status(403).json({ error: 'You are not authorized to register as an admin.' });
    }

    // Check if a user with the same email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already in use.' });
    }

    // Create new user with hashed password
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      statusType,
    });

    await newUser.save();
    return res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(400).json({ error: 'User already exists or registration failed.' });
  }
};