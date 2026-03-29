import {
  createInitialState,
  queueDirection,
  stepGame,
  togglePause,
} from "./game.js";

const GRID_SIZE = 16;
const TICK_MS = 140;

const board = document.querySelector("#board");
const score = document.querySelector("#score");
const status = document.querySelector("#status");
const pauseButton = document.querySelector("#pause-button");
const restartButton = document.querySelector("#restart-button");
const directionButtons = document.querySelectorAll("[data-direction]");

let state = createInitialState({
  width: GRID_SIZE,
  height: GRID_SIZE,
});

const cells = [];

function buildBoard() {
  board.style.setProperty("--board-size", String(GRID_SIZE));

  for (let index = 0; index < GRID_SIZE * GRID_SIZE; index += 1) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.setAttribute("role", "gridcell");
    board.append(cell);
    cells.push(cell);
  }
}

function toIndex(position) {
  return position.y * GRID_SIZE + position.x;
}

function getStatusCopy() {
  switch (state.status) {
    case "paused":
      return "Paused. Press Space or Resume to continue.";
    case "game-over":
      return "Game over. Press Restart, Enter, or R to play again.";
    case "won":
      return "Board cleared. Restart to play again.";
    default:
      return "Use arrow keys or WASD to move.";
  }
}

function render() {
  for (const cell of cells) {
    cell.className = "cell";
  }

  for (const segment of state.snake) {
    cells[toIndex(segment)].classList.add("cell--snake");
  }

  cells[toIndex(state.snake[0])].classList.add("cell--head");

  if (state.food) {
    cells[toIndex(state.food)].classList.add("cell--food");
  }

  score.textContent = String(state.score);
  status.textContent = getStatusCopy();
  pauseButton.textContent = state.status === "paused" ? "Resume" : "Pause";
  pauseButton.disabled = state.status === "game-over" || state.status === "won";
}

function restartGame() {
  state = createInitialState({
    width: GRID_SIZE,
    height: GRID_SIZE,
  });
  render();
}

function handleDirectionInput(input) {
  if (state.status === "game-over" || state.status === "won") {
    return;
  }

  state = queueDirection(state, input);
  render();
}

document.addEventListener("keydown", (event) => {
  if (event.key === " ") {
    event.preventDefault();
    state = togglePause(state);
    render();
    return;
  }

  if (event.key === "r" || event.key === "R" || event.key === "Enter") {
    event.preventDefault();
    restartGame();
    return;
  }

  if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"].includes(event.key)) {
    return;
  }

  event.preventDefault();
  handleDirectionInput(event.key);
});

for (const button of directionButtons) {
  button.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    handleDirectionInput(button.dataset.direction);
  });
}

pauseButton.addEventListener("click", () => {
  state = togglePause(state);
  render();
});

restartButton.addEventListener("click", () => {
  restartGame();
});

buildBoard();
render();

window.setInterval(() => {
  state = stepGame(state);
  render();
}, TICK_MS);
