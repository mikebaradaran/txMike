// server.js
const fs = require("fs");
var path = require('path') 
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

// // Global data to be shared across views
// const globalData = {
//   appUrl: 'https://txmike.glitch.me/',
//   author: 'Mike Baradaran'
// };
//app.set('view engine', 'ejs');
// app.set('views', path.join(__dirname, '/views'));
// app.use((req, res, next) => {
//   res.locals.globalData = globalData;
//   next();
// });

// function showPage(req,res, data){
//   var appname = req.get('host');
//   console.log(appname);
//   res.send(data.replaceAll("https://appname.glitch.me", appname));
// }
function showPage(res, pageName){
  res.sendFile(__dirname + "/" + pageName);
  //res.render(pageName);
}
app.get("/home", (req, res) => {
  showPage(res, "home.html");
});
app.get("/trainer", (req, res) => {
  showPage(res, "trainer.html");
});
app.get("/admin", (req, res) => {
   showPage(res, "admin.html");
});
app.get("/index", (req, res) => {
   showPage(res, "index.html");
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
function saveMessage(data) {
  const msg = messages.find((m) => m.name == data.name);
  if(msg)
    msg.body = data.body;
  else
    messages.push({ name: data.name, body: data.body });
}
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
