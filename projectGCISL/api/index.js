// const express = require('express');
// const serverless = require('serverless-http'); // Required for Vercel serverless deployment
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// require('dotenv').config(); // Load environment variables

// const app = express();
// app.use(express.json());

// console.log("Backend server is running"); // Just added
// app.get('/test', (req, res) => {
//   res.json({ message: "Test endpoint works!" });
// });

// // Configure CORS to allow requests from specific origins
// const allowedOrigins = [
//   'http://localhost:3000', // Local frontend URL for testing
//   'https://gciconnect.vercel.app' // Production frontend URL
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };
// app.use(cors(corsOptions));

// // Just Added
// const databaseUri = process.env.NODE_ENV === 'test' ? 
//   process.env.TEST_MONGODB_URI:
//   process.env.MONGODB_URI;

// // For local and development
// if (process.env.NODE_ENV !== 'test') {
//   // MongoDB Connection
//   mongoose.connect(databaseUri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));
// }

// // Define User Schema
// const userSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: { type: String, unique: true },
//   phoneNumber: String,
//   password: String, // Store hashed password
//   statusType: String, // 'admin' or 'volunteer'
// });

// const User = mongoose.model('User', userSchema);

// // List of Allowed Admin Names
// const allowedAdminNames = [
//   'Naomi Dion-Gokan',
//   'Justin Keanini',
//   'Teni Olugboyega',
//   'Darcie Bagott',
//   'Cory Bolkan',
// ];

// const logSchema = new mongoose.Schema({
//   action: { type: String, required: true }, // "Task Created" or "Task Deleted"
//   taskTitle: { type: String, required: true }, // Task title
//   assignees: [{ type: String }], // Array of assignee names
//   creationDate: { type: Date, required: true }, // Task creation date
//   dueDate: { type: Date }, // Task due date
// });
// const Log = mongoose.model('Log', logSchema);

// // Register Route
// app.post('/api/register', async (req, res) => {
//   console.log('Request received:', req.body);
//   const { firstName, lastName, email, phoneNumber, password, statusType } = req.body;
//   const fullName = `${firstName} ${lastName}`;

