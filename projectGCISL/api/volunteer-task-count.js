const Task = require('./models/Task');
const authenticateJWT = require('./middleware/authenticateJWT');
const connectDB = require('./utils/db');
require('dotenv').config();

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  // Connect to database
  await connectDB();

  // Authenticate the user
  const authResult = await authenticateJWT(req, res);
  if (!authResult.success) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const taskCount = await Task.countDocuments({ assignedVolunteers: authResult.userId });
    return res.status(200).json({ count: taskCount });
  } catch (error) {
    console.error('Error fetching task count:', error);
    return res.status(500).json({ message: 'Error fetching task count.' });
  }
};