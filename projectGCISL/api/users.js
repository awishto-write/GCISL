const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB for users by role"))
    .catch((err) => console.error("MongoDB connection error:", err));
}

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String,
  statusType: String,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const authenticateJWT = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey', (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token.' });
    }
    req.userId = decoded.userId;
    next();
  });
};

module.exports = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { role } = req.query;

  try {
    authenticateJWT(req, res, async () => {
      const users = await User.find({ statusType: role });
      res.json(users);
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users.' });
  }
};