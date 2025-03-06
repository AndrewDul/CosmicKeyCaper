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

console.log("Obiekt player:", player);
console.log("Metody player:", Object.keys(player));

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    if (typeof player.moveLeft === "function") {
      player.moveLeft();
    } else {
      console.error("Błąd: player.moveLeft() nie istnieje!");
    }
  }

  if (e.key === "ArrowRight") {
    if (typeof player.moveRight === "function") {
      player.moveRight();
    } else {
      console.error("Błąd: player.moveRight() nie istnieje!");
    }
  }

  if (e.key === " ") {
    if (typeof player.jump === "function") {
      player.jump();
    } else {
      console.error("Błąd: player.jump() nie istnieje!");
    }
  }
});

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  level1.update();
  level1.draw();

  enemyManager.update(player);
  enemyManager.draw();

  player.update();
  player.draw();

  requestAnimationFrame(gameLoop);
}

gameLoop();
