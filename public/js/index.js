const socket = io();
// chat

let self = {
  id: "",
  username: "",
  score: 0,
};

let opponent = {
  id: "",
  username: "",
  score: 0,
};

document.querySelector(".overlay").style.visibility = "visible";

let username = localStorage.getItem("username-toc-tac-toe-suaprth");
if (!username) {
  username = prompt("Enter your Username");
  localStorage.setItem("username-toc-tac-toe-suaprth", username);
}
socket.emit("joinRoom", { username });
socket.on("userJoin", (socketid) => {
  self.username = username;
  self.id = socketid;
});

socket.on("allUsers", (users) => {
  if (users.length > 1) {
    opponent.id = users.find((user) => user.id != self.id).id;
    opponent.username = users.find((user) => user.id != self.id).username;
    console.log(`Self: ${self.username} - ${self.id}`);
    console.log(`Opponent: ${opponent.username} - ${opponent.id}`);
    // set username for opponent and self
    setUserName(self.username, opponent.username);
    // TODO: Make sure to enable the waiting for player to join option
    document.querySelector(".overlay").style.visibility = "hidden";
  }
});

function setUserName(self, opponent) {
  document.querySelector(".self_name").innerHTML = self;
  document.querySelector(".opponent_name").innerHTML = opponent;
}

socket.on("userdisconnected", (socketId) => {
  if (socketId != self.id) {
    console.log(`${self.username} won the game`);
    // reset board or redirect to room selection page if any
  }
});

/* 
------------------------
------------------------
------------------------
----------CHAT----------
------------------------
------------------------
------------------------
*/

socket.on("message", ({ message, username }) => {
  createChatList(message, username);
});

const chatForm = document.querySelector("#chat-form");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  let message = chatForm.chatInput.value;
  chatForm.chatInput.value = "";
  socket.emit("message", { message, username });
});

function createChatList(message, username) {
  let chatList = document.querySelector(".chat-messages");
  let chatItem = document.createElement("li");

  chatItem.innerHTML = `
   <h3 class="username">
        ${username}
    </h3>
    <p class="message">
        ${message}
    </p>
  `;

  chatItem.classList.add("chat-item");
  chatList.appendChild(chatItem);
}
