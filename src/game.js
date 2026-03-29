export const DIRECTIONS = Object.freeze({
  UP: "UP",
  DOWN: "DOWN",
  LEFT: "LEFT",
  RIGHT: "RIGHT",
});

const DIRECTION_VECTORS = Object.freeze({
  [DIRECTIONS.UP]: { x: 0, y: -1 },
  [DIRECTIONS.DOWN]: { x: 0, y: 1 },
  [DIRECTIONS.LEFT]: { x: -1, y: 0 },
  [DIRECTIONS.RIGHT]: { x: 1, y: 0 },
});

const OPPOSITE_DIRECTIONS = Object.freeze({
  [DIRECTIONS.UP]: DIRECTIONS.DOWN,
  [DIRECTIONS.DOWN]: DIRECTIONS.UP,
  [DIRECTIONS.LEFT]: DIRECTIONS.RIGHT,
  [DIRECTIONS.RIGHT]: DIRECTIONS.LEFT,
});

const INPUT_TO_DIRECTION = Object.freeze({
  ArrowUp: DIRECTIONS.UP,
  ArrowDown: DIRECTIONS.DOWN,
  ArrowLeft: DIRECTIONS.LEFT,
  ArrowRight: DIRECTIONS.RIGHT,
  w: DIRECTIONS.UP,
  W: DIRECTIONS.UP,
  s: DIRECTIONS.DOWN,
  S: DIRECTIONS.DOWN,
  a: DIRECTIONS.LEFT,
  A: DIRECTIONS.LEFT,
  d: DIRECTIONS.RIGHT,
  D: DIRECTIONS.RIGHT,
});

export function normalizeDirection(input) {
  return INPUT_TO_DIRECTION[input] ?? null;
}

export function positionsEqual(first, second) {
  return first.x === second.x && first.y === second.y;
}

function toKey(position) {
  return `${position.x},${position.y}`;
}

function hitsBoundary(position, width, height) {
  return (
    position.x < 0 ||
    position.x >= width ||
    position.y < 0 ||
    position.y >= height
  );
}

function hitsSnake(position, snake, shouldIgnoreTail) {
  const bodyToCheck = shouldIgnoreTail ? snake.slice(0, -1) : snake;
  return bodyToCheck.some((segment) => positionsEqual(segment, position));
}

export function placeFood(width, height, snake, rng = Math.random) {
  const occupied = new Set(snake.map(toKey));
  const openCells = [];

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const cell = { x, y };

      if (!occupied.has(toKey(cell))) {
        openCells.push(cell);
      }
    }
  }

  if (openCells.length === 0) {
    return null;
  }

  const index = Math.min(
    openCells.length - 1,
    Math.floor((rng?.() ?? Math.random()) * openCells.length),
  );

  return openCells[index];
}

export function createInitialState(options = {}) {
  const width = options.width ?? 16;
  const height = options.height ?? 16;
  const middleRow = Math.floor(height / 2);
  const snake = [
    { x: 2, y: middleRow },
    { x: 1, y: middleRow },
    { x: 0, y: middleRow },
  ];
  const direction = DIRECTIONS.RIGHT;

  return {
    width,
    height,
    snake,
    direction,
    nextDirection: direction,
    food: placeFood(width, height, snake, options.rng),
    score: 0,
    status: "running",
  };
}

export function queueDirection(state, input) {
  const nextDirection = normalizeDirection(input);

  if (!nextDirection) {
    return state;
  }

  if (OPPOSITE_DIRECTIONS[state.direction] === nextDirection) {
    return state;
  }

  return {
    ...state,
    nextDirection,
  };
}

export function togglePause(state) {
  if (state.status === "running") {
    return {
      ...state,
      status: "paused",
    };
  }

  if (state.status === "paused") {
    return {
      ...state,
      status: "running",
    };
  }

  return state;
}

export function stepGame(state, rng = Math.random) {
  if (state.status !== "running") {
    return state;
  }

  const direction = state.nextDirection ?? state.direction;
  const vector = DIRECTION_VECTORS[direction];
  const nextHead = {
    x: state.snake[0].x + vector.x,
    y: state.snake[0].y + vector.y,
  };
  const willGrow = state.food ? positionsEqual(nextHead, state.food) : false;

  if (
    hitsBoundary(nextHead, state.width, state.height) ||
    hitsSnake(nextHead, state.snake, !willGrow)
  ) {
    return {
      ...state,
      direction,
      nextDirection: direction,
      status: "game-over",
    };
  }

  const snake = [nextHead, ...state.snake];

  if (!willGrow) {
    snake.pop();
  }

  const food = willGrow
    ? placeFood(state.width, state.height, snake, rng)
    : state.food;

  return {
    ...state,
    snake,
    direction,
    nextDirection: direction,
    food,
    score: state.score + (willGrow ? 1 : 0),
    status: food ? "running" : "won",
  };
}