//   try {
//     if (statusType === 'admin' && !allowedAdminNames.includes(fullName)) {
//       return res.status(403).json({ error: 'You are not authorized to register as an admin.' });
//     }
//       // Check if a user with the same email already exists
//     const existingUser = await User.findOne({ email });
//     if (existingUser) {
//        return res.status(400).json({ error: 'Email is already in use.' });
//     }

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({
//       firstName,
//       lastName,
//       email,
//       phoneNumber,
//       password: hashedPassword,
//       statusType,
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully!' });
//   } catch (error) {
//     res.status(400).json({ error: 'User already exists or registration failed.' });
//   }
// });

// // Login Route
// app.post('/api/login', async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       console.log('User not found:', email);
//       return res.status(400).json({ error: 'Invalid email or password.' });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       console.log('Password mismatch for user:', email);
//       return res.status(400).json({ error: 'Invalid email or password.' });
//     }

//     const token = jwt.sign(
//       { userId: user._id, statusType: user.statusType },
//       process.env.JWT_SECRET || 'yourSecretKey',
//       { expiresIn: '2h' }
//     );

//     res.json({ message: 'Login successful', token, statusType: user.statusType });
//   } catch (error) {
//     res.status(500).json({ error: 'Login failed.' });
//   }
// });

// // Middleware to authenticate and fetch user from JWT token
// const authenticateJWT = (req, res, next) => {
//   const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

//   if (!token) {
//     return res.status(401).json({ message: 'Access token is missing or invalid.' });
//   }

//   jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey', (err, decoded) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid token.' });
//     }

//     req.userId = decoded.userId;
//     next();
//   });
// };

// // Route to fetch current user data
// app.get('/api/user', authenticateJWT, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select('firstName lastName');
//     if (!user) {
//       return res.status(404).json({ message: 'User not found.' });
//     }

//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching user data.' });
//   }
// });

// //Route to fetch users by role
// app.get('/api/users', authenticateJWT, async (req, res) => {
//   const role = req.query.role;

//   try {
//     const users = await User.find({ statusType: role });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users.' });
//   }
// });

// // Define Task Schema
// const taskSchema = new mongoose.Schema({
//   title: String,
//   creationDate: { type: Date, required: true, default: Date.now },
//   dueDate: { type: Date, required: false },
//   color: String,
//   status: { type: String, enum: ['None', 'In Progress', 'Completed', 'To Redo'], default: 'None' },
//   description: { type: String, default: '' }, // Add description
//   createdBy: { type: String, required: true }, // Add createdBy
//   assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
// });

// const Task = mongoose.model('Task', taskSchema);

// // Task Routes
// app.get('/api/tasks', authenticateJWT, async (req, res) => {
//   try {
//     const tasks = await Task.find({}).populate('assignedVolunteers', 'firstName lastName');
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching tasks.' });
//   }
// });

// // Route to see tasks of a specific volunteer
// app.get('/api/volunteer-tasks', authenticateJWT, async (req, res) => {
//   try {
//     // Find tasks where the authenticated user is in the assignedVolunteers array
//     const tasks = await Task.find({ assignedVolunteers: req.userId }).populate('assignedVolunteers', 'firstName lastName');

//     if (tasks.length === 0) {
//       return res.status(404).json({ message: 'No tasks assigned to you.' });
//     }

//     res.json(tasks);
//   } catch (error) {
//     console.error('Error fetching volunteer tasks:', error);
//     res.status(500).json({ message: 'Error fetching volunteer tasks.' });
//   }
// });

// app.get('/api/volunteer-task-count', authenticateJWT, async (req, res) => {
//   try {
//     const taskCount = await Task.countDocuments({ assignedVolunteers: req.userId });
//     res.json({ count: taskCount });
//   } catch (error) {
//     console.error('Error fetching task count:', error);
//     res.status(500).json({ message: 'Error fetching task count.' });
//   }
// });

// app.post('/api/tasks', authenticateJWT, async (req, res) => {
//   const { title, creationDate, dueDate, color, status, description, assignedVolunteers } = req.body;

//   try {
//     // Get the authenticated user
//     const user = await User.findById(req.userId);

//    // Check if a task with the same title already exists
//     const duplicateTask = await Task.findOne({ title: title });
//     if (duplicateTask) {
//       return res.status(400).json({ message: 'Task with the title "TASK" already exists! Please edit the title of existing task' });
//     }

//     // Create the new task
//     const newTask = new Task({
//       title,
//       creationDate,
//       dueDate,
//       color,
//       status,
//       description,
//       createdBy: `${user.firstName} ${user.lastName}`,
//       assignedVolunteers,
//     });
//     await newTask.save();

//     // Fetch assignee names if assignedVolunteers exist
//     const assigneeNames = assignedVolunteers
//       ? (
//           await User.find({ _id: { $in: assignedVolunteers } })
//         ).map((assignee) => `${assignee.firstName} ${assignee.lastName}`)
//       : [];

//     // Create a log for the task creation
//     const newLog = new Log({
//       action: `Task Created by Admin: ${user.firstName} ${user.lastName}`,
//       taskTitle: title,
//       assignees: assigneeNames,
//       creationDate,
//       dueDate,
//     });
//     await newLog.save();

//     res.status(201).json(newTask);
//   } catch (error) {
//     console.error('Error creating task:', error);
//     res.status(400).json({ message: 'Error creating task.' });
//   }
// });

// app.post('/api/tasks/assign', authenticateJWT, async (req, res) => {
//   const { volunteerId, taskId } = req.body;

//   console.log('Request body:', req.body); // Debug incoming data

//   try {
//     const task = await Task.findById(taskId);
//     const volunteer = await User.findById(volunteerId);

//     console.log('Task found:', task);
//     console.log('Volunteer found:', volunteer);

//     if (!task) return res.status(404).json({ message: 'Task not found.' });

//     // if (!task.assignedVolunteers.includes(volunteerId)) {
//     //   task.assignedVolunteers.push(volunteerId);
//     //   await task.save();
//     // }

//     if (!task.assignedVolunteers.some(id => id.toString() === volunteerId)) {
//       task.assignedVolunteers.push(volunteerId);
//       await task.save();
//       console.log('Volunteer assigned successfully.');
//     } else {
//       console.log('Volunteer is already assigned to this task.');
//     }

//     res.json({ message: 'Task assigned to volunteer successfully.' });
//   } 
//   // catch (error) {
//   //   res.status(500).json({ message: 'Error assigning task.' });
//   // }
//    catch (error) {
//   console.error('Error assigning task:', error.message);
//   console.error('Stack trace:', error.stack);
//   res.status(500).json({ message: 'Error assigning task.' });
//   }

// });

// app.post('/api/tasks/remove', authenticateJWT, async (req, res) => {
//   const { volunteerId, taskId } = req.body;

//   try {
//     const task = await Task.findById(taskId);
//     if (!task) return res.status(404).json({ message: 'Task not found.' });

//     task.assignedVolunteers = task.assignedVolunteers.filter(id => id.toString() !== volunteerId);
//     await task.save();

//     res.json({ message: 'Volunteer removed from task successfully.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error removing volunteer from task.' });
//   }
// });

// // Update, Delete, and Protected Routes
// // The status has been added
// // app.put('/api/tasks/:id', authenticateJWT, async (req, res) => {
// //   const { title, creationDate, dueDate, color, status, description } = req.body;
// //   try {
// //     const task = await Task.findByIdAndUpdate(req.params.id, { title, creationDate, dueDate, color, status, description }, { new: true });
// //     if (!task){
// //       return res.status(404).json({ message: 'Task not found.' });
// //     }
// //     res.json(task);
// //   } catch (error) {
// //     res.status(400).json({ message: 'Error updating task.' });
// //   }
// // });

// // app.put('/api/tasks/:id', authenticateJWT, async (req, res) => {
// //   const { title, creationDate, dueDate, color, status, description } = req.body;

// //   try {
// //     // Find and update the task
// //     const task = await Task.findByIdAndUpdate(
// //       req.params.id,
// //       { title, creationDate, dueDate, color, status, description },
// //       { new: true }
// //     );

// //     if (!task) {
// //       return res.status(404).json({ message: 'Task not found.' });
// //     }

// //     // Check if the user is a volunteer and the status is being set to "Completed"
// //     const user = await User.findById(req.userId);

// //    // if (user.statusType === 'VOLUNTEER' && status === 'Completed') {
// //     if (user.statusType === 'volunteer' && status === 'Completed') {
// //       const assignees = task.assignedVolunteers.length > 0
// //         ? (
// //             await User.find({ _id: { $in: task.assignedVolunteers } })
// //           ).map((volunteer) => `${volunteer.firstName} ${volunteer.lastName}`)
// //         : [];

// //       // Create a log for the task completion
// //       const newLog = new Log({
// //         action: `Completed Task by Volunteer: ${user.firstName} ${user.lastName}`,
// //         taskTitle: task.title,
// //         assignees,
// //         creationDate: task.creationDate,
// //         dueDate: task.dueDate,
// //       });

// //       await newLog.save();
// //     }

// //     // Return the updated task
// //     res.json(task);
// //   } catch (error) {
// //     console.error('Error updating task:', error);
// //     res.status(400).json({ message: 'Error updating task.' });
// //   }
// // });

// app.put('/api/tasks/:id', authenticateJWT, async (req, res) => {
//   const { title, creationDate, dueDate, color, status, description } = req.body;

//   try {
//     // Find the existing task
//     const existingTask = await Task.findById(req.params.id);

//     if (!existingTask) {
//       return res.status(404).json({ message: 'Task not found.' });
//     }

//     // Check if another task with the same title exists
//     const duplicateTask = await Task.findOne({ title: title, _id: { $ne: req.params.id } });
//     if (duplicateTask) {
//         return res.status(400).json({ message: 'Task with this title already exists. ' });
//    }

//     // Update the task with new values
//     const updatedTask = await Task.findByIdAndUpdate(
//       req.params.id,
//       { title, creationDate, dueDate, color, status, description },
//       { new: true }
//     );

//     // Check if the user is a volunteer and the status is being set to "Completed"
//     const user = await User.findById(req.userId);

//     if (user.statusType === 'volunteer' && status === 'Completed') {
//       const assignees = updatedTask.assignedVolunteers.length > 0
//         ? (
//             await User.find({ _id: { $in: updatedTask.assignedVolunteers } })
//           ).map((volunteer) => `${volunteer.firstName} ${volunteer.lastName}`)
//         : [];

//       // Create a log for task completion
//       const completionLog = new Log({
//         action: `Completed Task by Volunteer: ${user.firstName} ${user.lastName}`,
//         taskTitle: updatedTask.title,
//         assignees,
//         creationDate: updatedTask.creationDate,
//         dueDate: updatedTask.dueDate,
//       });

//       await completionLog.save();
//     } 

//     // Return the updated task
//     res.json(updatedTask);
//   } catch (error) {
//     console.error('Error updating task:', error);
//     res.status(400).json({ message: 'Error updating task.' });
//   }
// });


// app.delete('/api/tasks/:id', authenticateJWT, async (req, res) => {
//   try {
//     // Find the task to delete
//     const task = await Task.findByIdAndDelete(req.params.id);

//     if (!task) {
//       return res.status(404).json({ message: 'Task not found.' });
//     }

//     // Get the authenticated user
//     const user = await User.findById(req.userId);
//     // Create a log for the task deletion
//     const newLog = new Log({
//       action: `Task Deleted by Admin: ${user.firstName} ${user.lastName}`,
//       taskTitle: task.title,
//       assignees: [], // No assignees needed for deleted tasks
//       creationDate: task.creationDate,
//       dueDate: task.dueDate,
//     });
//     await newLog.save();

//     res.sendStatus(204);
//   } catch (error) {
//     console.error('Error deleting task:', error);
//     res.status(500).json({ message: 'Error deleting task.' });
//   }
// });


// // Route to clear all assignees from a task
// app.post('/api/tasks/:taskId/clear', authenticateJWT, async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.taskId);
//     if (!task) {
//       return res.status(404).json({ message: 'Task not found.' });
//     }

//     task.assignedVolunteers = [];
//     await task.save();

//     res.json({ message: 'All assignees cleared successfully.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error clearing assignees.' });
//   }
// });

// // Route to fetch all logs
// app.get('/api/logs', authenticateJWT, async (req, res) => {
//   try {
//     const logs = await Log.find().sort({ date: -1 }); // Sort by most recent logs
//     // modify that sort?
//     res.json(logs);
//   } 
//   catch (error) {
//     console.error('Error fetching logs:', error);
//     res.status(500).json({ message: 'Error fetching logs.' });
//   }
// });

// app.delete('/api/logs/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     const deletedLog = await Log.findByIdAndDelete(id);
//     if (!deletedLog) {
//       return res.status(404).json({ message: 'Log not found' });
//     }
//     res.status(200).json({ message: 'Log successfully deleted', deletedLog });
//   } 
//   catch (error) {
//     console.error('Error deleting log:', error);
//     res.status(500).json({ message: 'Failed to delete log', error });
//   }
// });


// // Export the app as a serverless function
// module.exports = app;
// module.exports.handler = serverless(app); // Required for Vercel serverless

// // For local and test, Vercel will ignore this in production
// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5001; // Local port for testing
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }








// api/index.js
// const express = require('express');
// const serverless = require('serverless-http');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(express.json());

// console.log("Backend server is running");

// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://gciconnect.vercel.app'
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };
// app.use(cors(corsOptions));

