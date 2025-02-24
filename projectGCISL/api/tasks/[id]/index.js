const mongoose = require('mongoose');
const Task = require('../../models/Task');
const User = require('../../models/UserModel'); // Ensure User model is imported
const Log = require('../../models/Log'); // Ensure Log model is imported
const authenticateJWT = require('../../middleware/authenticateJWT');
require('dotenv').config();

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB for tasks"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

const taskSchema = new mongoose.Schema({
  title: String,
  creationDate: Date,
  dueDate: Date,
  color: String,
  status: String,
  description: String,
  createdBy: String,
  assignedVolunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

const TaskModel = mongoose.models.Task || mongoose.model('Task', taskSchema);

module.exports = async (req, res) => {
  if (req.method === 'PUT') {
    const { title, creationDate, dueDate, color, status, description } = req.body;

    try {
      const existingTask = await TaskModel.findById(req.query.id);

      if (!existingTask) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      const updatedTask = await TaskModel.findByIdAndUpdate(
        req.query.id,
        { title, creationDate, dueDate, color, status, description },
        { new: true }
      );

      const user = await User.findById(req.userId);

      if (user.statusType === 'volunteer' && status === 'Completed') {
        const assignees = updatedTask.assignedVolunteers.length > 0
          ? (
              await User.find({ _id: { $in: updatedTask.assignedVolunteers } })
            ).map((volunteer) => `${volunteer.firstName} ${volunteer.lastName}`)
          : [];

        const completionLog = new Log({
          action: `Completed Task by Volunteer: ${user.firstName} ${user.lastName}`,
          taskTitle: updatedTask.title,
          assignees,
          creationDate: updatedTask.creationDate,
          dueDate: updatedTask.dueDate,
        });

        await completionLog.save();
      }

      const updateLog = new Log({
        action: `Task Updated by ${user.firstName} ${user.lastName}`,
        taskTitle: updatedTask.title,
        creationDate: updatedTask.creationDate,
        dueDate: updatedTask.dueDate,
      });
      await updateLog.save();

      res.status(200).json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      res.status(400).json({ message: 'Error updating task.' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const task = await TaskModel.findByIdAndDelete(req.query.id);

      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      const user = await User.findById(req.userId);
      const deleteLog = new Log({
        action: `Task Deleted by ${user.firstName} ${user.lastName}`,
        taskTitle: task.title,
        creationDate: task.creationDate,
        dueDate: task.dueDate,
      });
      await deleteLog.save();

      res.sendStatus(204);
    } catch (error) {
      console.error('Error deleting task:', error);
      res.status(500).json({ message: 'Error deleting task.' });
    }
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
