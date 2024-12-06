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
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
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
};