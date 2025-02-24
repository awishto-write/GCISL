const express = require('express');
const router = express.Router();
const User = require('./models/UserModel');
const authenticateJWT = require('./middleware/authenticateJWT');

router.get('/', authenticateJWT, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('firstName lastName');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user.' });
  }
});

module.exports = router;