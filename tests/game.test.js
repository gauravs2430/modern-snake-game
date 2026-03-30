import test from "node:test";
import assert from "node:assert/strict";

import {
  DIRECTIONS,
  createInitialState,
  placeFood,
  queueDirection,
  startGame,
  stepGame,
} from "../src/game.js";

test("createInitialState creates a centered starter snake", () => {
  const state = createInitialState({ width: 12, height: 10, rng: () => 0 });

  assert.equal(state.width, 12);
  assert.equal(state.height, 10);
  assert.deepEqual(state.snake, [
    { x: 2, y: 5 },
    { x: 1, y: 5 },
    { x: 0, y: 5 },
  ]);
  assert.equal(state.direction, DIRECTIONS.RIGHT);
  assert.equal(state.score, 0);
  assert.equal(state.status, "ready");
});

test("startGame transitions a ready round into running and accepts a first move", () => {
  const started = startGame(
    createInitialState({ width: 12, height: 10, rng: () => 0 }),
    "ArrowUp",
  );

  assert.equal(started.status, "running");
  assert.equal(started.nextDirection, DIRECTIONS.UP);
});

test("stepGame does not advance while the round is still ready", () => {
  const readyState = createInitialState({ width: 12, height: 10, rng: () => 0 });
  const nextState = stepGame(readyState);

  assert.deepEqual(nextState, readyState);
});

test("queueDirection ignores immediate reverse turns", () => {
  const next = queueDirection(
    {
      width: 8,
      height: 8,
      snake: [
        { x: 2, y: 4 },
        { x: 1, y: 4 },
      ],
      direction: DIRECTIONS.RIGHT,
      nextDirection: DIRECTIONS.RIGHT,
      food: { x: 7, y: 7 },
      score: 0,
      status: "running",
    },
    "ArrowLeft",
  );

  assert.equal(next.nextDirection, DIRECTIONS.RIGHT);
});

test("stepGame advances the snake in the queued direction", () => {
  const state = stepGame({
    width: 8,
    height: 8,
    snake: [
      { x: 3, y: 4 },
      { x: 2, y: 4 },
      { x: 1, y: 4 },
    ],
    direction: DIRECTIONS.RIGHT,
    nextDirection: DIRECTIONS.UP,
    food: { x: 7, y: 7 },
    score: 0,
    status: "running",
  });

  assert.deepEqual(state.snake, [
    { x: 3, y: 3 },
    { x: 3, y: 4 },
    { x: 2, y: 4 },
  ]);
  assert.equal(state.direction, DIRECTIONS.UP);
});

test("stepGame grows the snake and increments score when food is eaten", () => {
  const state = stepGame(
    {
      width: 5,
      height: 5,
      snake: [
        { x: 2, y: 2 },
        { x: 1, y: 2 },
      ],
      direction: DIRECTIONS.RIGHT,
      nextDirection: DIRECTIONS.RIGHT,
      food: { x: 3, y: 2 },
      score: 0,
      status: "running",
    },
    () => 0,
  );

  assert.equal(state.score, 1);
  assert.equal(state.snake.length, 3);
  assert.deepEqual(state.snake[0], { x: 3, y: 2 });
  assert.notDeepEqual(state.food, { x: 3, y: 2 });
});

test("stepGame ends the game when the snake hits a wall", () => {
  const state = stepGame({
    width: 4,
    height: 4,
    snake: [
      { x: 3, y: 1 },
      { x: 2, y: 1 },
      { x: 1, y: 1 },
    ],
    direction: DIRECTIONS.RIGHT,
    nextDirection: DIRECTIONS.RIGHT,
    food: { x: 0, y: 0 },
    score: 0,
    status: "running",
  });

  assert.equal(state.status, "game-over");
});

test("stepGame ends the game when the snake hits its body", () => {
  const state = stepGame({
    width: 6,
    height: 6,
    snake: [
      { x: 3, y: 2 },
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 2, y: 2 },
    ],
    direction: DIRECTIONS.LEFT,
    nextDirection: DIRECTIONS.DOWN,
    food: { x: 0, y: 0 },
    score: 0,
    status: "running",
  });

  assert.equal(state.status, "game-over");
});

test("placeFood always returns an open cell", () => {
  const food = placeFood(
    3,
    3,
    [
      { x: 0, y: 0 },
      { x: 1, y: 0 },
      { x: 2, y: 0 },
      { x: 0, y: 1 },
      { x: 1, y: 1 },
      { x: 2, y: 1 },
      { x: 0, y: 2 },
      { x: 1, y: 2 },
    ],
    () => 0.999,
  );

  assert.deepEqual(food, { x: 2, y: 2 });
});
