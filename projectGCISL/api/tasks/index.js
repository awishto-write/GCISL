const Task = require('../models/Task');
const authenticateJWT = require('../middleware/authenticateJWT');
const connectDB = require('../utils/db');

// Get all tasks
module.exports = async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Connect to database
  await connectDB();
  
  // Authentication
  const authResult = await authenticateJWT(req, res);
  if (!authResult.success) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // GET: Fetch all tasks
  if (req.method === 'GET') {
    try {
      const tasks = await Task.find({}).populate('assignedVolunteers', 'firstName lastName');
      return res.status(200).json(tasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return res.status(500).json({ message: 'Error fetching tasks.' });
    }
  }
  
  // POST: Create a new task
  if (req.method === 'POST') {
    const User = require('../models/User');
    const Log = require('../models/Log');
    
    const { title, creationDate, dueDate, color, status, description, assignedVolunteers } = req.body;

    try {
      // Get the authenticated user
      const user = await User.findById(authResult.userId);

      // Check if a task with the same title already exists
      const duplicateTask = await Task.findOne({ title: title });
      if (duplicateTask) {
        return res.status(400).json({ message: 'Task with this title already exists. Please use a different title.' });
      }

      // Create the new task
      const newTask = new Task({
        title,
        creationDate,
        dueDate,
        color,
        status,
        description,
        createdBy: `${user.firstName} ${user.lastName}`,
        assignedVolunteers,
      });
      await newTask.save();

      // Fetch assignee names if assignedVolunteers exist
      const assigneeNames = assignedVolunteers
        ? (
            await User.find({ _id: { $in: assignedVolunteers } })
          ).map((assignee) => `${assignee.firstName} ${assignee.lastName}`)
        : [];

      // Create a log for the task creation
      const newLog = new Log({
        action: `Task Created by Admin: ${user.firstName} ${user.lastName}`,
        taskTitle: title,
        assignees: assigneeNames,
        creationDate,
        dueDate,
      });
      await newLog.save();

      return res.status(201).json(newTask);
    } catch (error) {
      console.error('Error creating task:', error);
      return res.status(400).json({ message: 'Error creating task.' });
    }
  }
};


