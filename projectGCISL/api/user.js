const User = require('./models/User');
const jwt = require('jsonwebtoken');
const connectDB = require('./utils/db');
require('dotenv').config();

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Connect to database
  await connectDB();

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Access token missing or invalid' });

    try {
      const { userId } = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');
      const user = await User.findById(userId).select('firstName lastName');
      if (!user) return res.status(404).json({ message: 'User not found' });

      return res.status(200).json(user);
    } catch (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return res.status(500).json({ message: 'Error fetching user.' });
  }
};