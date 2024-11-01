const express = require('express');
const serverless = require('serverless-http');
const app = express();

app.use(express.json());

app.post('/', async (req, res) => {
  // Registration logic here
  res.json({ message: "User registered successfully!" });
});

module.exports = app;
module.exports.handler = serverless(app);
