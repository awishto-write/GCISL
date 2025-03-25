const Task = require('../models/Task');
const authenticateJWT = require('../middleware/authenticateJWT');
const connectDB = require('../db');

connectDB();

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader("Allow", "GET, POST, PUT, DELETE, OPTIONS");
    return res.status(204).end();
  }

  await authenticateJWT(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

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
};
