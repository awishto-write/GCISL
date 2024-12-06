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

const User = mongoose.model('User', userSchema);

// List of Allowed Admin Names
const allowedAdminNames = [
  'Naomi Dion-Gokan',
  'Justin Keanini',
  'Teni Olugboyega',
  'Darcie Bagott',
  'Cory Bolkan',
];

// Register Route
app.post('/api/register', async (req, res) => {
  console.log('Request received:', req.body);
  const { firstName, lastName, email, phoneNumber, password, statusType } = req.body;
  const fullName = `${firstName} ${lastName}`;

  try {
    if (statusType === 'admin' && !allowedAdminNames.includes(fullName)) {
      return res.status(403).json({ error: 'You are not authorized to register as an admin.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword,
      statusType,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(400).json({ error: 'User already exists or registration failed.' });
  }
});

// Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password mismatch for user:', email);
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id, statusType: user.statusType },
      process.env.JWT_SECRET || 'yourSecretKey',
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login successful', token, statusType: user.statusType });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

// Middleware to authenticate and fetch user from JWT token
const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }

    req.userId = decoded.userId;
    next();
  });
};

// Route to fetch current user data
app.get('/api/user', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('firstName lastName');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user data.' });
  }
});

//Route to fetch users by role
app.get('/api/users', authenticateJWT, async (req, res) => {
  const role = req.query.role;

  try {
    const users = await User.find({ statusType: role });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

// Define Task Schema
const taskSchema = new mongoose.Schema({
  title: String,
  duration: String,
  document: String,
  color: String,
  status: { type: String, enum: ['None', 'In progress', 'Completed', 'To Redo'], default: 'None' }, // Just added
  assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Updated to store multiple volunteers
});

const Task = mongoose.model('Task', taskSchema);

// Task Routes
app.get('/api/tasks', authenticateJWT, async (req, res) => {
  try {
    const tasks = await Task.find({}).populate('assignedVolunteers', 'firstName lastName');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks.' });
  }
});

// Route to see tasks of a specific volunteer
app.get('/api/volunteer-tasks', authenticateJWT, async (req, res) => {
  try {
    // Find tasks where the authenticated user is in the assignedVolunteers array
    const tasks = await Task.find({ assignedVolunteers: req.userId }).populate('assignedVolunteers', 'firstName lastName');

    if (tasks.length === 0) {
      return res.status(404).json({ message: 'No tasks assigned to you.' });
    }

    res.json(tasks);
  } catch (error) {
    console.error('Error fetching volunteer tasks:', error);
    res.status(500).json({ message: 'Error fetching volunteer tasks.' });
  }
});

app.get('/api/volunteer-task-count', authenticateJWT, async (req, res) => {
  try {
    const taskCount = await Task.countDocuments({ assignedVolunteers: req.userId });
    res.json({ count: taskCount });
  } catch (error) {
    console.error('Error fetching task count:', error);
    res.status(500).json({ message: 'Error fetching task count.' });
  }
});


app.post('/api/tasks', authenticateJWT, async (req, res) => {
  const { title, duration, document, color, status } = req.body;

  try {
    const newTask = new Task({ title, duration, document, color, status });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: 'Error creating task.' });
  }
});

// Route to assign multiple volunteers to a task
app.post('/api/tasks/assign', authenticateJWT, async (req, res) => {
  const { volunteerId, taskId } = req.body;

  try {
    const task = await Task.findById(taskId);
    const volunteer = await User.findById(volunteerId);

    if (!task || !volunteer) {
      return res.status(404).json({ message: 'Task or Volunteer not found.' });
    }

    if (!task.assignedVolunteers.includes(volunteerId)) {
      task.assignedVolunteers.push(volunteerId);
      await task.save();
    }

    res.json({ message: 'Task assigned to volunteer successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error assigning task.' });
  }
});

// Route to remove a volunteer from a task
app.post('/api/tasks/remove', authenticateJWT, async (req, res) => {
  const { volunteerId, taskId } = req.body;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    task.assignedVolunteers = task.assignedVolunteers.filter(id => id.toString() !== volunteerId);
    await task.save();

    res.json({ message: 'Volunteer removed from task successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing volunteer from task.' });
  }
});

// Update, Delete, and Protected Routes
// The status has been added
app.put('/api/tasks/:id', authenticateJWT, async (req, res) => {
  const { title, duration, document, color, status } = req.body;
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, { title, duration, document, color, status }, { new: true });
    if (!task){
      return res.status(404).json({ message: 'Task not found.' });
    }
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: 'Error updating task.' });
  }
});

app.delete('/api/tasks/:id', authenticateJWT, async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    res.sendStatus(204);
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task.' });
  }
});

// Route to clear all assignees from a task
app.post('/api/tasks/:taskId/clear', authenticateJWT, async (req, res) => {
  try {
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found.' });
    }

    task.assignedVolunteers = [];
    await task.save();

    res.json({ message: 'All assignees cleared successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error clearing assignees.' });
  }
});

// Export the app as a serverless function
module.exports = app;
module.exports.handler = serverless(app); // Required for Vercel serverless

// For local and test, Vercel will ignore this in production
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001; // Local port for testing
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}