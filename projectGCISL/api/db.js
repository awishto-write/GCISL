const mongoose = require('mongoose');
require('dotenv').config();

const databaseUri = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

const connectDB = async () => {
  if (mongoose.connection.readyState === 0) {
    try {
      await mongoose.connect(databaseUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      console.log('MongoDB connected');
    } catch (err) {
      console.error('MongoDB connection error:', err);
      process.exit(1); // Exit the process if the connection fails
    }
  }
};

module.exports = connectDB;