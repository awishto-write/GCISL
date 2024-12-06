const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// MongoDB connection
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB for /api/user"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: String,
  phoneNumber: String,
  password: String,
  statusType: String,
}));

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token missing or invalid' });

    const { userId } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(userId).select('firstName lastName');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user.' });
  }
};