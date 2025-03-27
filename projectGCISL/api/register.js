const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

console.log("Environment Variables:", process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String,
  statusType: String,
});

const User = mongoose.model('User', userSchema);

const allowedAdminNames = [
  'Naomi Dion-Gokan',
  'Justin Keanini',
  'Teni Olugboyega',
  'Darcie Bagott',
  'Cory Bolkan',
];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { firstName, lastName, email, phoneNumber, password, statusType } = req.body;
  const fullName = `${firstName} ${lastName}`;

  try {
    console.log('Received registration:', req.body);

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }

    if (statusType === 'admin' && !allowedAdminNames.includes(fullName)) {
      console.log('Unauthorized admin registration attempt:', fullName);
      return res.status(403).json({ error: 'You are not authorized to register as an admin.' });
    }

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
    console.log('User registered successfully:', email);
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).json({ error: 'User registration failed.' });
  }
};