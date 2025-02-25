const Task = require('../models/Task');
const User = require('../models/UserModel');
const Log = require('../models/Log');
const authenticateJWT = require('../middleware/authenticateJWT');
const connectDB = require('../db');

connectDB();

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader("Allow", "GET, POST, PUT, DELETE, OPTIONS");
    return res.status(204).end();
  }

  await authenticateJWT(req, res, async () => {
    const { id } = req.query; // Ensure dynamic ID handling

    if (req.method === 'GET') {
      try {
        const tasks = await Task.find({}).populate('assignedVolunteers', 'firstName lastName');
        res.json(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks.' });
      }

    } else if (req.method === 'POST') {
      const { title, creationDate, dueDate, status, description, assignedVolunteers } = req.body;
      try {
        const user = await User.findById(req.userId);
        const duplicateTask = await Task.findOne({ title });
        if (duplicateTask) {
          return res.status(400).json({ message: 'Task with this title already exists! Please edit the title of the existing task.' });
        }

        const newTask = new Task({
          title, creationDate, dueDate, status, description,
          createdBy: `${user.firstName} ${user.lastName}`,
          assignedVolunteers
        });

        await newTask.save();
        await new Log({ action: `Task Created by ${user.firstName} ${user.lastName}`, taskTitle: newTask.title, creationDate, dueDate }).save();

        res.status(201).json(newTask);
      } catch (error) {
        console.error('Error creating task:', error);
        res.status(400).json({ message: 'Error creating task.' });
      }

    } else if (req.method === 'PUT') {
      const { title, creationDate, dueDate, status, description, assignedVolunteers } = req.body;
      try {
        const task = await Task.findByIdAndUpdate(
          id,
          { title, creationDate, dueDate, status, description, assignedVolunteers },
          { new: true }
        );

        if (!task) {
          return res.status(404).json({ message: 'Task not found.' });
        }

        const user = await User.findById(req.userId);
        await new Log({ action: `Task Updated by ${user.firstName} ${user.lastName}`, taskTitle: task.title, creationDate, dueDate }).save();

        res.status(200).json(task);
      } catch (error) {
        console.error('Error updating task:', error);
        res.status(400).json({ message: 'Error updating task.' });
      }

    } else if (req.method === 'DELETE') {
      try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
          return res.status(404).json({ message: 'Task not found.' });
        }

        const user = await User.findById(req.userId);
        await new Log({ action: `Task Deleted by ${user.firstName} ${user.lastName}`, taskTitle: task.title, creationDate: task.creationDate, dueDate: task.dueDate }).save();

        res.sendStatus(204);
      } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task.' });
      }

    } else if (req.method === 'POST' && id && req.url.endsWith('/clear')) {
      // Clear all assigned volunteers for a specific task
      try {
        const task = await Task.findById(id);
        if (!task) {
          return res.status(404).json({ message: 'Task not found.' });
        }

        task.assignedVolunteers = [];
        await task.save();

        const user = await User.findById(req.userId);
        await new Log({ action: `Task Cleared by ${user.firstName} ${user.lastName}`, taskTitle: task.title }).save();

        res.json({ message: 'All assignees cleared successfully.' });
      } catch (error) {
        console.error('Error clearing assignees:', error);
        res.status(500).json({ message: 'Error clearing assignees.' });
      }

    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  });
};
