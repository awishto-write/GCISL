const Task = require('../../models/Task');
const authenticateJWT = require('../../middleware/authenticateJWT');
const connectDB = require('../../db');

connectDB();

module.exports = async (req, res) => {
  await authenticateJWT(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
      const { id } = req.query; // Ensure taskId is in the query parameters
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      task.assignedVolunteers = [];
      await task.save();

      res.json({ message: 'All assignees cleared successfully.' });
    } catch (error) {
      console.error('Error clearing assignees:', error);
      res.status(500).json({ message: 'Error clearing assignees.' });
    }
  });
};
