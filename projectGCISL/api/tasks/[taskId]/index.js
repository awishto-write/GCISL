const Task = require('../../models/Task');
const User = require('../../models/UserModel');
const Log = require('../../models/Log');
const authenticateJWT = require('../../middleware/authenticateJWT');
const connectDB = require('../../db');

connectDB();

module.exports = async (req, res) => {
  const { id } = req.query; // Get the task ID from the query parameters

  if (req.method === 'OPTIONS') {
    res.setHeader("Allow", "GET, PUT, DELETE, OPTIONS");
    return res.status(204).end();
  }

  await authenticateJWT(req, res, async () => {
    if (req.method === 'PUT') {
      const { title, creationDate, dueDate, status, description, assignedVolunteers } = req.body;

      try {
        // Update the task with the provided ID
        const task = await Task.findByIdAndUpdate(
          id,
          { title, creationDate, dueDate, status, description, assignedVolunteers },
          { new: true }
        );

        if (!task) {
          return res.status(404).json({ message: 'Task not found.' });
        }

        // Log the update action
        const user = await User.findById(req.userId); // Assuming userId is in the JWT token
        await new Log({
          action: `Task Updated by ${user.firstName} ${user.lastName}`,
          taskTitle: task.title,
          creationDate: task.creationDate,
          dueDate: task.dueDate,
        }).save();

        res.status(200).json(task);
      } catch (error) {
        console.error('Error updating task:', error);
        res.status(400).json({ message: 'Error updating task.' });
      }
    } else if (req.method === 'DELETE') {
      try {
        // Delete the task with the provided ID
        const task = await Task.findByIdAndDelete(id);

        if (!task) {
          return res.status(404).json({ message: 'Task not found.' });
        }

        // Log the delete action
        const user = await User.findById(req.userId); // Assuming userId is in the JWT token
        await new Log({
          action: `Task Deleted by ${user.firstName} ${user.lastName}`,
          taskTitle: task.title,
          creationDate: task.creationDate,
          dueDate: task.dueDate,
        }).save();

        res.sendStatus(204);
      } catch (error) {
        console.error('Error deleting task:', error);
        res.status(500).json({ message: 'Error deleting task.' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  });
};
