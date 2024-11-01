module.exports = (req, res) => {
  if (req.method === 'POST') {
    res.status(200).json({ message: "User registered successfully!" });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
