import { Coin } from "./coin.js";
import { Key } from "./key.js";

export class Level1 {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.backgroundX = 0;
    this.speed = 2;
    this.enemies = []; // 🔥 Lista przeciwników
    this.stars = []; // 🔥 Gwiazdy w tle
    this.numStars = 100; // Ilość gwiazd
    this.coins = [];
    this.keys = [];
    this.spawnCoins();
    this.spawnKeys();

    this.generateStars();
  }
  spawnCoins() {
    setInterval(() => {
      let x = Math.random() * (this.canvas.width - 100) + 50;
      let y = Math.random() * (this.canvas.height - 150) + 50;
      this.coins.push(new Coin(this.canvas, this.ctx, x, y));
    }, 5000); // 🎲 Nowa moneta co 5 sekund
  }

  spawnKeys() {
    setTimeout(() => {
      let x = Math.random() * (this.canvas.width - 100) + 50;
      let y = Math.random() * (this.canvas.height - 150) + 50; // 🔥 Losowa wysokość jak w coinach
      this.keys.push(new Key(this.canvas, this.ctx, x, y));
    }, 10000); // 30s

    setTimeout(() => {
      let x = Math.random() * (this.canvas.width - 100) + 50;
      let y = Math.random() * (this.canvas.height - 150) + 50;
      this.keys.push(new Key(this.canvas, this.ctx, x, y));
    }, 60000); // 1 min

    setTimeout(() => {
      let x = Math.random() * (this.canvas.width - 100) + 50;
      let y = Math.random() * (this.canvas.height - 150) + 50;
      this.keys.push(new Key(this.canvas, this.ctx, x, y));
    }, 90000); // 1:30 min
  }

  generateStars() {
    for (let i = 0; i < this.numStars; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 2 + 1,
        speed: Math.random() * 2 + 1,
      });
    }
  }

  update() {
    this.backgroundX += this.speed;

    // 🔥 Aktualizacja gwiazd (ruch w lewo)
    this.stars.forEach((star) => {
      star.x -= star.speed;
      if (star.x < 0) {
        star.x = this.canvas.width;
        star.y = Math.random() * this.canvas.height;
      }
    });

    // 🔥 Aktualizacja przeciwników
    this.enemies.forEach((enemy) => enemy.update());
    this.coins.forEach((coin) => coin.update());
  }

  drawBackground() {
    // 🔥 Czarne tło imitujące kosmos
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // 🔥 Gwiazdy w tle
    this.ctx.fillStyle = "white";
    this.stars.forEach((star) => {
      this.ctx.fillRect(star.x, star.y, star.size, star.size);
    });
  }

  drawGround() {
    // 🔥 Szare podłoże (imitacja powierzchni planety)
    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
  }

  draw() {
    this.drawBackground();
    this.drawGround();

    // 🔥 Rysowanie przeciwników
    this.coins.forEach((coin) => coin.draw());
    this.keys.forEach((key) => key.draw());
    this.enemies.forEach((enemy) => enemy.draw());
  }
}
