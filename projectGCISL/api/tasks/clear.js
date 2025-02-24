const mongoose = require('mongoose');
const Task = require('../models/Task');
const authenticateJWT = require('../middleware/authenticateJWT');
require('dotenv').config();

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB for clearing assignees"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

module.exports = async (req, res) => {
  await authenticateJWT(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
      const task = await Task.findById(req.query.taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      task.assignedVolunteers = [];
      await task.save();

      res.json({ message: 'All assignees cleared successfully.' });
    } catch (error) {
      console.error('Error clearing assignees:', error);
      res.status(500).json({ message: 'Error clearing assignees.' });
    }
  });
};
