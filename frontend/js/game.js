import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { Level1 } from "./level1.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const level1 = new Level1(canvas, ctx);
const player = new Player(canvas, ctx);
player.level1 = level1; // 🔥 Powiązanie gracza z poziomem

// 🔥 Lista przeciwników
level1.enemies = [];
for (let i = 0; i < 3; i++) {
  level1.enemies.push(new Enemy(canvas, ctx, player));
}

// 🔥 Funkcja do losowego respawnu przeciwników
function spawnEnemy() {
  setTimeout(() => {
    level1.enemies.push(new Enemy(canvas, ctx, player));
    spawnEnemy();
  }, Math.random() * 3000 + 2000); // 🔥 Losowy czas (2-5 sekund)
}

spawnEnemy(); // 🔥 Rozpoczęcie losowego respawnu

// 🔥 Funkcja sprawdzająca kolizje
function checkCollisions() {
  level1.enemies.forEach((enemy, index) => {
    // 🔥 Kolizja wroga z graczem (strata HP)
    if (!enemy.isDying && enemy.checkCollision(player)) {
      player.loseHealth(1.75);
      enemy.isDying = true; // 🔥 Uruchom animację śmierci
      enemy.deathFrameIndex = 0; // 🔥 Reset indeksu animacji śmierci
      enemy.frameCount = 0;
    }

    // 🔥 Jeśli gracz skoczy na wroga (zysk EXP)
    if (!enemy.isDying && player.checkTopCollision(enemy)) {
      player.addExp(22);
      enemy.isDying = true; // 🔥 Uruchom animację śmierci
      enemy.deathFrameIndex = 0;
      enemy.frameCount = 0;
    }
  });

  // 🔥 Sprawdzenie kolizji strzałów gracza z przeciwnikami
  player.lasers.forEach((laser, laserIndex) => {
    level1.enemies.forEach((enemy, enemyIndex) => {
      if (
        !enemy.isDying &&
        laser.x < enemy.x + enemy.width &&
        laser.x + laser.width > enemy.x &&
        laser.y < enemy.y + enemy.height &&
        laser.y + laser.height > enemy.y
      ) {
        player.addExp(22);
        enemy.isDying = true; // 🔥 Uruchom animację śmierci
        enemy.deathFrameIndex = 0;
        enemy.frameCount = 0;

        // 🔥 Usuń pocisk po trafieniu
        player.lasers.splice(laserIndex, 1);
      }
    });
  });

  // 🔥 Usuwamy wrogów dopiero po zakończeniu animacji śmierci (15 klatek)
  level1.enemies = level1.enemies.filter(
    (enemy) => !(enemy.isDying && enemy.deathFrameIndex >= 15)
  );
}

function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  level1.update();
  level1.draw();

  // 🔥 Aktualizacja i rysowanie przeciwników
  level1.enemies.forEach((enemy) => {
    enemy.update();
    enemy.draw();
  });

  player.update();
  player.draw();

  // 🔥 Aktualizacja i rysowanie strzałów gracza
  ctx.fillStyle = "cyan";
  player.lasers.forEach((laser) => {
    laser.x += laser.velocityX;
    laser.y += laser.velocityY;
    ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
  });

  checkCollisions(); // 🔥 Sprawdzanie kolizji

  requestAnimationFrame(gameLoop);
}

gameLoop();
