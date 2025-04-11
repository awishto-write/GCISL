// api/index.js
const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());

console.log("Backend server is running");
app.get('/api/index/test', (req, res) => {
  res.json({ message: "Test endpoint works!" });
});

const allowedOrigins = [
  'http://localhost:3000',
  'https://gciconnect.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(corsOptions));

const databaseUri = process.env.NODE_ENV === 'test' ? 
  process.env.TEST_MONGODB_URI:
  process.env.MONGODB_URI;

if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(databaseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String,
  statusType: String,
});
const User = mongoose.model('User', userSchema);

const allowedAdminNames = [
  'Naomi Dion-Gokan',
  'Justin Keanini',
  'Teni Olugboyega',
  'Darcie Bagott',
  'Cory Bolkan',
];

const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  taskTitle: { type: String, required: true },
  assignees: [{ type: String }],
  creationDate: { type: Date, required: true },
  dueDate: { type: Date },
});
const Log = mongoose.model('Log', logSchema);

const taskSchema = new mongoose.Schema({
  title: String,
  creationDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date },
  color: String,
  status: { type: String, enum: ['None', 'In Progress', 'Completed', 'To Redo'], default: 'None' },
  description: { type: String, default: '' },
  createdBy: { type: String, required: true },
  assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});
const Task = mongoose.model('Task', taskSchema);

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Access token is missing or invalid.' });
  jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey', (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token.' });
    req.userId = decoded.userId;
    next();
  });
};

app.post('/api/index/register', async (req, res) => {
  const { firstName, lastName, email, phoneNumber, password, statusType } = req.body;
  const fullName = `${firstName} ${lastName}`;

  try {
    if (statusType === 'admin' && !allowedAdminNames.includes(fullName)) {
      return res.status(403).json({ error: 'You are not authorized to register as an admin.' });
    }
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'Email is already in use.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ firstName, lastName, email, phoneNumber, password: hashedPassword, statusType });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'User already exists or registration failed.' });
  }
});

app.post('/api/index/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password.' });

    const token = jwt.sign({ userId: user._id, statusType: user.statusType }, process.env.JWT_SECRET || 'yourSecretKey', { expiresIn: '2h' });
    res.json({ message: 'Login successful', token, statusType: user.statusType });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

app.get('/api/index/user', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('firstName lastName');
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data.' });
  }
});

app.get('/api/index/users', authenticateJWT, async (req, res) => {
  const role = req.query.role;
  try {
    const users = await User.find({ statusType: role });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

app.get('/api/index/tasks', authenticateJWT, async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('assignedVolunteers', 'firstName lastName');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks.' });
  }
});

app.get('/api/index/volunteer-tasks', authenticateJWT, async (req, res) => {
  try {
    const tasks = await Task.find({ assignedVolunteers: req.userId }).populate('assignedVolunteers', 'firstName lastName');
    if (tasks.length === 0) return res.status(404).json({ message: 'No tasks assigned to you.' });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching volunteer tasks.' });
  }
});

app.get('/api/index/volunteer-task-count', authenticateJWT, async (req, res) => {
  try {
    const count = await Task.countDocuments({ assignedVolunteers: req.userId });
    res.json({ count });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task count.' });
  }
});

app.post('/api/index/tasks', authenticateJWT, async (req, res) => {
  const { title, creationDate, dueDate, color, status, description, assignedVolunteers } = req.body;
  try {
    const user = await User.findById(req.userId);
    const duplicate = await Task.findOne({ title });
    if (duplicate) return res.status(400).json({ message: 'Task title already exists.' });

    const newTask = new Task({ title, creationDate, dueDate, color, status, description, createdBy: `${user.firstName} ${user.lastName}`, assignedVolunteers });
    await newTask.save();

    const assigneeNames = assignedVolunteers?.length ? (await User.find({ _id: { $in: assignedVolunteers } })).map(u => `${u.firstName} ${u.lastName}`) : [];
    const log = new Log({ action: `Task Created by Admin: ${user.firstName} ${user.lastName}`, taskTitle: title, assignees: assigneeNames, creationDate: new Date(), dueDate });
    await log.save();

    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task.' });
  }
});

app.post('/api/index/tasks/assign', authenticateJWT, async (req, res) => {
  const { volunteerId, taskId } = req.body;
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

     //FIX: Safely compare string volunteerId to ObjectId array
    const isAlreadyAssigned = task.assignedVolunteers.map(id => id.toString()).includes(volunteerId);
    if (!isAlreadyAssigned) {
       task.assignedVolunteers.push(volunteerId);
       await task.save();
    }
     
    // Just Added
    const populatedTask = await Task.findById(taskId).populate('assignedVolunteers', 'firstName lastName');
    const logsToUpdate = await Log.find({ taskTitle: populatedTask.title });
    for (const log of logsToUpdate) {
      log.assignees = populatedTask.assignedVolunteers.map(v => `${v.firstName} ${v.lastName}`);
      await log.save({ validateModifiedOnly: true });
    }

    res.json({ message: 'Volunteer assigned to task successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning volunteer.' });
  }
});

