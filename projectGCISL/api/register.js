const express = require('express');
const serverless = require('serverless-http');
const app = express();

//app.get('/api', (req, res) => {
app.post('/register', (req, res) => {
 res.status(200).json({ message: "Index route is working!" });
});

module.exports = app;
module.exports.handler = serverless(app);
