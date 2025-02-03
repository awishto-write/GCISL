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
  if (req.method === 'PUT') {
    const { id } = req.query;
    //const { title, duration, document, color, status } = req.body;
    const { title, creationDate, dueDate, document, color, status } = req.body;

    try {
      const task = await Task.findByIdAndUpdate(
        id,
        // { title, duration, document, color, status },
        { title, creationDate, dueDate, document, color, status },
        { new: true }
      );

      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      res.status(200).json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(400).json({ message: 'Error updating task.' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      const task = await Task.findByIdAndDelete(id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Error deleting task.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};