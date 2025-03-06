const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const level1 = new Level1(canvas, ctx);

class Player {
  constructor() {
    this.x = 50;
    this.y = canvas.height - 80;
    this.width = 30;
    this.height = 30;
    this.speed = 5;
  }

  draw() {
    ctx.fillStyle = "yellow";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  moveLeft() {
    this.x -= this.speed;
  }

  moveRight() {
    this.x += this.speed;
  }
}

const player = new Player();

// Obsługa klawiszy
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") player.moveLeft();
  if (e.key === "ArrowRight") player.moveRight();
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  level1.update();
  level1.draw();
  player.draw();

  requestAnimationFrame(gameLoop);
}

gameLoop();
