// module.exports = (req, res) => {
//   if (req.method === 'POST') {
//     res.status(200).json({ message: "User registered successfully!" });
//   } else {
//     res.status(405).json({ error: "Method Not Allowed" });
//   }
// };

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection using environment variable for the URI
mongoose.connect(process.env.MONGODB_URI, {
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
  phoneNumber: String,
  password: String, // Store hashed password
  statusType: String, // 'admin' or 'volunteer'
});

const User = mongoose.model('User', userSchema);

// List of Allowed Admin Names
const allowedAdminNames = [
  'Naomi Dion-Gokan',
  'Justin Keanini',
  'Teni Olugboyega',
  'Darcie Bagott',
  'Cory Bolkan',
];

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  const { firstName, lastName, email, phoneNumber, password, statusType } = req.body;
  const fullName = `${firstName} ${lastName}`;

  try {
    // Check if the full name is authorized to register as an admin
    if (statusType === 'admin' && !allowedAdminNames.includes(fullName)) {
      return res.status(403).json({ error: 'You are not authorized to register as an admin.' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      password: hashedPassword, // Store hashed password
      statusType,
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    console.error("Error saving user:", error);
    res.status(400).json({ error: 'User already exists or registration failed.' });
  }
};