// const databaseUri = process.env.NODE_ENV === 'test' ?
//   process.env.TEST_MONGODB_URI :
//   process.env.MONGODB_URI;

// if (process.env.NODE_ENV !== 'test') {
//   mongoose.connect(databaseUri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));
// }

// const userSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: { type: String, unique: true },
//   phoneNumber: String,
//   password: String,
//   statusType: String,
// });
// const User = mongoose.model('User', userSchema);

// const allowedAdminNames = [
//   'Naomi Dion-Gokan',
//   'Justin Keanini',
//   'Teni Olugboyega',
//   'Darcie Bagott',
//   'Cory Bolkan',
// ];

// const logSchema = new mongoose.Schema({
//   action: { type: String, required: true },
//   taskTitle: { type: String, required: true },
//   assignees: [{ type: String }],
//   creationDate: { type: Date, required: true },
//   dueDate: { type: Date },
// });
// const Log = mongoose.model('Log', logSchema);

// app.post('/register', async (req, res) => {
//   const { firstName, lastName, email, phoneNumber, password, statusType } = req.body;
//   const fullName = `${firstName} ${lastName}`;
//   try {
//     if (statusType === 'admin' && !allowedAdminNames.includes(fullName)) {
//       return res.status(403).json({ error: 'You are not authorized to register as an admin.' });
//     }
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ error: 'Email is already in use.' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ firstName, lastName, email, phoneNumber, password: hashedPassword, statusType });
//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully!' });
//   } catch (error) {
//     res.status(400).json({ error: 'User already exists or registration failed.' });
//   }
// });

