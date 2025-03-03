const mongoose = require('mongoose');
const Log = require('./models/Log');
const authenticateJWT = require('./middleware/authenticateJWT');
require('dotenv').config();

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB for logs"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

module.exports = async (req, res) => {
  await authenticateJWT(req, res, async () => {
    if (req.method === 'GET') {
      try {
        const logs = await Log.find().sort({ creationDate: -1 }); // Sort by most recent logs
        res.json(logs);
      } catch (error) {
        console.error('Error fetching logs:', error);
        res.status(500).json({ message: 'Error fetching logs.' });
      }
    } else if (req.method === 'DELETE') {
      const { id } = req.query;

      try {
        const deletedLog = await Log.findByIdAndDelete(id);
        if (!deletedLog) {
          return res.status(404).json({ message: 'Log not found' });
        }
        res.status(200).json({ message: 'Log successfully deleted', deletedLog });
      } catch (error) {
        console.error('Error deleting log:', error);
        res.status(500).json({ message: 'Failed to delete log', error });
      }
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  });
};
