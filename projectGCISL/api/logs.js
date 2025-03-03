const Log = require('./models/Log');
const authenticateJWT = require('./middleware/authenticateJWT');
const connectDB = require('./utils/db');
require('dotenv').config();

module.exports = async (req, res) => {
  // Connect to database
  await connectDB();

  // Authentication
  const authResult = await authenticateJWT(req, res);
  if (!authResult.success) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      console.log('Fetching logs');
      // Add a limit to prevent timeout
      const logs = await Log.find().limit(100).sort({ creationDate: -1 });
      return res.status(200).json(logs);
    } catch (error) {
      console.error('Error fetching logs:', error);
      return res.status(500).json({ error: 'Error fetching logs.' });
    }
  } else if (req.method === 'DELETE') {
    const { id } = req.query;

    try {
      console.log('Deleting log:', id);
      const deletedLog = await Log.findByIdAndDelete(id);
      
      if (!deletedLog) {
        console.log('Log not found:', id);
        return res.status(404).json({ error: 'Log not found' });
      }
      
      console.log('Log successfully deleted:', id);
      return res.status(200).json({ 
        message: 'Log successfully deleted', 
        deletedLog 
      });
    } catch (error) {
      console.error('Error deleting log:', error);
      return res.status(500).json({ error: 'Failed to delete log' });
    }
  } else {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
};