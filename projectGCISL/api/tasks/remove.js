const Task = require('../models/Task');
const authenticateJWT = require('../middleware/authenticateJWT');
const connectDB = require('../utils/db');

module.exports = async (req, res) => {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Connect to database
  await connectDB();
  
  // Authentication
  const authResult = await authenticateJWT(req, res);
  if (!authResult.success) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  const { volunteerId, taskId } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    task.assignedVolunteers = task.assignedVolunteers.filter(id => id.toString() !== volunteerId);
    await task.save();

    return res.status(200).json({ message: 'Volunteer removed from task successfully.' });
  } catch (error) {
    console.error('Error removing volunteer:', error);
    return res.status(500).json({ message: 'Error removing volunteer from task.' });
  }
};