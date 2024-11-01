// module.exports = (req, res) => {
//   if (req.method === 'POST') {
//     res.status(200).json({ message: "User registered successfully!" });
//   } else {
//     res.status(405).json({ error: "Method Not Allowed" });
//   }
// };

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("MongoDB connection error:", err);
});

// Define User Schema
const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  phoneNumber: String,
  statusType: String,  // 'admin' or 'volunteer'
});

const User = mongoose.model('User', userSchema);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { firstName, lastName, email, password, phoneNumber, statusType } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,  // Store hashed password
      phoneNumber,
      statusType,
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).json({ error: "Registration failed. User may already exist." });
  }
};
