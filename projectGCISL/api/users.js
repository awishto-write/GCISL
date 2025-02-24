const express = require('express');
const router = express.Router();
const User = require('./models/User');
const authenticateJWT = require('./middleware/authenticateJWT');

router.get('/', authenticateJWT, async (req, res) => {
  const { role } = req.query;

  try {
    const users = await User.find({ statusType: role });
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
});

module.exports = router;