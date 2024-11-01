//const express = require('express');
//const serverless = require('serverless-http');
//const app = express();

//app.get('/api', (req, res) => {
 // res.status(200).json({ message: "Index route is working!" });
//});

//module.exports = app;
//module.exports.handler = serverless(app);

module.exports = (req, res) => {
  if (req.method === 'POST') {
    res.status(200).json({ message: "User registered successfully!" });
  } else {
    res.status(405).json({ error: "Method Not Allowed" });
  }
};
