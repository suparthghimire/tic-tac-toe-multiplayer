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
  socket.emit("userJoin", socket.id);

  socket.on("joinRoom", ({ username }) => {
    let user = {};
    user.username = username;
    user.id = socket.id;
    users.push(user);
    console.log(users);
    io.emit("allUsers", users);
  });

  socket.on("message", ({ message, username }) => {
    io.emit("message", { message, username });
  });
  socket.on("disconnect", () => {
    users = [];
    io.emit("userdisconnected", socket.id);
    // reset board or redirect to room selection page if any
  });
});
