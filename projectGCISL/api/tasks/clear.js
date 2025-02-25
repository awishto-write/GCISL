const mongoose = require('mongoose');
const Task = require('../../models/Task'); // Assuming Task model is already defined
require('dotenv').config();

// Connect to MongoDB
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
}

export default async function handler(req, res) {
  const { taskId } = req.query;

  if (req.method === 'POST') {
    try {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      task.assignedVolunteers = [];
      await task.save();

      res.status(200).json({ message: 'All assignees cleared successfully.' });
    } catch (error) {
      console.error('Error clearing assignees:', error);
      res.status(500).json({ message: 'Error clearing assignees.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}
