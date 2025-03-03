const Task = require('../models/Task');
const User = require('../models/User');
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

  // Inside assign.js
  try {
    const task = await Task.findById(taskId);
    const volunteer = await User.findById(volunteerId);

    if (!task) return res.status(404).json({ message: 'Task not found.' });
    if (!volunteer) return res.status(404).json({ message: 'Volunteer not found.' });

    // Check if volunteer is already assigned to prevent duplicates
    if (task.assignedVolunteers.some(id => id.toString() === volunteerId)) {
      return res.status(400).json({ message: 'Volunteer already assigned to this task.' });
    }

    task.assignedVolunteers.push(volunteerId);
    await task.save();

    return res.status(200).json({ message: 'Task assigned to volunteer successfully.' });
  } catch (error) {
    console.error('Error assigning task:', error);
    return res.status(500).json({ message: 'Error assigning task.' });
  }
};