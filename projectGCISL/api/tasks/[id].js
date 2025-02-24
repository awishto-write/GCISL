const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User'); // Ensure User model is imported
const Log = require('../models/Log'); // Ensure Log model is imported
const authenticateJWT = require('../middleware/authenticateJWT');

// Update a task
router.put('/:id', authenticateJWT, async (req, res) => {
  const { title, creationDate, dueDate, color, status, description } = req.body;

  try {
    const existingTask = await Task.findById(req.params.id);

    if (!existingTask) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
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
});

// Delete a task
router.delete('/:id', authenticateJWT, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

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
});

module.exports = router;
