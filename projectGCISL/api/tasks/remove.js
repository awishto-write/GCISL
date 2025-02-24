const mongoose = require('mongoose');
const Task = require('../models/Task');
const authenticateJWT = require('../middleware/authenticateJWT');
require('dotenv').config();

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB for removing volunteers"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

module.exports = async (req, res) => {
  await authenticateJWT(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    const { volunteerId, taskId } = req.body;

    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      task.assignedVolunteers = task.assignedVolunteers.filter(
        (id) => id.toString() !== volunteerId
      );

      await task.save();
      res.status(200).json({ message: 'Volunteer removed from task successfully.' });
    } catch (error) {
      console.error('Error removing volunteer from task:', error);
      res.status(500).json({ message: 'Error removing volunteer from task.' });
    }
  });
};
