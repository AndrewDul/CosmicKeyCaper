export class Level1 {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.backgroundX = 0;
    this.speed = 2;
    this.enemies = []; // 🔥 Lista przeciwników
    this.stars = []; // 🔥 Gwiazdy w tle
    this.numStars = 100; // Ilość gwiazd

    this.generateStars();
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
    this.enemies.forEach((enemy) => enemy.draw());
  }
}
