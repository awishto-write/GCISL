const connectDB = require('./db'); // Import the shared DB connection
const Task = require('./models/Task');
const authenticateJWT = require('./middleware/authenticateJWT');
require('dotenv').config();

connectDB(); // Use the shared DB connection

module.exports = async (req, res) => {
  await authenticateJWT(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
      const tasks = await Task.find({ assignedVolunteers: req.userId }).populate('assignedVolunteers', 'firstName lastName');

      if (tasks.length === 0) {
        return res.status(404).json({ message: 'No tasks assigned to you.' });
      }

      res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching volunteer tasks:', error);
      res.status(500).json({ message: 'Error fetching volunteer tasks.' });
    }
  });
};