// app.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user || !(await bcrypt.compare(password, user.password))) {
//       return res.status(400).json({ error: 'Invalid email or password.' });
//     }
//     const token = jwt.sign(
//       { userId: user._id, statusType: user.statusType },
//       process.env.JWT_SECRET || 'yourSecretKey',
//       { expiresIn: '2h' }
//     );
//     res.json({ message: 'Login successful', token, statusType: user.statusType });
//   } catch (error) {
//     res.status(500).json({ error: 'Login failed.' });
//   }
// });

// const authenticateJWT = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Access token is missing or invalid.' });
//   jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey', (err, decoded) => {
//     if (err) return res.status(403).json({ message: 'Invalid token.' });
//     req.userId = decoded.userId;
//     next();
//   });
// };

// app.get('/user', authenticateJWT, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select('firstName lastName');
//     if (!user) return res.status(404).json({ message: 'User not found.' });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching user data.' });
//   }
// });

// app.get('/users', authenticateJWT, async (req, res) => {
//   try {
//     const users = await User.find({ statusType: req.query.role });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users.' });
//   }
// });

// const taskSchema = new mongoose.Schema({
//   title: String,
//   creationDate: { type: Date, required: true, default: Date.now },
//   dueDate: { type: Date },
//   color: String,
//   status: { type: String, enum: ['None', 'In Progress', 'Completed', 'To Redo'], default: 'None' },
//   description: { type: String, default: '' },
//   createdBy: { type: String, required: true },
//   assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
// });
// const Task = mongoose.model('Task', taskSchema);

