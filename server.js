// server.js
const fs = require("fs");
const express = require("express");
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });

app.get("/home", (req, res) => {
  fs.readFile("home.html", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send(data);
  });
});
app.get("/trainer", (req, res) => {
  fs.readFile("trainer.html", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send(data);
  });
});
app.get("/admin", (req, res) => {
  fs.readFile("admin.html", "utf8", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    res.send(data);
  });
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
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].name == data.name) {
      messages[i].body = data.body;
      return;
    }
  }

  messages.push({ name: data.name, body: data.body });
}

io.on("connection", (socket) => {
  socket.on("message", (data) => {
    if (data.name == "trainer") {
      if (data.body == "delete") {
        messages = [];
      } else if (data.body == "clear") {
        for (let i = 0; i < messages.length; i++) {
          messages[i].body = "";
        }
      }
      else if(data.body.startsWith("deletename")){
        const studentName = data.body.split(" ")[1];
        console.log(studentName);
        for (let i = 0; i < messages.length; i++) {
          if(messages[i].name == studentName){
            messages.splice(i,1);
            break;
          }
        }
        
      }
    } else {
      saveMessage(data);
    }

    io.sockets.emit("message", messages);
  });
});
