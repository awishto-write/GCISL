const mongoose = require('mongoose');
const Task = require('./models/Task');
const User = require('./models/UserModel');
const Log = require('./models/Log');
const authenticateJWT = require('./middleware/authenticateJWT');
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
  console.log('Handling request in index.js:', req.method, req.url);

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
  } else if (req.method === 'PUT') {
    const { title, creationDate, dueDate, color, status, description } = req.body;
    const taskId = req.query.id; // Extract task ID from query params

    try {
      const existingTask = await TaskModel.findById(taskId);

      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      const updatedTask = await TaskModel.findByIdAndUpdate(
        taskId,
        { title, creationDate, dueDate, color, status, description },
        { new: true }
      );

      const user = await User.findById(req.userId);

      if (user.statusType === 'volunteer' && status === 'Completed') {
        const assignees = updatedTask.assignedVolunteers.length > 0
          ? (
              await User.find({ _id: { $in: updatedTask.assignedVolunteers } })
            ).map((volunteer) => `${volunteer.firstName} ${volunteer.lastName}`)
          : [];

        const completionLog = new Log({
          action: `Completed Task by Volunteer: ${user.firstName} ${user.lastName}`,
          taskTitle: updatedTask.title,
          assignees,
          creationDate: updatedTask.creationDate,
          dueDate: updatedTask.dueDate,
        });

        await completionLog.save();
      }

      const updateLog = new Log({
        action: `Task Updated by ${user.firstName} ${user.lastName}`,
        taskTitle: updatedTask.title,
        creationDate: updatedTask.creationDate,
        dueDate: updatedTask.dueDate,
      });
      await updateLog.save();

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(400).json({ message: 'Error updating task.' });
    }
  } else if (req.method === 'DELETE') {
    const taskId = req.query.id; // Extract task ID from query params

    try {
      const task = await TaskModel.findByIdAndDelete(taskId);

      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      const user = await User.findById(req.userId);
      const deleteLog = new Log({
        action: `Task Deleted by ${user.firstName} ${user.lastName}`,
        taskTitle: task.title,
        creationDate: task.creationDate,
        dueDate: task.dueDate,
      });
      await deleteLog.save();

      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Error deleting task.' });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};