// app.get('/tasks', authenticateJWT, async (req, res) => {
//   try {
//     const tasks = await Task.find({}).populate('assignedVolunteers', 'firstName lastName');
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching tasks.' });
//   }
// });

// app.get('/volunteer-tasks', authenticateJWT, async (req, res) => {
//   try {
//     const tasks = await Task.find({ assignedVolunteers: req.userId }).populate('assignedVolunteers', 'firstName lastName');
//     if (tasks.length === 0) return res.status(404).json({ message: 'No tasks assigned to you.' });
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching volunteer tasks.' });
//   }
// });

// app.get('/volunteer-task-count', authenticateJWT, async (req, res) => {
//   try {
//     const count = await Task.countDocuments({ assignedVolunteers: req.userId });
//     res.json({ count });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching task count.' });
//   }
// });

// app.post('/tasks', authenticateJWT, async (req, res) => {
//   const { title, creationDate, dueDate, color, status, description, assignedVolunteers } = req.body;
//   try {
//     const user = await User.findById(req.userId);
//     const duplicate = await Task.findOne({ title });
//     if (duplicate) return res.status(400).json({ message: 'Task with this title already exists!' });

//     const task = new Task({ title, creationDate, dueDate, color, status, description, createdBy: `${user.firstName} ${user.lastName}`, assignedVolunteers });
//     await task.save();

//     const assignees = assignedVolunteers ? (await User.find({ _id: { $in: assignedVolunteers } })).map(v => `${v.firstName} ${v.lastName}`) : [];
//     await new Log({ action: `Task Created by Admin: ${user.firstName} ${user.lastName}`, taskTitle: title, assignees, creationDate, dueDate }).save();

//     res.status(201).json(task);
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating task.' });
//   }
// });

// app.put('/tasks/:id', authenticateJWT, async (req, res) => {
//   const { title, creationDate, dueDate, color, status, description } = req.body;
//   try {
//     const task = await Task.findById(req.params.id);
//     if (!task) return res.status(404).json({ message: 'Task not found.' });
//     const duplicate = await Task.findOne({ title, _id: { $ne: req.params.id } });
//     if (duplicate) return res.status(400).json({ message: 'Task with this title already exists.' });

//     const updated = await Task.findByIdAndUpdate(req.params.id, { title, creationDate, dueDate, color, status, description }, { new: true });
//     const user = await User.findById(req.userId);

//     if (user.statusType === 'volunteer' && status === 'Completed') {
//       const assignees = updated.assignedVolunteers.length > 0
//         ? (await User.find({ _id: { $in: updated.assignedVolunteers } })).map(v => `${v.firstName} ${v.lastName}`)
//         : [];
//       await new Log({ action: `Completed Task by Volunteer: ${user.firstName} ${user.lastName}`, taskTitle: updated.title, assignees, creationDate: updated.creationDate, dueDate: updated.dueDate }).save();
//     }

