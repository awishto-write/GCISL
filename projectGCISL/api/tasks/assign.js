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
  status: { type: String, enum: ['None', 'In Progress', 'Completed', 'To Redo'], default: 'None' },
  assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}));
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String,
  statusType: String,
}));

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { volunteerId, taskId } = req.body;

  try {
    const task = await Task.findById(taskId);
    const volunteer = await User.findById(volunteerId);

    if (!task || !volunteer) {
      return res.status(404).json({ message: 'Task or Volunteer not found.' });
    }

    if (!task.assignedVolunteers.includes(volunteerId)) {
      task.assignedVolunteers.push(volunteerId);
      await task.save();
    }

    res.status(200).json({ message: 'Task assigned to volunteer successfully.' });
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({ message: 'Error assigning task.' });
  }
};