app.post('/api/index/tasks/remove', authenticateJWT, async (req, res) => {
  const { volunteerId, taskId } = req.body;
  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    task.assignedVolunteers = task.assignedVolunteers.filter(id => id.toString() !== volunteerId);
    await task.save();

    const populatedTask = await Task.findById(taskId).populate('assignedVolunteers', 'firstName lastName');
    const logsToUpdate = await Log.find({ taskTitle: populatedTask.title });
    for (const log of logsToUpdate) {
      log.assignees = populatedTask.assignedVolunteers.map(v => `${v.firstName} ${v.lastName}`);
      await log.save({ validateModifiedOnly: true });
    }
    
    res.json({ message: 'Volunteer removed from task.' });
  } 
  catch (error) {
    res.status(500).json({ message: 'Error removing volunteer.' });
  }
});

app.put('/api/index/tasks/:id', authenticateJWT, async (req, res) => {
  const { title, creationDate, dueDate, color, status, description } = req.body;
  try {
    const existing = await Task.findOne({ title, _id: { $ne: req.params.id } });
    if (existing) return res.status(400).json({ message: 'Task with this title already exists.' });

    const prevTask = await Task.findById(req.params.id).populate('assignedVolunteers', 'firstName lastName');
 
    //const updated = await Task.findByIdAndUpdate(req.params.id, { title, creationDate, dueDate, color, status, description }, { new: true });
    const updated = await Task.findByIdAndUpdate(
        req.params.id,
        { title, creationDate, dueDate, color, status, description },
        { new: true }
    ).populate('assignedVolunteers', 'firstName lastName');
  
    if (!updated) return res.status(404).json({ message: 'Task not found after update.' });

    const user = await User.findById(req.userId);
    if (user.statusType === 'volunteer' && status === 'Completed') {
      const assignees = updated.assignedVolunteers?.length ? (await User.find({ _id: { $in: updated.assignedVolunteers } })).map(u => `${u.firstName} ${u.lastName}`) : [];
      const log = new Log({ action: `Completed Task by Volunteer: ${user.firstName} ${user.lastName}`, taskTitle: updated.title, assignees, creationDate: new Date(), dueDate: updated.dueDate });
      //await log.save();
      await log.save({ validateModifiedOnly: true });
    }

    // Just Added
    // Update related logs (same task title, same assignees)
    const logsToUpdate = await Log.find({ taskTitle: prevTask.title });
    for (const log of logsToUpdate) {
      log.taskTitle = updated.title;
      log.dueDate = updated.dueDate;
      log.assignees = updated.assignedVolunteers.map(v => `${v.firstName} ${v.lastName}`);
      await log.save({ validateModifiedOnly: true });
    }

    res.json(updated);
  }
  catch (error) {
    res.status(400).json({ message: 'Error updating task.' });
  }
});

app.delete('/api/index/tasks/:id', authenticateJWT, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const user = await User.findById(req.userId);
    const log = new Log({ action: `Task Deleted by Admin: ${user.firstName} ${user.lastName}`, taskTitle: task.title, assignees: [], creationDate: new Date(), dueDate: task.dueDate });
    await log.save();

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task.' });
  }
});

app.post('/api/index/tasks/:taskId/clear', authenticateJWT, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) return res.status(404).json({ message: 'Task not found.' });
    task.assignedVolunteers = [];
    await task.save();
    res.json({ message: 'All assignees cleared.' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing assignees.' });
  }
});

app.get('/api/index/logs', authenticateJWT, async (req, res) => {
  try {
    const logs = await Log.find().sort({ creationDate: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching logs.' });
  }
});

app.delete('/api/index/logs/:id', async (req, res) => {
  try {
    const deletedLog = await Log.findByIdAndDelete(req.params.id);
    if (!deletedLog) return res.status(404).json({ message: 'Log not found' });
    res.status(200).json({ message: 'Log successfully deleted', deletedLog });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete log', error });
  }
});

module.exports = app;
module.exports.handler = serverless(app);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}