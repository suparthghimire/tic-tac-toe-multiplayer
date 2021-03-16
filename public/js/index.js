const socket = io();
// Initialization of self and opponent
let self = {
  id: "",
  username: "",
  score: 0,
  sign: "",
};

let opponent = {
  id: "",
  username: "",
  score: 0,
  sign: "",
};

document.querySelector(".overlay").style.visibility = "visible";

// let username = localStorage.getItem("username-toc-tac-toe-suaprth");
// if (!username) {
username = prompt("Enter your Username");
// localStorage.setItem("username-toc-tac-toe-suaprth", username);
// }
self.username = username;

socket.on("userJoin", ({ id }) => {
  console.log(`User Joined! ${id}`);
  self.id = id;
});

socket.emit("joinRoom", { username: self.username, sign: self.sign });

socket.on("allUsers", (users) => {
  if (users.length > 1) {
    opponent.id = users.find((user) => user.id != self.id).id;
    opponent.username = users.find((user) => user.id != self.id).username;

    self.sign = users.find((user) => user.username == self.username).sign;
    opponent.sign = users.find(
      (user) => user.username == opponent.username
    ).sign;

    console.log(`Self: ${self.username} - ${self.id} - ${self.sign}`);
    console.log(
      `Opponent: ${opponent.username} - ${opponent.id} - ${opponent.sign}`
    );
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

// game

socket.on("gameStart", () => {
  const WIN_COMBO = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  let turn = "x";
  const boxes = document.querySelectorAll(".box");

  initialState();

  function initialState() {
    boxes.forEach((box) => {
      box.classList = "box";
      box.addEventListener("click", handleClick, { once: true });
    });
  }

  function handleClick(e) {
    placeMark(e.target);

    if (checkWin()) {
      console.log(`${turn} Wins`);
    }
    // check for draw
    else if (checkDraw()) {
      console.log("Draw");
    } else swapTurn();
  }

  function checkWin() {
    return WIN_COMBO.some((combination) => {
      return combination.every((index) => {
        return boxes[index].classList.contains(turn);
      });
    });
  }

  function checkDraw() {
    return [...boxes].every((cell) => {
      return cell.classList.contains("x") || cell.classList.contains("o");
    });
  }

  function placeMark(box) {
    let boxId = box.id;
    socket.emit("markPlaced", { boxId, turn });
    document.getElementById(boxId).classList.add(turn);
  }

  socket.on("markPlaced", ({ boxId, turn }) => {
    document.getElementById(boxId).classList.add(turn);
  });

  function swapTurn() {
    if (turn == self.sign) turn = opponent.sign;
    else turn = self.sign;
  }

  function disableButtons() {}
  function enableButtons() {}

  // game
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
