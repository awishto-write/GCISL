const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config(); // Load environment variables from .env

const app = express();
app.use(express.json()); // Parse JSON requests
const allowedOrigins = [
  'http://localhost:3000', // For local testing
  'https://gciconnect.vercel.app' // Replace with your deployed frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true); // Allow access
    } else {
      callback(new Error('Not allowed by CORS')); // Block access
    }
  }
}));
//app.use(cors()); // Allow requests from the frontend

//Add the CSP Middleware Here
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline';"
  );
  next();
});

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String, // Store hashed password
  statusType: String, // 'admin' or 'volunteer'
});

const User = mongoose.model('User', userSchema);

// List of Allowed Admin Names
// const allowedAdminNames = [
//   'Admin One',
//   'Admin Two',
//   'Developer One',
//   'Developer Two',
//   'Developer Three',
// ];
const allowedAdminNames = [
  'Naomi Dion-Gokan',
  'Justin Keanini',
  'Teni Olugboyega',
  'Darcie Bagott',
  'Cory Bolkan',
];

// Register Route
//app.post('/register', async (req, res) => {
app.post('/api/register', async (req, res) => {
  console.log('Request received:', req.body);  // Debug log
  const { firstName, lastName, email, phoneNumber, password, statusType } = req.body;
  const fullName = `${firstName} ${lastName}`;

  try {
    // Check if the full name is authorized to register as an admin
    if (statusType === 'admin' && !allowedAdminNames.includes(fullName)) {
      return res.status(403).json({ error: 'You are not authorized to register as an admin.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      statusType,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'User already exists or registration failed.' });
  }
});

// Login Route
//app.post('/login', async (req, res) => {
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password.' });

    // Generate a JWT with user info
    const token = jwt.sign(
      { userId: user._id, statuTypes: user.statusType },
      process.env.JWT_SECRET || 'yourSecretKey', // Use a secure key in production
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login successful', token, statusType: user.statusType });
  } 
  catch (error) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Protected Admin Route (Optional Example)
//app.get('/admin-dashboard', (req, res) => {
app.get('/api/admin-dashboard', (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard!' });
});

// Protected Volunteer Route (Optional Example)
//app.get('/volunteer-dashboard', (req, res) => {
app.get('/api/volunteer-dashboard', (req, res) => {
  res.json({ message: 'Welcome to the Volunteer Dashboard!' });
});

// Start the Server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));