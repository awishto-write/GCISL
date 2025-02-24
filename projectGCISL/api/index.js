const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const connectDB = require('./db'); // Import the MongoDB connection

const app = express();
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  'http://localhost:3000',
  'https://gciconnect.vercel.app',
];

app.use(cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));

// Connect to MongoDB
connectDB();

// Import routes
const registerRouter = require('./register');
const loginRouter = require('./login');
const tasksRouter = require('./tasks');
const userRouter = require('./user');
const usersRouter = require('./users');
const volunteerTasksRouter = require('./volunteer-tasks');
const volunteerTaskCountRouter = require('./volunteer-task-count');
const logsRouter = require('./logs');
const taskDetailsRouter = require('./tasks/[id]'); 
const assignRouter = require('./tasks/assign');
const removeRouter = require('./tasks/remove'); 
const clearAssigneesRouter = require('./tasks/clear'); 

// Use routes
app.use('/api/register', registerRouter);
app.use('/api/login', loginRouter);
app.use('/api/tasks', tasksRouter);
app.use('/api/user', userRouter);
app.use('/api/users', usersRouter);
app.use('/api/volunteer-tasks', volunteerTasksRouter);
app.use('/api/volunteer-task-count', volunteerTaskCountRouter);
app.use('/api/logs', logsRouter);
app.use('/api/tasks', taskDetailsRouter); 
app.use('/api/tasks/assign', assignRouter); 
app.use('/api/tasks/remove', removeRouter); 
app.use('/api/tasks', clearAssigneesRouter); 

// Test endpoint
app.get('/test', (_req, res) => {
  res.json({ message: "Test endpoint works!" });
});

// Export the app for Vercel
module.exports = app;
module.exports.handler = serverless(app);

// Local server (ignored by Vercel in production)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
