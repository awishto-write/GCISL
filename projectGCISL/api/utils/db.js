const mongoose = require('mongoose');

// Database connection utility function
async function connectDB() {
  // If already connected, return the existing connection
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  const databaseUri = process.env.NODE_ENV === 'test' ? 
    process.env.TEST_MONGODB_URI :
    process.env.MONGODB_URI;

  if (!databaseUri) {
    throw new Error('Database URI is not defined');
  }

  try {
    await mongoose.connect(databaseUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

module.exports = connectDB;