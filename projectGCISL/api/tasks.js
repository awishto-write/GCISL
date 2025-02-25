const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB for /api/tasks"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

const Task = mongoose.models.Task || mongoose.model('Task', new mongoose.Schema({
  title: String,
  //duration: String,
  creationDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: false },
  document: String,
  color: String,
  status: String,
  assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}));

module.exports = async (req, res) => {
  const method = req.method;

  try {
    if (method === 'GET') {
      const tasks = await Task.find({}).populate('assignedVolunteers', 'firstName lastName');
      res.status(200).json(tasks);
    } else if (method === 'POST') {
      // const { title, duration, document, color, status } = req.body;
      // const newTask = await Task.create({ title, duration, document, color, status });
      const { title, creationDate, dueDate, document, color, status } = req.body;
      const newTask = await Task.create({ title, creationDate, dueDate, document, color, status });
      res.status(201).json(newTask);
    } else {
      res.status(405).json({ error: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error handling /api/tasks:', error);
    res.status(500).json({ message: 'Error handling tasks.' });
  }
};