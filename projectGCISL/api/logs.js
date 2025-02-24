const express = require('express');
const router = express.Router();
const Log = require('./models/Log');
const authenticateJWT = require('./middleware/authenticateJWT');

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const logs = await Log.find().sort({ creationDate: -1 }); // Sort by most recent logs
    res.json(logs);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ message: 'Error fetching logs.' });
  }
});

router.delete('/:id', authenticateJWT, async (req, res) => {
  const { id } = req.params;

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
});

module.exports = router;