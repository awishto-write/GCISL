import Task from '../../models/Task';
import User from '../../models/UserModel';
import Log from '../../models/Log';
import authenticateJWT from '../../middleware/authenticateJWT';
import connectDB from '../../db';

connectDB();

export default async function handler(req, res) {
  const { taskId } = req.query; // Fix: Use taskId from query params

  if (!taskId) {
    return res.status(400).json({ message: 'Task ID is required.' });
  }

  if (req.method === 'OPTIONS') {
    res.setHeader("Allow", "PUT, DELETE, OPTIONS");
    return res.status(204).end();
  }

  await authenticateJWT(req, res, async () => {
    if (req.method === 'PUT') {
      const { title, creationDate, dueDate, status, description, assignedVolunteers } = req.body;

      try {
        const duplicateTask = await Task.findOne({ title, _id: { $ne: taskId } });
        if (duplicateTask) {
          return res.status(400).json({ message: 'Task with this title already exists.' });
        }

        const updatedTask = await Task.findByIdAndUpdate(
          taskId,
          { title, creationDate, dueDate, status, description, assignedVolunteers },
          { new: true }
        );

        if (!updatedTask) {
          return res.status(404).json({ message: 'Task not found.' });
        }

        const user = await User.findById(req.userId);
        await new Log({
          action: `Task Updated by ${user.firstName} ${user.lastName}`,
          taskTitle: updatedTask.title,
          creationDate: updatedTask.creationDate,
          dueDate: updatedTask.dueDate,
        }).save();

        return res.status(200).json(updatedTask);
      } catch (error) {
        console.error('Error updating task:', error);
        return res.status(400).json({ message: 'Error updating task.' });
      }
    } else if (req.method === 'DELETE') {
      try {
        const task = await Task.findByIdAndDelete(taskId);
        if (!task) {
          return res.status(404).json({ message: 'Task not found.' });
        }

        const user = await User.findById(req.userId);
        await new Log({
          action: `Task Deleted by ${user.firstName} ${user.lastName}`,
          taskTitle: task.title,
          creationDate: task.creationDate,
          dueDate: task.dueDate,
        }).save();

        return res.sendStatus(204);
      } catch (error) {
        console.error('Error deleting task:', error);
        return res.status(500).json({ message: 'Error deleting task.' });
      }
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  });
}