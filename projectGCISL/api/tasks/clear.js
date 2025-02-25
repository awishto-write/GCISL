import Task from '../models/Task';
import authenticateJWT from '../middleware/authenticateJWT';
import connectDB from '../db';

connectDB();

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader("Allow", "GET, POST, PUT, DELETE, OPTIONS");
    return res.status(204).end();
  }

  await authenticateJWT(req, res, async () => {
    if (req.method !== 'POST') {
      return res.status(405).json({ error: "Method Not Allowed" });
    }

    try {
      const task = await Task.findById(req.query.taskId);
      if (!task) return res.status(404).json({ message: 'Task not found.' });

      task.assignedVolunteers = [];
      await task.save();
      res.json({ message: 'All assignees cleared successfully.' });
    } catch (error) {
      console.error('Error clearing assignees:', error);
      res.status(500).json({ message: 'Error clearing assignees.' });
    }
  });
}
