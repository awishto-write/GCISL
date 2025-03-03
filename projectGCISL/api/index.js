const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const connectDB = require('./utils/db');
require('dotenv').config();

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
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));

// Connect to MongoDB
connectDB();

// Test endpoint
app.get('/test', (_req, res) => {
  res.json({ message: "Test endpoint works!" });
});

// This index.js is only for local development
// Vercel will use the API folder functions directly in production
if (process.env.NODE_ENV !== 'production') {
  // Basic routes (non-dynamic)
  const registerRouter = require('./register');
  const loginRouter = require('./login');
  const tasksRouter = require('./tasks/index');
  const userRouter = require('./user');
  const usersRouter = require('./users');
  const volunteerTasksRouter = require('./volunteer-tasks');
  const volunteerTaskCountRouter = require('./volunteer-task-count');
  const logsRouter = require('./logs');
  
  // Use non-dynamic routes
  app.use('/api/register', registerRouter);
  app.use('/api/login', loginRouter);
  app.use('/api/tasks', tasksRouter);
  app.use('/api/user', userRouter);
  app.use('/api/users', usersRouter);
  app.use('/api/volunteer-tasks', volunteerTasksRouter);
  app.use('/api/volunteer-task-count', volunteerTaskCountRouter);
  app.use('/api/logs', logsRouter);
  
  // Special handling for assign route
  app.post('/api/tasks/assign', (req, res) => {
    try {
      const assignHandler = require('./tasks/assign');
      // Check if it's using default export or direct handler
      if (typeof assignHandler === 'function') {
        assignHandler(req, res);
      } else if (assignHandler.default) {
        assignHandler.default(req, res);
      } else {
        throw new Error('Invalid handler format');
      }
    } catch (error) {
      console.error('Error in assign handler:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Special handling for remove route
  app.post('/api/tasks/remove', (req, res) => {
    try {
      const removeHandler = require('./tasks/remove');
      // Check if it's using default export or direct handler
      if (typeof removeHandler === 'function') {
        removeHandler(req, res);
      } else if (removeHandler.default) {
        removeHandler.default(req, res);
      } else {
        throw new Error('Invalid handler format');
      }
    } catch (error) {
      console.error('Error in remove handler:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // Handle the clear route specifically
  app.post('/api/tasks/:id/clear', (req, res) => {
    const id = req.params.id;
    req.query = { id }; // This is important for matching Vercel's param behavior
    
    try {
      const clearHandler = require('./tasks/[id]/clear');
      // Check if it's using default export or direct handler
      if (typeof clearHandler === 'function') {
        clearHandler(req, res);
      } else if (clearHandler.default) {
        clearHandler.default(req, res);
      } else {
        throw new Error('Invalid handler format');
      }
    } catch (error) {
      console.error('Error in clear handler:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Task ID routes with proper HTTP methods
  // GET method
  app.get('/api/tasks/:id', (req, res) => {
    const id = req.params.id;
    req.query = { id }; // This is how Vercel passes route params to handler functions
    
    try {
      const taskHandler = require('./tasks/[id]');
      // Check if it's using default export or direct handler
      if (typeof taskHandler === 'function') {
        taskHandler(req, res);
      } else if (taskHandler.default) {
        taskHandler.default(req, res);
      } else {
        throw new Error('Invalid handler format');
      }
    } catch (error) {
      console.error('Error in task GET handler:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // PUT method
  app.put('/api/tasks/:id', (req, res) => {
    const id = req.params.id;
    req.query = { id };
    
    try {
      const taskHandler = require('./tasks/[id]');
      // Check if it's using default export or direct handler
      if (typeof taskHandler === 'function') {
        taskHandler(req, res);
      } else if (taskHandler.default) {
        taskHandler.default(req, res);
      } else {
        throw new Error('Invalid handler format');
      }
    } catch (error) {
      console.error('Error in task PUT handler:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  // DELETE method
  app.delete('/api/tasks/:id', (req, res) => {
    const id = req.params.id;
    req.query = { id };
    
    try {
      const taskHandler = require('./tasks/[id]');
      // Check if it's using default export or direct handler
      if (typeof taskHandler === 'function') {
        taskHandler(req, res);
      } else if (taskHandler.default) {
        taskHandler.default(req, res);
      } else {
        throw new Error('Invalid handler format');
      }
    } catch (error) {
      console.error('Error in task DELETE handler:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;
module.exports.handler = serverless(app); // Export the app for Vercel serverless deployment