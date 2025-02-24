const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  // Check for missing fields
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { userId: user._id, statusType: user.statusType },
      process.env.JWT_SECRET || 'yourSecretKey',
      { expiresIn: '2h' }
    );

    res.json({ message: 'Login successful', token, statusType: user.statusType });
  } catch (error) {
    res.status(500).json({ error: 'Login failed.' });
  }
});

module.exports = router;