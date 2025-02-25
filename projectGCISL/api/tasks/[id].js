const Task = require('../models/Task');
const User = require('../models/UserModel');
const Log = require('../models/Log');
const authenticateJWT = require('../middleware/authenticateJWT');
const connectDB = require('../db'); // Use shared DB connection

require('dotenv').config();

connectDB();

export default async function handler(req, res) {
  if (req.method === 'OPTIONS') {
    res.setHeader("Allow", "GET, POST, PUT, DELETE, OPTIONS");
    return res.status(204).end();
  }

  await authenticateJWT(req, res, async () => {
    if (req.method === 'PUT') {
      const { title, creationDate, dueDate, status, description } = req.body;

      try {
        const existingTask = await Task.findById(req.query.id);
        if (!existingTask) return res.status(404).json({ message: 'Task not found.' });

        const updatedTask = await Task.findByIdAndUpdate(
          req.query.id,
          { title, creationDate, dueDate, status, description },
          { new: true }
        );

        const user = await User.findById(req.userId);
        if (user.statusType === 'volunteer' && status === 'Completed') {
          const assignees = updatedTask.assignedVolunteers.length
            ? (await User.find({ _id: { $in: updatedTask.assignedVolunteers } }))
                .map(volunteer => `${volunteer.firstName} ${volunteer.lastName}`)
            : [];

          await new Log({
            action: `Completed Task by Volunteer: ${user.firstName} ${user.lastName}`,
            taskTitle: updatedTask.title,
            assignees,
            creationDate: updatedTask.creationDate,
            dueDate: updatedTask.dueDate,
          }).save();
        }

        await new Log({
          action: `Task Updated by ${user.firstName} ${user.lastName}`,
          taskTitle: updatedTask.title,
          creationDate: updatedTask.creationDate,
          dueDate: updatedTask.dueDate,
        }).save();

        res.status(200).json(updatedTask);
      } catch (error) {
        console.error('Error updating task:', error);
        res.status(400).json({ message: 'Error updating task.' });
      }
    } else if (req.method === 'DELETE') {
      try {
        const task = await Task.findByIdAndDelete(req.query.id);
        if (!task) return res.status(404).json({ message: 'Task not found.' });

        const user = await User.findById(req.userId);
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
      res.status(405).json({ error: "Method Not Allowed" });
    }
  });
};