//     res.json(updated);
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating task.' });
//   }
// });

// app.delete('/tasks/:id', authenticateJWT, async (req, res) => {
//   try {
//     const task = await Task.findByIdAndDelete(req.params.id);
//     if (!task) return res.status(404).json({ message: 'Task not found.' });
//     const user = await User.findById(req.userId);
//     await new Log({ action: `Task Deleted by Admin: ${user.firstName} ${user.lastName}`, taskTitle: task.title, assignees: [], creationDate: task.creationDate, dueDate: task.dueDate }).save();
//     res.sendStatus(204);
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting task.' });
//   }
// });

// app.post('/tasks/:taskId/clear', authenticateJWT, async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.taskId);
//     if (!task) return res.status(404).json({ message: 'Task not found.' });
//     task.assignedVolunteers = [];
//     await task.save();
//     res.json({ message: 'All assignees cleared successfully.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error clearing assignees.' });
//   }
// });

// app.get('/logs', authenticateJWT, async (req, res) => {
//   try {
//     const logs = await Log.find().sort({ date: -1 });
//     res.json(logs);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching logs.' });
//   }
// });

// app.delete('/logs/:id', async (req, res) => {
//   try {
//     const log = await Log.findByIdAndDelete(req.params.id);
//     if (!log) return res.status(404).json({ message: 'Log not found' });
//     res.status(200).json({ message: 'Log successfully deleted', log });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete log' });
//   }
// });

// module.exports = app;
// module.exports.handler = serverless(app);

// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5001;
//   app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// }








// api/index.js
// const express = require('express');
// const serverless = require('serverless-http');
// const mongoose = require('mongoose');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const cors = require('cors');
// require('dotenv').config();

// const app = express();
// app.use(express.json());

// console.log("Backend server is running");
// app.get('/api/index/test', (req, res) => {
//   res.json({ message: "Test endpoint works!" });
// });

// const allowedOrigins = [
//   'http://localhost:3000',
//   'https://gciconnect.vercel.app'
// ];

// const corsOptions = {
//   origin: (origin, callback) => {
//     if (allowedOrigins.includes(origin) || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error('Not allowed by CORS'));
//     }
//   },
// };
// app.use(cors(corsOptions));

// const databaseUri = process.env.NODE_ENV === 'test' ? 
//   process.env.TEST_MONGODB_URI:
//   process.env.MONGODB_URI;

// if (process.env.NODE_ENV !== 'test') {
//   mongoose.connect(databaseUri, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//     .then(() => console.log('MongoDB connected'))
//     .catch(err => console.error('MongoDB connection error:', err));
// }

// const userSchema = new mongoose.Schema({
//   firstName: String,
//   lastName: String,
//   email: { type: String, unique: true },
//   phoneNumber: String,
//   password: String,
//   statusType: String,
// });
// const User = mongoose.model('User', userSchema);

// const allowedAdminNames = [
//   'Naomi Dion-Gokan',
//   'Justin Keanini',
//   'Teni Olugboyega',
//   'Darcie Bagott',
//   'Cory Bolkan',
// ];

// const logSchema = new mongoose.Schema({
//   action: { type: String, required: true },
//   taskTitle: { type: String, required: true },
//   assignees: [{ type: String }],
//   creationDate: { type: Date, required: true },
//   dueDate: { type: Date },
// });
// const Log = mongoose.model('Log', logSchema);

// const taskSchema = new mongoose.Schema({
//   title: String,
//   creationDate: { type: Date, required: true, default: Date.now },
//   dueDate: { type: Date },
//   color: String,
//   status: { type: String, enum: ['None', 'In Progress', 'Completed', 'To Redo'], default: 'None' },
//   description: { type: String, default: '' },
//   createdBy: { type: String, required: true },
//   assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
// });
// const Task = mongoose.model('Task', taskSchema);

// const authenticateJWT = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ message: 'Access token is missing or invalid.' });
//   jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey', (err, decoded) => {
//     if (err) return res.status(403).json({ message: 'Invalid token.' });
//     req.userId = decoded.userId;
//     next();
//   });
// };

// app.post('/api/index/register', async (req, res) => {
//   const { firstName, lastName, email, phoneNumber, password, statusType } = req.body;
//   const fullName = `${firstName} ${lastName}`;

