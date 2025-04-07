const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  taskTitle: { type: String, required: true },
  assignees: [{ type: String }],
  creationDate: { type: Date, required: true },
  dueDate: { type: Date },
});

module.exports = mongoose.models.Log || mongoose.model('Log', logSchema);