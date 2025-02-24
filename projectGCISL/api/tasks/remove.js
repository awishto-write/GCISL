const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/', authenticateJWT, async (req, res) => {
  const { volunteerId, taskId } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    task.assignedVolunteers = task.assignedVolunteers.filter(
      (id) => id.toString() !== volunteerId
    );

    await task.save();
    res.status(200).json({ message: 'Volunteer removed from task successfully.' });
  } catch (error) {
    console.error('Error removing volunteer from task:', error);
    res.status(500).json({ message: 'Error removing volunteer from task.' });
  }
});

module.exports = router;