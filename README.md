# Modern Snake

I built this project as a small, dependency-free browser version of the classic Snake game. The goal was to keep the gameplay loop familiar and focused while still making the code clean enough to test, explain, and extend later.

## What this project is

This is a modern presentation of the classic Snake formula:

- The snake moves on a fixed grid.
- Food spawns in open cells only.
- Eating food grows the snake and increases the score.
- Hitting a wall or your own body ends the run.
- Each round starts in a ready state, so the snake does not move until you begin.
- You can pause and restart at any time.

I intentionally kept the project lightweight. There are no external libraries or frameworks here. The game runs with plain HTML, CSS, and JavaScript, and the core logic is separated from the DOM so the rules are easy to test.

## How I structured it

- `index.html`
  The page layout, board container, buttons, and help panels.
- `styles.css`
  The visual treatment for the board, layout, controls, and responsive UI.
- `src/game.js`
  The pure game logic: movement, turning, food placement, collisions, growth, pause handling, and restart state.
- `src/main.js`
  The browser controller that renders the board, listens for keyboard and touch input, and advances the game on a timer.
- `tests/game.test.js`
  Core logic tests for movement, growth, collisions, and food placement.

## How to run it

1. Open a terminal in this project folder.
2. Start the local server:

```bash
npm run dev
```

3. Open your browser at `http://127.0.0.1:4173`.

## How to play

- Use the arrow keys or `W`, `A`, `S`, `D` to move.
- The game starts when you press `Start` or your first direction key.
- On touch devices, use the on-screen direction buttons.
- Eat the food to grow and increase your score.
- Avoid the walls and your own body.
- Press `Space` to pause or resume.
- Press `R` or `Enter`, or click the restart button, to start over.

## Features currently included

- Classic grid-based snake movement
- Deterministic game logic separated from the UI
- Food spawning only in valid, unoccupied cells
- Score tracking
- Best score tracking in local storage
- Snake length tracking in the HUD
- Game-over and board-cleared states
- Ready-state start screen so the round does not auto-crash on load
- Pause and restart controls
- Keyboard and on-screen controls
- Responsive single-page layout
- Basic automated tests for the game rules

## Testing

Run the test suite with:

```bash
npm test
```

The tests cover:

- Initial state creation
- Preventing immediate reverse turns
- Movement updates
- Snake growth after eating
- Wall collisions
- Self-collisions
- Valid food placement

## If I were continuing this project

The next improvements I would consider are:

- Start screen and best score tracking
- Difficulty levels or increasing speed over time
- Wrap-around mode as an optional ruleset
- Sound effects and mute control
- Mobile swipe input
- Obstacles or special food types
- Local multiplayer or turn-based challenge modes
- Theme selection and accessibility options

## Why I like this version

From a builder's perspective, this version is a good base because it is small, understandable, and easy to extend. The game already feels complete enough to play, but the structure leaves plenty of room for adding modes, polish, and progression later without rewriting the core rules.
