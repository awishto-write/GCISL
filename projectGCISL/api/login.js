const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

if (mongoose.connection.readyState === 0) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { email, password, action } = req.body;

  // ✅ Handle Forgot Password FIRST
  if (action === 'forgot-password') {
    try {
      const user = await User.findOne({ email });
      if (!user) return res.status(404).json({ error: 'No user found with this email.' });

      // Generate and hash temporary password
      const tempPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(tempPassword, 10);
      user.password = hashedPassword;
      await user.save();

      // Send email with temporary password
      await transporter.sendMail({
        from: `"Support" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Password Reset',
        text: `Hello ${user.firstName},\n\nYour temporary password is: ${tempPassword}\nPlease login and change your password.\n\nBest, Support Team`,
      });

      return res.json({ message: 'Temporary password sent to your email.' });
    } catch (err) {
      console.error('Error sending password email:', err);
      return res.status(500).json({ error: 'Failed to send email. Please check server logs.' });
    }
  }

  // ✅ Login Logic
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password.' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password.' });

    const token = jwt.sign(
      { userId: user._id, statusType: user.statusType },
      process.env.JWT_SECRET || 'yourSecretKey',
      { expiresIn: '2h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      statusType: user.statusType,
      redirectUrl: user.statusType === 'admin' ? '/admin-dashboard' : '/volunteer-dashboard',
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Login failed.' });
  }
};