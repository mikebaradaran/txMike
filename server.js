// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const commonData = require('./common.js');

app.set('view engine', 'ejs');

// Middleware to serve static files from the public directory
app.use(express.static('public'));

// Middleware to make common data accessible in all views
app.use((req, res, next) => {
  res.locals.commonData = commonData;
  next();
});

// Define routes
app.get('/index', (req, res) => {
  res.render('index');
});
app.get('/home', (req, res) => {
  res.render('home');
});
app.get('/trainer', (req, res) => {
  res.render('trainer');
});
app.get('/admin', (req, res) => {
  res.render('admin');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
