// Game state variable
let gameState = "menu"; // Possible values: 'menu', 'playing', 'end'

// Access the canvas element
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game variables
let player,
  platforms,
  coins,
  keys,
  meteors,
  level = 1,
  score = 0;

// Initialize the game
function initGame() {
  canvas.width = window.innerWidth * 0.9;
  canvas.height = window.innerHeight * 0.6;
  player = new Player(50, 300); // Player class is now defined
  platforms = [new Platform(0, 350, 200, 50), new Platform(300, 350, 200, 50)];
  coins = [new Coin(150, 320)];
  keys = [new Key(450, 320)];
  meteors = [new Meteor(400, 200)];
  setupInputs();
}

// Update game state
function updateGame() {
  player.updatePlayer();
  updateObjects();

  // Handle collisions
  platforms.forEach((p) => player.checkCollision(p));
  coins = coins.filter((c) => !c.collect(player) || ((score += 10), false));
  keys = keys.filter((k) => !k.collect(player) || (levelUp(), false));
  meteors.forEach(
    (m) => m.update() || (m.checkCollision(player) && resetPlayer())
  );
}

// Draw game objects
function drawGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground(); // Parallax background
  platforms.forEach((p) => p.draw(ctx));
  coins.forEach((c) => c.draw(ctx));
  keys.forEach((k) => k.draw(ctx));
  meteors.forEach((m) => m.draw(ctx));
  player.drawPlayer(ctx);
  ctx.fillStyle = "white";
  ctx.fillText(`Score: ${score} | Level: ${level}`, 10, 20);
}

// Main game loop
function gameLoop() {
  if (gameState === "menu") drawMenu();
  else if (gameState === "playing") {
    updateGame();
    drawGame();
  }
  requestAnimationFrame(gameLoop);
}

// Level up logic
function levelUp() {
  level++;
  saveLevelProgress(level);
  platforms = [new Platform(0, 350, 150, 50), new Platform(250, 300, 100, 50)];
  coins = [new Coin(200, 270)];
  keys = [new Key(400, 270)];
  meteors = [new Meteor(300, 200, -3)];
  player.x = 50;
}

// Start the game
initGame();
gameLoop();
