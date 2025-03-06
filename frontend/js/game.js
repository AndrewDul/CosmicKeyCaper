import { Player } from "./player.js";
import { Enemy } from "./enemy.js";
import { Level1 } from "./level1.js";
import { Coin } from "./coin.js";
import { Key } from "./key.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const backgroundMusic = new Audio("/frontend/asset/sounds/Spacearray.ogg");
backgroundMusic.onerror = () =>
  console.error("❌ Błąd ładowania pliku dźwiękowego: Spacearray.ogg");

backgroundMusic.loop = true;
backgroundMusic.volume = 0.2;

const muteButton = document.getElementById("mute-button");
const muteIcon = document.createElement("img");
muteIcon.src = "/frontend/asset/images/mute/mute.png";
muteIcon.alt = "Mute";
muteButton.appendChild(muteIcon);

let isMuted = false;

muteButton.addEventListener("click", () => {
  isMuted = !isMuted;
  muteButton.classList.toggle("muted");

  backgroundMusic.muted = isMuted;
  player.shootSound.muted = isMuted;
  player.levelUpSound.muted = isMuted;

  if (!isMuted && backgroundMusic.paused) {
    backgroundMusic.play(); // 🔥 Jeśli muzyka była wstrzymana, uruchamiamy ją ponownie
  }
});

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = new Player(canvas, ctx);
const level1 = new Level1(canvas, ctx);
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

function spawnCoin() {
  setTimeout(() => {
    let groundLevel = canvas.height - 180; // 🔥 Poziom podłoża
    let coinX = Math.random() * (canvas.width - 50) + 25; // 🔥 Losowa pozycja X

    level1.coins.push(new Coin(canvas, ctx, player, coinX, groundLevel));
    spawnCoin();
  }, Math.random() * 5000 + 3000);
}

function spawnKey() {
  setTimeout(() => {
    if (player.keys < 3) {
      let groundLevel = canvas.height - 180; // 🔥 Teraz klucze będą na podłożu
      let keyX = Math.random() * (canvas.width - 50) + 25;

      level1.keys.push(new Key(canvas, ctx, player, keyX, groundLevel));
    }
  }, player.keys * 30000);
}

spawnCoin();
spawnKey();

// 🔥 Funkcja sprawdzająca kolizje
function checkCollisions() {
  // 🔥 Sprawdzenie kolizji gracza z wrogami
  level1.enemies.forEach((enemy, index) => {
    if (!enemy.isDying) {
      // 🎯 Kolizja gracza z wrogiem (strata HP)
      if (enemy.checkCollision(player)) {
        player.loseHealth(1.75);
        enemy.startDying();
      }

      // 🎯 Gracz skacze na wroga (EXP + śmierć wroga)
      if (player.checkTopCollision(enemy)) {
        player.addExp(22);
        enemy.startDying();
      }
    }
  });

  // 🎯 Sprawdzenie kolizji strzałów gracza z wrogami
  for (let i = player.lasers.length - 1; i >= 0; i--) {
    let laser = player.lasers[i];

    for (let j = level1.enemies.length - 1; j >= 0; j--) {
      let enemy = level1.enemies[j];

      if (
        !enemy.isDying &&
        laser.x < enemy.x + enemy.width &&
        laser.x + laser.width > enemy.x &&
        laser.y < enemy.y + enemy.height &&
        laser.y + laser.height > enemy.y
      ) {
        player.addExp(22);
        enemy.startDying();
        player.lasers.splice(i, 1); // Usuń pocisk po trafieniu
        break;
      }
    }
  }

  // 🎯 Sprawdzenie kolizji strzałów wroga z graczem
  for (let i = level1.enemies.length - 1; i >= 0; i--) {
    let enemy = level1.enemies[i];

    for (let j = enemy.lasers.length - 1; j >= 0; j--) {
      let laser = enemy.lasers[j];

      if (
        laser.x < player.x + player.width &&
        laser.x + laser.width > player.x &&
        laser.y < player.y + player.height &&
        laser.y + laser.height > player.y
      ) {
        player.loseHealth(5); // Strata HP od strzału wroga
        enemy.lasers.splice(j, 1); // Usuń pocisk po trafieniu
      }
    }
  }

  // 🔥 Sprawdzenie kolizji gracza z monetami
  for (let i = level1.coins.length - 1; i >= 0; i--) {
    let coin = level1.coins[i];

    if (
      player.x < coin.x + coin.width &&
      player.x + player.width > coin.x &&
      player.y < coin.y + coin.height &&
      player.y + player.height > coin.y
    ) {
      player.collectCoin(coin);
      level1.coins.splice(i, 1); // Usuń monetę po zebraniu
    }
  }

  // 🔥 Sprawdzenie kolizji gracza z kluczami
  for (let i = level1.keys.length - 1; i >= 0; i--) {
    let key = level1.keys[i];

    if (
      player.x < key.x + key.width &&
      player.x + player.width > key.x &&
      player.y < key.y + key.height &&
      player.y + player.height > key.y
    ) {
      player.collectKey(key);
      level1.keys.splice(i, 1); // Usuń klucz po zebraniu
    }
  }

  // 🔥 Usuwamy wrogów po zakończeniu animacji śmierci (15 klatek)
  level1.enemies = level1.enemies.filter((enemy) => !enemy.markForDeletion);
}

// 🎯 Sprawdzenie kolizji strzałów gracza z wrogami
for (let i = player.lasers.length - 1; i >= 0; i--) {
  let laser = player.lasers[i];

  for (let j = level1.enemies.length - 1; j >= 0; j--) {
    let enemy = level1.enemies[j];

    if (
      !enemy.isDying &&
      laser.x < enemy.x + enemy.width &&
      laser.x + laser.width > enemy.x &&
      laser.y < enemy.y + enemy.height &&
      laser.y + laser.height > enemy.y
    ) {
      player.addExp(22);
      enemy.startDying();
      player.lasers.splice(i, 1); // Usuń pocisk po trafieniu
      break;
    }
  }
}

// 🎯 Sprawdzenie kolizji strzałów wroga z graczem
for (let i = level1.enemies.length - 1; i >= 0; i--) {
  let enemy = level1.enemies[i];

  for (let j = enemy.lasers.length - 1; j >= 0; j--) {
    let laser = enemy.lasers[j];

    if (
      laser.x < player.x + player.width &&
      laser.x + laser.width > player.x &&
      laser.y < player.y + player.height &&
      laser.y + laser.height > player.y
    ) {
      player.loseHealth(5); // Strata HP od strzału wroga
      enemy.lasers.splice(j, 1); // Usuń pocisk po trafieniu
    }
  }
}

// 🔥 Usuwamy wrogów po zakończeniu animacji śmierci (15 klatek)
level1.enemies = level1.enemies.filter((enemy) => !enemy.markForDeletion);

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
