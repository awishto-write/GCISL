const Task = require('../models/Task');
const User = require('../models/UserModel');
const Log = require('../models/Log');
const authenticateJWT = require('../middleware/authenticateJWT');
const connectDB = require('../db');

connectDB();

module.exports = async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.setHeader("Allow", "GET, POST, PUT, DELETE, OPTIONS");
    return res.status(204).end();
  }

  await authenticateJWT(req, res, async () => {
    if (req.method === 'GET') {
      try {
        const tasks = await Task.find({}).populate('assignedVolunteers', 'firstName lastName');
        res.json(tasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks.' });
      }
    } else if (req.method === 'POST') {
      const { title, creationDate, dueDate, status, description, assignedVolunteers } = req.body;
      try {
        const user = await User.findById(req.userId);
        const newTask = new Task({ title, creationDate, dueDate, status, description, createdBy: `${user.firstName} ${user.lastName}`, assignedVolunteers });
        await newTask.save();

        await new Log({ action: `Task Created by ${user.firstName} ${user.lastName}`, taskTitle: newTask.title, creationDate, dueDate }).save();

        res.status(201).json(newTask);
      } catch (error) {
        console.error('Error creating task:', error);
        res.status(400).json({ message: 'Error creating task.' });
      }
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  });
};
