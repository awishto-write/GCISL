const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: String,
  creationDate: { type: Date, required: true, default: Date.now },
  dueDate: { type: Date, required: false },
  document: String,
  color: String,
  status: { type: String, enum: ['None', 'In Progress', 'Completed', 'To Redo'], default: 'None' },
  assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

module.exports = mongoose.models.Task || mongoose.model('Task', taskSchema);