//   try {
//     if (statusType === 'admin' && !allowedAdminNames.includes(fullName)) {
//       return res.status(403).json({ error: 'You are not authorized to register as an admin.' });
//     }
//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ error: 'Email is already in use.' });

//     const hashedPassword = await bcrypt.hash(password, 10);
//     const newUser = new User({ firstName, lastName, email, phoneNumber, password: hashedPassword, statusType });
//     await newUser.save();
//     res.status(201).json({ message: 'User registered successfully!' });
//   } catch (error) {
//     res.status(400).json({ error: 'User already exists or registration failed.' });
//   }
// });

// app.post('/api/index/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ error: 'Invalid email or password.' });

//     const token = jwt.sign({ userId: user._id, statusType: user.statusType }, process.env.JWT_SECRET || 'yourSecretKey', { expiresIn: '2h' });
//     res.json({ message: 'Login successful', token, statusType: user.statusType });
//   } catch (error) {
//     res.status(500).json({ error: 'Login failed.' });
//   }
// });

// app.get('/api/index/user', authenticateJWT, async (req, res) => {
//   try {
//     const user = await User.findById(req.userId).select('firstName lastName');
//     if (!user) return res.status(404).json({ message: 'User not found.' });
//     res.json(user);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching user data.' });
//   }
// });

// app.get('/api/index/users', authenticateJWT, async (req, res) => {
//   const role = req.query.role;
//   try {
//     const users = await User.find({ statusType: role });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching users.' });
//   }
// });

// app.get('/api/index/tasks', authenticateJWT, async (req, res) => {
//   try {
//     const tasks = await Task.find({}).populate('assignedVolunteers', 'firstName lastName');
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching tasks.' });
//   }
// });

// app.get('/api/index/volunteer-tasks', authenticateJWT, async (req, res) => {
//   try {
//     const tasks = await Task.find({ assignedVolunteers: req.userId }).populate('assignedVolunteers', 'firstName lastName');
//     if (tasks.length === 0) return res.status(404).json({ message: 'No tasks assigned to you.' });
//     res.json(tasks);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching volunteer tasks.' });
//   }
// });

// app.get('/api/index/volunteer-task-count', authenticateJWT, async (req, res) => {
//   try {
//     const count = await Task.countDocuments({ assignedVolunteers: req.userId });
//     res.json({ count });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching task count.' });
//   }
// });

// app.post('/api/index/tasks', authenticateJWT, async (req, res) => {
//   const { title, creationDate, dueDate, color, status, description, assignedVolunteers } = req.body;
//   try {
//     const user = await User.findById(req.userId);
//     const duplicate = await Task.findOne({ title });
//     if (duplicate) return res.status(400).json({ message: 'Task title already exists.' });

//     const newTask = new Task({ title, creationDate, dueDate, color, status, description, createdBy: `${user.firstName} ${user.lastName}`, assignedVolunteers });
//     await newTask.save();

//     const assigneeNames = assignedVolunteers?.length ? (await User.find({ _id: { $in: assignedVolunteers } })).map(u => `${u.firstName} ${u.lastName}`) : [];
//     const log = new Log({ action: `Task Created by Admin: ${user.firstName} ${user.lastName}`, taskTitle: title, assignees: assigneeNames, creationDate, dueDate });
//     await log.save();

//     res.status(201).json(newTask);
//   } catch (error) {
//     res.status(400).json({ message: 'Error creating task.' });
//   }
// });

// app.post('/api/index/tasks/assign', authenticateJWT, async (req, res) => {
//   const { volunteerId, taskId } = req.body;
//   try {
//     const task = await Task.findById(taskId);
//     if (!task) return res.status(404).json({ message: 'Task not found.' });
//     if (!task.assignedVolunteers.includes(volunteerId)) {
//       task.assignedVolunteers.push(volunteerId);
//       await task.save();
//     }
//     res.json({ message: 'Volunteer assigned to task successfully.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error assigning volunteer.' });
//   }
// });

// app.post('/api/index/tasks/remove', authenticateJWT, async (req, res) => {
//   const { volunteerId, taskId } = req.body;
//   try {
//     const task = await Task.findById(taskId);
//     if (!task) return res.status(404).json({ message: 'Task not found.' });
//     task.assignedVolunteers = task.assignedVolunteers.filter(id => id.toString() !== volunteerId);
//     await task.save();
//     res.json({ message: 'Volunteer removed from task.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error removing volunteer.' });
//   }
// });

