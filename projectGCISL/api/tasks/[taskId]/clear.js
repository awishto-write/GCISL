const mongoose = require('mongoose');
require('dotenv').config();

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));
}

const Task = mongoose.models.Task || mongoose.model('Task', new mongoose.Schema({
  title: String,
  duration: String,
  document: String,
  color: String,
  status: { type: String, enum: ['None', 'In progress', 'Completed', 'To Redo'], default: 'None' },
  assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}));

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { taskId } = req.query;

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
};