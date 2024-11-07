const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Check if a MongoDB connection exists and connect if not
if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,})
    .then(() => {
      console.log("Connected to MongoDB for login"); 
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err);
    });
}

// Define User Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  phoneNumber: String,
  password: String, // Store hashed password
  statusType: String, // 'admin' or 'volunteer'
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    // Generate a JWT token with user info
    const token = jwt.sign(
      { userId: user._id, statusType: user.statusType },
      process.env.JWT_SECRET || 'yourSecretKey', // Use a secure key in production
      { expiresIn: '2h' }
    );

    // Send back token and statusType for frontend redirection
    res.json({
      message: 'Login successful',
      token,
      statusType: user.statusType,
      redirectUrl: user.statusType === 'admin' ? '/admin-dashboard' : '/volunteer-dashboard'
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Login failed.' });
  }
};
