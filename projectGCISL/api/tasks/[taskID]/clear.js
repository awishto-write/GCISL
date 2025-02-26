const Task = require('../../models/Task');
const authenticateJWT = require('../../middleware/authenticateJWT');
const connectDB = require('../../db');

connectDB();

export default async function handler(req, res) {
  const { id } = req.query; // Get the task ID from the query parameters

  if (req.method === 'OPTIONS') {
    res.setHeader("Allow", "POST, OPTIONS");
    return res.status(204).end();
  }

  await authenticateJWT(req, res, async () => {
    if (req.method === 'POST') {
      try {
        // Find the task by ID
        const task = await Task.findById(id);

        if (!task) {
          return res.status(404).json({ message: 'Task not found.' });
        }

        // Clear the assigned volunteers
        task.assignedVolunteers = [];
        await task.save();

        res.status(200).json({ message: 'All assignees cleared successfully.' });
      } catch (error) {
        console.error('Error clearing assignees:', error);
        res.status(500).json({ message: 'Error clearing assignees.' });
      }
    } else {
      res.status(405).json({ message: 'Method Not Allowed' });
    }
  });
}