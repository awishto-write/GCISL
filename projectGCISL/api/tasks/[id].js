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

// Define the Task model
const Task = mongoose.models.Task || mongoose.model('Task', new mongoose.Schema({
  title: String,
  creationDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: false },
  document: String,
  color: String,
  status: { type: String, enum: ['None', 'In Progress', 'Completed', 'To Redo'], default: 'None' },
  assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}));

// Define the User model
const User = mongoose.models.User || mongoose.model('User', new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
}));

// Define the Log model
const Log = mongoose.models.Log || mongoose.model('Log', new mongoose.Schema({
  action: String,
  taskTitle: String,
  creationDate: Date,
  dueDate: Date,
  timestamp: { type: Date, default: Date.now }
}));

module.exports = async (req, res) => {
  if (req.method === 'PUT') {
    const { id } = req.query;
    const { title, creationDate, dueDate, document, color, status } = req.body;

    try {
      // Update the task
      const task = await Task.findByIdAndUpdate(
        id,
        { title, creationDate, dueDate, document, color, status },
        { new: true }
      );

      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      // Log the update action
      const user = await User.findOne({ email: req.body.userEmail }); // Assume userEmail is in the body
      await new Log({
        action: `Task Updated by ${user.firstName} ${user.lastName}`,
        taskTitle: task.title,
        creationDate: task.creationDate,
        dueDate: task.dueDate,
      }).save();

      res.status(200).json(task);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(400).json({ message: 'Error updating task.' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      // Delete the task
      const task = await Task.findByIdAndDelete(id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      // Log the delete action
      const user = await User.findOne({ email: req.body.userEmail }); // Assume userEmail is in the body
      await new Log({
        action: `Task Deleted by ${user.firstName} ${user.lastName}`,
        taskTitle: task.title,
        creationDate: task.creationDate,
        dueDate: task.dueDate,
      }).save();

      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Error deleting task.' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
