const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const connectDB = require('./db'); // Import the shared DB connection
require('dotenv').config();

connectDB(); // Use the shared DB connection

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String,
  statusType: String,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  try {
    console.log('Login attempt:', email);

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

    const token = jwt.sign(
      { userId: user._id, statusType: user.statusType },
      process.env.JWT_SECRET || 'yourSecretKey',
      { expiresIn: '2h' }
    );

    console.log('Token generated for user:', email);

    res.json({
      message: 'Login successful',
      token,
      statusType: user.statusType,
      redirectUrl: user.statusType === 'admin' ? '/admin-dashboard' : '/volunteer-dashboard'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed.' });
  }
};