// app.put('/api/index/tasks/:id', authenticateJWT, async (req, res) => {
//   const { title, creationDate, dueDate, color, status, description } = req.body;
//   try {
//     const existing = await Task.findOne({ title, _id: { $ne: req.params.id } });
//     if (existing) return res.status(400).json({ message: 'Task with this title already exists.' });
//     const updated = await Task.findByIdAndUpdate(req.params.id, { title, creationDate, dueDate, color, status, description }, { new: true });
//     if (!updated) return res.status(404).json({ message: 'Task not found.' });

//     const user = await User.findById(req.userId);
//     if (user.statusType === 'volunteer' && status === 'Completed') {
//       const assignees = updated.assignedVolunteers?.length ? (await User.find({ _id: { $in: updated.assignedVolunteers } })).map(u => `${u.firstName} ${u.lastName}`) : [];
//       const log = new Log({ action: `Completed Task by Volunteer: ${user.firstName} ${user.lastName}`, taskTitle: updated.title, assignees, creationDate: updated.creationDate, dueDate: updated.dueDate });
//       await log.save();
//     }

//     res.json(updated);
//   } catch (error) {
//     res.status(400).json({ message: 'Error updating task.' });
//   }
// });

// app.delete('/api/index/tasks/:id', authenticateJWT, async (req, res) => {
//   try {
//     const task = await Task.findByIdAndDelete(req.params.id);
//     if (!task) return res.status(404).json({ message: 'Task not found.' });

//     const user = await User.findById(req.userId);
//     const log = new Log({ action: `Task Deleted by Admin: ${user.firstName} ${user.lastName}`, taskTitle: task.title, assignees: [], creationDate: task.creationDate, dueDate: task.dueDate });
//     await log.save();

//     res.sendStatus(204);
//   } catch (error) {
//     res.status(500).json({ message: 'Error deleting task.' });
//   }
// });

// app.post('/api/index/tasks/:taskId/clear', authenticateJWT, async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.taskId);
//     if (!task) return res.status(404).json({ message: 'Task not found.' });
//     task.assignedVolunteers = [];
//     await task.save();
//     res.json({ message: 'All assignees cleared.' });
//   } catch (error) {
//     res.status(500).json({ message: 'Error clearing assignees.' });
//   }
// });

// app.get('/api/index/logs', authenticateJWT, async (req, res) => {
//   try {
//     const logs = await Log.find().sort({ creationDate: -1 });
//     res.json(logs);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching logs.' });
//   }
// });

// app.delete('/api/index/logs/:id', async (req, res) => {
//   try {
//     const deletedLog = await Log.findByIdAndDelete(req.params.id);
//     if (!deletedLog) return res.status(404).json({ message: 'Log not found' });
//     res.status(200).json({ message: 'Log successfully deleted', deletedLog });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete log', error });
//   }
// });

// module.exports = app;
// module.exports.handler = serverless(app);

// if (process.env.NODE_ENV !== 'production') {
//   const PORT = process.env.PORT || 5001;
//   app.listen(PORT, () => console.log(`Local server running on port ${PORT}`));
// }





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

const logSchema = new mongoose.Schema({
  action: { type: String, required: true }, // "Task Created" or "Task Deleted"
  taskTitle: { type: String, required: true }, // Task title
  assignees: [{ type: String }], // Array of assignee names
  creationDate: { type: Date, required: true }, // Task creation date
  dueDate: { type: Date }, // Task due date
});
const Log = mongoose.model('Log', logSchema);


// Public route (no authentication needed)
app.post('/api/index', async (req, res, next) => {
  const { action } = req.body;

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
    console.error('Public action error:', error);
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
      const { volunteerId, taskId } = req.body;
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ message: 'Task not found.' });

      if (!task.assignedVolunteers.includes(volunteerId)) {
        task.assignedVolunteers.push(volunteerId);
        await task.save();
      }

      return res.json({ message: 'Volunteer assigned to task successfully.' });
    }

    else if (action === 'remove-task-volunteer') {
      const { volunteerId, taskId } = req.body;
      const task = await Task.findById(taskId);
      if (!task) return res.status(404).json({ message: 'Task not found.' });

      task.assignedVolunteers = task.assignedVolunteers.filter(id => id.toString() !== volunteerId);
      await task.save();

      return res.json({ message: 'Volunteer removed from task.' });
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