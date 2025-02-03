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
  creationDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: false },
  color: String,
  status: { type: String, enum: ['None', 'In Progress', 'Completed', 'To Redo'], default: 'None' },
  description: { type: String, default: '' },
  createdBy: { type: String, required: true },
  assignedVolunteers: [
    {
      volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      status: { type: String, enum: ['In Progress', 'Completed'], default: 'In Progress' }
    }
  ]
}));

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { volunteerId, taskId } = req.body;

  try {
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    task.assignedVolunteers = task.assignedVolunteers.filter((id) => id.toString() !== volunteerId);
    await task.save();

    res.status(200).json({ message: 'Volunteer removed from task successfully.' });
  } catch (error) {
    console.error('Error removing volunteer from task:', error);
    res.status(500).json({ message: 'Error removing volunteer from task.' });
  }
};