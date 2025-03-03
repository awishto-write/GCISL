const Task = require('./models/Task');
const authenticateJWT = require('./middleware/authenticateJWT');
const connectDB = require('./utils/db');
require('dotenv').config();

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  // Connect to database
  await connectDB();

  // Authenticate the user
  const authResult = await authenticateJWT(req, res);
  if (!authResult.success) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    // Find tasks where the authenticated user is in the assignedVolunteers array
    const tasks = await Task.find({ assignedVolunteers: authResult.userId }).populate('assignedVolunteers', 'firstName lastName');

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks assigned to you.' });
    }

    return res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching volunteer tasks:', error);
    return res.status(500).json({ message: 'Error fetching volunteer tasks.' });
  }
};