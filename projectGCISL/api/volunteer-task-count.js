const mongoose = require('mongoose');
const Task = require('./models/Task');
const authenticateJWT = require('./middleware/authenticateJWT');
require('dotenv').config();

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB for task count"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

module.exports = async (req, res) => {
  await authenticateJWT(req, res, async () => {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
      const taskCount = await Task.countDocuments({ assignedVolunteers: req.userId });
      res.status(200).json({ count: taskCount });
    } catch (error) {
      console.error('Error fetching task count:', error);
      res.status(500).json({ message: 'Error fetching task count.' });
    }
  });
};
