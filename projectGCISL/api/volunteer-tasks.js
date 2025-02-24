const express = require('express');
const router = express.Router();
const Task = require('./models/Task');
const authenticateJWT = require('./middleware/authenticateJWT');

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedVolunteers: req.userId }).populate('assignedVolunteers', 'firstName lastName');

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks assigned to you.' });
    }

    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error fetching volunteer tasks:', error);
    res.status(500).json({ message: 'Error fetching volunteer tasks.' });
  }
});

module.exports = router;