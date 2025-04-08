process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION:', err);
});
process.on('unhandledRejection', err => {
  console.error('UNHANDLED PROMISE REJECTION:', err);
});

const express = require('express');
const serverless = require('serverless-http'); // Required for Vercel serverless deployment
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config(); // Load environment variables

const app = express();
app.use(express.json());

console.log("Backend server is running"); // Just added
app.get('/test', (req, res) => {
  res.json({ message: "Test endpoint works!" });
});

// Configure CORS to allow requests from specific origins
const allowedOrigins = [
  'http://localhost:3000', // Local frontend URL for testing
  'https://gciconnect.vercel.app' // Production frontend URL
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

// Just Added
const databaseUri = process.env.NODE_ENV === 'test' ? 
  process.env.TEST_MONGODB_URI:
  process.env.MONGODB_URI;

// For local and development
if (process.env.NODE_ENV !== 'test') {
  // MongoDB Connection
  mongoose.connect(databaseUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Define User Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String, // Store hashed password
  statusType: String, // 'admin' or 'volunteer'
});

//const User = mongoose.model('User', userSchema);

// List of Allowed Admin Names
const allowedAdminNames = [
  'Naomi Dion-Gokan',
  'Justin Keanini',
  'Teni Olugboyega',
  'Darcie Bagott',
  'Cory Bolkan',
];

const logSchema = new mongoose.Schema({
  action: { type: String, required: true }, // "Task Created" or "Task Deleted"
  taskTitle: { type: String, required: true }, // Task title
  assignees: [{ type: String }], // Array of assignee names
  creationDate: { type: Date, required: true }, // Task creation date
  dueDate: { type: Date }, // Task due date
});
//const Log = mongoose.model('Log', logSchema);

const taskSchema = new mongoose.Schema({
  title: String,
  creationDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: false },
  color: String,
  status: { type: String, enum: ['None', 'In Progress', 'Completed', 'To Redo'], default: 'None' },
  description: { type: String, default: '' }, // Add description
  createdBy: { type: String, required: true }, // Add createdBy
  assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

//const Task = mongoose.model('Task', taskSchema);


const User = mongoose.models.User || mongoose.model('User', userSchema);
const Log = mongoose.models.Log || mongoose.model('Log', logSchema);
const Task = mongoose.models.Task || mongoose.model('Task', taskSchema);

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Missing token' });

  jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey', (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Invalid token' });
    req.userId = decoded.userId;
    next();
  });
};

// Public route (no authentication needed)
app.post('/api/index', async (req, res, next) => {
  console.log('BODY RECEIVED:', req.body); 
  //console.log('BODY:', req.body); // TEMP
  console.log('ENV:', process.env.NODE_ENV); // TEMP
  //const { action } = req.body;
  console.log('POST /api/index - Body:', req.body);

  const action = req.body?.action;
  if (!action) {
    return res.status(400).json({ error: 'Missing action in body' });
  }

  try {
    if (action === 'register') {
      const { firstName, lastName, email, phoneNumber, password, statusType } = req.body;
      const fullName = `${firstName} ${lastName}`;

      if (statusType === 'admin' && !allowedAdminNames.includes(fullName)) {
        return res.status(403).json({ error: 'Not authorized as admin.' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) return res.status(400).json({ error: 'Email already in use.' });

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ firstName, lastName, email, phoneNumber, password: hashedPassword, statusType });
      await newUser.save();
      return res.status(201).json({ message: 'User registered successfully!' });

    } else if (action === 'login') {
      console.log('Handling login');
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ error: 'Invalid email or password.' });

      const token = jwt.sign({ userId: user._id, statusType: user.statusType }, process.env.JWT_SECRET || 'yourSecretKey', { expiresIn: '2h' });
      return res.json({ message: 'Login successful', token, statusType: user.statusType });
    }

    return next(); // Pass to the next route for authenticated actions
  } catch (error) {
    //console.error('Public action error:', error);
    console.error('SERVER ERROR:', error); // Important!
    return res.status(500).json({ error: 'Server error' });
  }
});

