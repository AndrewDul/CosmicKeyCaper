const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let player;
let currentLevel;
let keysCollected = 0;
let coinsCollected = 0;

// Funkcja do ładowania poziomu
function loadLevel(level) {
  if (level === 1) {
    currentLevel = new Level1();
  } else if (level === 2) {
    currentLevel = new Level2();
  }
  player = new Player(50, canvas.height - 100);
  keysCollected = 0; // Reset kluczy na nowy poziom
}

// Aktualizacja gry
function update() {
  player.update();
  currentLevel.update();

  // Sprawdzenie czy gracz zebrał klucz
  currentLevel.keys.forEach((key, index) => {
    if (player.collidesWith(key)) {
      keysCollected++;
      currentLevel.keys.splice(index, 1);
      console.log(`Zebrano klucz! (${keysCollected}/3)`);
    }
  });

  // Sprawdzenie czy gracz zebrał monetę
  currentLevel.coins.forEach((coin, index) => {
    if (player.collidesWith(coin)) {
      coinsCollected++;
      currentLevel.coins.splice(index, 1);
      console.log(`Zebrano monetę!`);
    }
  });

  // Przejście do następnego poziomu
  if (keysCollected >= 3) {
    console.log("Przechodzisz na kolejny poziom!");
    loadLevel(currentLevel.levelNumber + 1);
  }
}

// Renderowanie gry
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  currentLevel.render(ctx);
  player.draw(ctx);
}

// Pętla gry
function gameLoop() {
  update();
  render();
  requestAnimationFrame(gameLoop);
}

// Start gry
window.onload = () => {
  loadLevel(1);
  gameLoop();
};

// Obsługa klawiatury
window.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") player.move("left");
  if (event.key === "ArrowRight") player.move("right");
  if (event.key === "ArrowUp") player.move("up");
  if (event.key === "ArrowDown") player.move("down");
});
