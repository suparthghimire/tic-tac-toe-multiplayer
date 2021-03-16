const socket = io();

// selectors
const boxes = document.querySelectorAll(".box");

function startGame() {
  boxes.forEach((box) => {
    box.addEventListener("click", handleClick);
  });
}

function handleClick(e) {
  // mark box
  // check for win
  // check for draw
  // swap turn
}