// Authenticated route (requires token)
app.post('/api/index', authenticateJWT, async (req, res) => {
  const { action } = req.body;

  try {
    if (action === 'get-user') {
      const user = await User.findById(req.userId).select('firstName lastName');
      if (!user) return res.status(404).json({ message: 'User not found.' });
      return res.json(user);
    }

    else if (action === 'get-users') {
      const { role } = req.body;
      const users = await User.find({ statusType: role });
      return res.json(users);
    }

    else if (action === 'get-tasks') {
      const tasks = await Task.find({}).populate('assignedVolunteers', 'firstName lastName');
      return res.json(tasks);
    }

    else if (action === 'get-volunteer-tasks') {
      const tasks = await Task.find({ assignedVolunteers: req.userId }).populate('assignedVolunteers', 'firstName lastName');
      if (!tasks.length) return res.status(404).json({ message: 'No tasks assigned to you.' });
      return res.json(tasks);
    }

    else if (action === 'get-volunteer-task-count') {
      const count = await Task.countDocuments({ assignedVolunteers: req.userId });
      return res.json({ count });
    }

    else if (action === 'create-task') {
      const { title, creationDate, dueDate, color, status, description, assignedVolunteers } = req.body;
      const user = await User.findById(req.userId);
      const duplicate = await Task.findOne({ title });
      if (duplicate) return res.status(400).json({ message: 'Task title already exists.' });

      const newTask = new Task({
        title, creationDate, dueDate, color, status, description,
        createdBy: `${user.firstName} ${user.lastName}`,
        assignedVolunteers
      });
      await newTask.save();

      const assigneeNames = assignedVolunteers?.length
        ? (await User.find({ _id: { $in: assignedVolunteers } })).map(u => `${u.firstName} ${u.lastName}`)
        : [];

      const log = new Log({
        action: `Task Created by Admin: ${user.firstName} ${user.lastName}`,
        taskTitle: title,
        assignees: assigneeNames,
        creationDate,
        dueDate
      });
      await log.save();

      return res.status(201).json(newTask);
    }

    else if (action === 'assign-task') {
      try {
        const { volunteerId, taskId } = req.body;
        if (!volunteerId || !taskId) {
          console.error('Missing volunteerId or taskId:', req.body);
          return res.status(400).json({ message: 'Missing volunteerId or taskId' });
        }

        const task = await Task.findById(taskId);
        if (!task) {
          console.error('Task not found for ID:', taskId);
          return res.status(404).json({ message: 'Task not found.' });
        }
    
        // Handle both populated and raw ObjectId scenarios
        const isAlreadyAssigned = task.assignedVolunteers.some(v =>
          (v._id || v).toString() === volunteerId
        );
    
        if (!isAlreadyAssigned) {
         // task.assignedVolunteers.push(new mongoose.Types.ObjectId(volunteerId));
          task.assignedVolunteers.push(volunteerId);
         // await task.save();
          await task.save({ validateModifiedOnly: true }); // ✅ This is the fix
        }
    
        console.log('Volunteer assigned:', volunteerId, 'Task:', taskId);
        return res.json({ message: 'Volunteer assigned to task successfully.' });
      } catch (error) {
        console.error('Error in assign-task:', error);
        return res.status(500).json({ error: 'Server error', details: error.message });
      }
    }
    
    else if (action === 'remove-task-volunteer') {
      try {
        const { volunteerId, taskId } = req.body;
    
        console.log('Removing volunteer:', volunteerId, 'from task:', taskId);
    
        const task = await Task.findById(taskId);
        if (!task) return res.status(404).json({ message: 'Task not found.' });
    
        task.assignedVolunteers = task.assignedVolunteers.filter(v =>
          (v._id || v).toString() !== volunteerId
        );
    
       // await task.save();
        await task.save({ validateModifiedOnly: true }); // ✅ This is the fix
    
        return res.json({ message: 'Volunteer removed from task.' });
      } catch (error) {
        console.error('Error removing volunteer from task:', error);
        return res.status(500).json({ error: 'Server error', details: error.message });
      }
    }
    
    else if (action === 'update-task') {
      const { id, title, creationDate, dueDate, color, status, description } = req.body;
      const existing = await Task.findOne({ title, _id: { $ne: id } });
      if (existing) return res.status(400).json({ message: 'Task with this title already exists.' });

      const updated = await Task.findByIdAndUpdate(id, {
        title, creationDate, dueDate, color, status, description
      }, { new: true });
      if (!updated) return res.status(404).json({ message: 'Task not found.' });

      const user = await User.findById(req.userId);
      if (user.statusType === 'volunteer' && status === 'Completed') {
        const assignees = updated.assignedVolunteers?.length
          ? (await User.find({ _id: { $in: updated.assignedVolunteers } })).map(u => `${u.firstName} ${u.lastName}`)
          : [];

        const log = new Log({
          action: `Completed Task by Volunteer: ${user.firstName} ${user.lastName}`,
          taskTitle: updated.title,
          assignees,
          creationDate: updated.creationDate,
          dueDate: updated.dueDate
        });
        await log.save();
      }

      return res.json(updated);
    }

    else if (action === 'delete-task') {
      const { id } = req.body;
      const task = await Task.findByIdAndDelete(id);
      if (!task) return res.status(404).json({ message: 'Task not found.' });

      const user = await User.findById(req.userId);
      const log = new Log({
        action: `Task Deleted by Admin: ${user.firstName} ${user.lastName}`,
        taskTitle: task.title,
        assignees: [],
        creationDate: task.creationDate,
        dueDate: task.dueDate
      });
      await log.save();

      return res.sendStatus(204);
    }

    else if (action === 'clear-task-assignees') {
      const { taskId } = req.body;
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ message: 'Task not found.' });

      task.assignedVolunteers = [];
      await task.save();

      return res.json({ message: 'All assignees cleared.' });
    }

    else if (action === 'get-logs') {
      const logs = await Log.find().sort({ creationDate: -1 });
      return res.json(logs);
    }

    else if (action === 'delete-log') {
      const { id } = req.body;
      const deletedLog = await Log.findByIdAndDelete(id);
      if (!deletedLog) return res.status(404).json({ message: 'Log not found' });
      return res.status(200).json({ message: 'Log deleted', deletedLog });
    }

    else {
      return res.status(400).json({ error: 'Invalid action.' });
    }

  } catch (error) {
    console.error('Authenticated action error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
});

module.exports = app;
module.exports.handler = serverless(app);

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
}
