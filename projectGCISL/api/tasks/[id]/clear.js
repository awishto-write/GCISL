const Task = require('../../models/Task');
const User = require('../../models/User');
const Log = require('../../models/Log');
const authenticateJWT = require('../../middleware/authenticateJWT');
const connectDB = require('../../utils/db');

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
  
  // Get task ID from URL
  const { id } = req.query;
  
  // Inside the try block after finding the task
  try {
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    // Get the authenticated user for logging
    const user = await User.findById(authResult.userId);

    // Get assignee names before clearing for the log
    const assigneeNames = task.assignedVolunteers.length > 0
      ? (
          await User.find({ _id: { $in: task.assignedVolunteers } })
        ).map((volunteer) => `${volunteer.firstName} ${volunteer.lastName}`)
      : [];

    // Clear assignees
    task.assignedVolunteers = [];
    await task.save();

    // Log the action - FIXED: Ensure all required fields are provided
    const newLog = new Log({
      action: `Assignees Cleared by Admin: ${user.firstName} ${user.lastName}`,
      taskTitle: task.title || "Unknown Task", // Use title from task or a fallback
      assignees: assigneeNames,
      creationDate: new Date(), // Always provide a creation date
      dueDate: task.dueDate || null,
    });
    
    try {
      await newLog.save();
    } catch (logError) {
      console.error('Error saving log:', logError);
      // Continue with task operation even if logging fails
    }

    return res.status(200).json({ message: 'All assignees cleared successfully.' });
  } catch (error) {
    console.error('Error clearing assignees:', error);
    return res.status(500).json({ message: 'Error clearing assignees.' });
  }
};