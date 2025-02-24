const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String,
  statusType: String,
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);