const express = require('express');
const router = express.Router();
const Task = require('./models/Task');
const User = require('./models/User'); // Ensure User model is imported
const Log = require('./models/Log'); // Ensure Log model is imported
const authenticateJWT = require('./middleware/authenticateJWT');

// Fetch all tasks
router.get('/', authenticateJWT, async (_req, res) => {
  try {
    const tasks = await Task.find({}).populate('assignedVolunteers', 'firstName lastName');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks.' });
  }
});

// Create a new task
router.post('/', authenticateJWT, async (req, res) => {
  const { title, creationDate, dueDate, color, status, description, assignedVolunteers } = req.body;

  try {
    const user = await User.findById(req.userId);
    const newTask = new Task({
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
});

module.exports = router;
