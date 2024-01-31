// server.js
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

const commonData = require('./common.js');

app.set('view engine', 'ejs');

// Middleware to make common data accessible in all views
app.use((req, res, next) => {
  res.locals.commonData = commonData;
  next();
});

// Define routes
app.get('/', (req, res) => {
  res.render('index');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
