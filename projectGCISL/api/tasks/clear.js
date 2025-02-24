const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const authenticateJWT = require('../middleware/authenticateJWT');

router.post('/:taskId/clear', authenticateJWT, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    task.assignedVolunteers = [];
    await task.save();

    res.json({ message: 'All assignees cleared successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing assignees.' });
  }
});

module.exports = router;