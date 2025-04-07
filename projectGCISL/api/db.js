const mongoose = require('mongoose');
require('dotenv').config();

const databaseUri = process.env.NODE_ENV === 'test' ? process.env.TEST_MONGODB_URI : process.env.MONGODB_URI;

const connectDB = async () => {
  if (global.mongooseConnection) {
    return global.mongooseConnection;
  }

  try {
    global.mongooseConnection = mongoose.connect(databaseUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    mongoose.connection.once('open', () => {
      console.log('MongoDB connected');
    });

    return global.mongooseConnection;
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
