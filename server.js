// server.js
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

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

server.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
//------------------------------------------------------------

var messages = [];

function doTrainerCommand(data) {
  if (data.body == "delete") {
    messages = [];
    return;
  }
  if (data.body == "clear") {
    for (let i = 0; i < messages.length; i++) {
      messages[i].body = "";
    }
    return;
  }
  if (data.body.startsWith("deletename")) {
    const studentName = data.body.replace("deletename ","").toLowerCase();
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].name.toLowerCase() == studentName) {
        messages.splice(i, 1);
        break;
      }
    }
  }
}

function saveMessage(data) {
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].name.toLowerCase() == data.name.toLowerCase()) {
      messages[i].body = data.body;
      return;
    }
  }

  messages.push({ name: data.name, body: data.body });
}

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    if (data.name.toLowerCase() == "trainer") {
      doTrainerCommand(data);
    } else {
      saveMessage(data);
    }

    io.sockets.emit("message", messages);
  });
});
