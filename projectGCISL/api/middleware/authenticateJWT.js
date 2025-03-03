const jwt = require('jsonwebtoken');

const authenticateJWT = async (req, res) => {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

  if (!token) {
    return { success: false };
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'yourSecretKey');
    req.userId = decoded.userId;
    return { success: true, userId: decoded.userId };
  } catch (err) {
    console.error('Authentication error:', err);
    return { success: false };
  }
};

module.exports = authenticateJWT;