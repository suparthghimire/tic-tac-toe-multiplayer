const path = require("path");
const http = require("http");
const express = require("express");
const app = express();
const server = http.createServer(app);

const io = require("socket.io")(server);
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, "public")));
server.listen(PORT, () => console.log(`Server Started At Port ${PORT}`));

let users = [];
io.on("connection", (socket) => {
  let id = socket.id;
  socket.emit("userJoin", { id });

  socket.on("joinRoom", (fetched_user) => {
    let user = {};
    user.username = fetched_user.username;
    user.id = socket.id;
    user.sign = fetched_user.sign;
    users.push(user);

    if (users.length > 1) {
      let num = Math.random();
      if (num < 0.5) {
        users[0].sign = "x";
        users[1].sign = "o";
      } else {
        users[0].sign = "o";
        users[1].sign = "x";
      }
    }

    console.log(users);
    io.emit("allUsers", users);
    io.emit("gameStart");
  });

  socket.on("markPlaced", ({ boxId, turn }) => {
    console.log(boxId, turn);
    socket.broadcast.emit("markPlaced", { boxId, turn });
  });

  socket.on("message", ({ message, username }) => {
    io.emit("message", { message, username });
  });
  socket.on("disconnect", () => {
    users = [];
    io.emit("userdisconnected", socket.id);
  });
});
