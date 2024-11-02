const express = require('express');
const serverless = require('serverless-http'); // Required for Vercel serverless deployment
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(express.json());

console.log("Backend server is running"); // For development logging
app.get('/test', (req, res) => {
  res.json({ message: "Test endpoint works!" });
});

// Configure CORS to allow requests from specific origins
const allowedOrigins = [
  'http://localhost:3000', // Local frontend URL for testing
  'https://gciconnect.vercel.app' // Production frontend URL
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      // Allow requests with no origin, like curl or server-to-server requests
      callback(null, true);
    } else {
      console.log(`Blocked by CORS: ${origin}`); // Log blocked origins for debugging
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Define User Schema
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
const allowedAdminNames = [
  'Naomi Dion-Gokan',
  'Justin Keanini',
  'Teni Olugboyega',
  'Darcie Bagott',
  'Cory Bolkan',
];

// Register Route
app.post('/api/register', async (req, res) => {
  console.log('Request received:', req.body); // Log incoming registration request
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
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate a JWT with user info
    const token = jwt.sign(
      { userId: user._id, statusType: user.statusType },
      process.env.JWT_SECRET || 'yourSecretKey', // Use a secure key in production
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login successful', token, statusType: user.statusType });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Example Protected Routes for Admin and Volunteer Dashboards
app.get('/api/admin-dashboard', (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard!' });
});

app.get('/api/volunteer-dashboard', (req, res) => {
  res.json({ message: 'Welcome to the Volunteer Dashboard!' });
});

// Export the app as a serverless function
module.exports = app;
module.exports.handler = serverless(app); // Required for Vercel serverless

// Only for local development; Vercel will ignore this in production
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001; // Local port for testing
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}