const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/UserModel');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/', authenticateJWT, async (req, res) => {
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
});

module.exports = router;