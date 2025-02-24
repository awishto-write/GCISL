const mongoose = require('mongoose');
const Task = require('../models/Task');
const User = require('../models/UserModel'); // Ensure User model is imported
const Log = require('../models/Log'); // Ensure Log model is imported
const authenticateJWT = require('../middleware/authenticateJWT');
require('dotenv').config();

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB for tasks"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

const taskSchema = new mongoose.Schema({
  title: String,
  creationDate: Date,
  dueDate: Date,
  color: String,
  status: String,
  description: String,
  createdBy: String,
  assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const TaskModel = mongoose.models.Task || mongoose.model('Task', taskSchema);

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const tasks = await TaskModel.find({}).populate('assignedVolunteers', 'firstName lastName');
      res.json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      res.status(500).json({ message: 'Error fetching tasks.' });
    }
  } else if (req.method === 'POST') {
    const { title, creationDate, dueDate, color, status, description, assignedVolunteers } = req.body;

    try {
      const user = await User.findById(req.userId);
      const newTask = new TaskModel({
        title,
        creationDate,
        dueDate,
        color,
        status,
        description,
        createdBy: `${user.firstName} ${user.lastName}`,
        assignedVolunteers,
      });
      await newTask.save();

      // Create a log for task creation
      const creationLog = new Log({
        action: `Task Created by ${user.firstName} ${user.lastName}`,
        taskTitle: newTask.title,
        creationDate: newTask.creationDate,
        dueDate: newTask.dueDate,
      });
      await creationLog.save();

      res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      res.status(400).json({ message: 'Error creating task.' });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
