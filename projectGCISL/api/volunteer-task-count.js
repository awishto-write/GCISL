const express = require('express');
const router = express.Router();
const Task = require('./models/Task');
const authenticateJWT = require('./middleware/authenticateJWT');

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const taskCount = await Task.countDocuments({ assignedVolunteers: req.userId });
    res.status(200).json({ count: taskCount });
  } catch (error) {
    console.error('Error fetching task count:', error);
    res.status(500).json({ message: 'Error fetching task count.' });
  }
});

module.exports = router;