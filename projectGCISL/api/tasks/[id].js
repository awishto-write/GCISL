const Task = require('../models/Task');
const User = require('../models/User');
const Log = require('../models/Log');
const authenticateJWT = require('../middleware/authenticateJWT');
const connectDB = require('../utils/db');

module.exports = async (req, res) => {
  // Allow GET, PUT and DELETE methods
  if (req.method !== 'GET' && req.method !== 'PUT' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }
  
  // Connect to database
  await connectDB();
  
  // Authentication
  const authResult = await authenticateJWT(req, res);
  if (!authResult.success) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  
  // Get task ID from the URL
  const { id } = req.query;

  // GET: Fetch a single task
  if (req.method === 'GET') {
    try {
      const task = await Task.findById(id).populate('assignedVolunteers', 'firstName lastName');
      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }
      return res.status(200).json(task);
    } catch (error) {
      console.error('Error fetching task:', error);
      return res.status(500).json({ message: 'Error fetching task.' });
    }
  }
  
  // PUT: Update a task
  if (req.method === 'PUT') {
    const { title, creationDate, dueDate, color, status, description } = req.body;

    try {
      // Find the existing task
      const existingTask = await Task.findById(id);

      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      // Update the task with new values
      const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, creationDate, dueDate, color, status, description },
        { new: true }
      );

      // Check if the user is a volunteer and the status is being set to "Completed"
      const user = await User.findById(authResult.userId);

      if (user.statusType === 'volunteer' && status === 'Completed') {
        const assignees = updatedTask.assignedVolunteers.length > 0
          ? (
              await User.find({ _id: { $in: updatedTask.assignedVolunteers } })
            ).map((volunteer) => `${volunteer.firstName} ${volunteer.lastName}`)
          : [];

        // Create a log for task completion
        const completionLog = new Log({
          action: `Completed Task by Volunteer: ${user.firstName} ${user.lastName}`,
          taskTitle: updatedTask.title,
          assignees,
          creationDate: updatedTask.creationDate,
          dueDate: updatedTask.dueDate,
        });

        await completionLog.save();
      } 

      // Return the updated task
      return res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      return res.status(400).json({ message: 'Error updating task.' });
    }
  }
  
  // DELETE: Delete a task
  if (req.method === 'DELETE') {
    try {
      // Find the task to delete
      const task = await Task.findById(id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      // Get the authenticated user
      const user = await User.findById(authResult.userId);
      
      // Create a log for the task deletion
      const newLog = new Log({
        action: `Task Deleted by Admin: ${user.firstName} ${user.lastName}`,
        taskTitle: task.title,
        assignees: [], // No assignees needed for deleted tasks
        creationDate: task.creationDate,
        dueDate: task.dueDate,
      });
      await newLog.save();

      // Actually delete the task
      await Task.findByIdAndDelete(id);

      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      return res.status(500).json({ message: 'Error deleting task.' });
    }
  }
};