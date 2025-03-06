import { Level1 } from "./level1.js";
import { Player } from "./player.js";
import { EnemyManager } from "./enemy.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const level1 = new Level1(canvas, ctx);
const player = new Player(canvas, ctx);
const enemyManager = new EnemyManager(canvas, ctx, level1);

// Obsługa klawiszy
window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") player.moveLeft();
  if (e.key === "ArrowRight") player.moveRight();
  if (e.key === " ") player.jump(); // Skok po spacji
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  level1.update();
  level1.draw();

  enemyManager.update();
  enemyManager.draw();

  player.update();
  player.draw();

  requestAnimationFrame(gameLoop);
}

gameLoop();
