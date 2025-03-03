const User = require('./models/User');
const authenticateJWT = require('./middleware/authenticateJWT');
const connectDB = require('./utils/db');
require('dotenv').config();

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Connect to database
  await connectDB();

  // Get the role from query parameters
  const { role } = req.query;

  try {
    // Authenticate the user
    const authResult = await authenticateJWT(req, res);
    if (!authResult.success) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Find users with the specified role
    const users = await User.find({ statusType: role });
    return res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Error fetching users.' });
  }
};