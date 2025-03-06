export class Level1 {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.backgroundX = 0;
    this.speed = 2; // Szybkość przesuwania tła
    this.obstacles = [];
    this.enemies = [];
    this.stars = this.generateStars(100); // 100 losowych gwiazd

    this.spawnEnemy();
  }

  // Generowanie losowych gwiazd na tle
  generateStars(count) {
    const stars = [];
    for (let i = 0; i < count; i++) {
      stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height - 100, // Nie rysujemy gwiazd na podłożu
        size: Math.random() * 3 + 1, // Rozmiar gwiazdy 1-4 px
        speed: Math.random() * 1.5 + 0.5, // Różna prędkość ruchu
      });
    }
    return stars;
  }

  // Rysowanie tła z gwiazdami
  drawBackground() {
    // 🌌 Czarny kosmos
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // ⭐ Rysowanie gwiazd
    this.ctx.fillStyle = "white";
    this.stars.forEach((star) => {
      this.ctx.beginPath();
      this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      this.ctx.fill();
    });

    // 🌑 Rysowanie powierzchni planety (szare podłoże)
    this.ctx.fillStyle = "#555"; // Szary kolor
    this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
  }

  // Ruch gwiazd (przesuwają się w prawo)
  updateStars() {
    this.stars.forEach((star) => {
      star.x += star.speed; // Gwiazdy przesuwają się w prawo
      if (star.x > this.canvas.width) {
        star.x = 0; // Reset pozycji na lewo
        star.y = Math.random() * (this.canvas.height - 100); // Nowa wysokość
      }
    });
  }

  drawObstacles() {
    this.ctx.fillStyle = "red";
    this.obstacles.forEach((obs) => {
      this.ctx.fillRect(obs.x - this.backgroundX, obs.y, obs.width, obs.height);
    });
  }

  drawEnemies() {
    this.ctx.fillStyle = "purple";
    this.enemies.forEach((enemy) => {
      this.ctx.fillRect(
        enemy.x - this.backgroundX,
        enemy.y,
        enemy.width,
        enemy.height
      );
    });
  }

  update() {
    this.backgroundX += this.speed;
    this.updateStars(); // Aktualizacja ruchu gwiazd

    this.enemies.forEach((enemy) => {
      enemy.x -= 1.5; // Powolne przesuwanie wrogów w lewo
    });

    // Usunięcie wrogów poza ekranem
    this.enemies = this.enemies.filter((enemy) => enemy.x > -50);
  }

  spawnEnemy() {
    setInterval(() => {
      this.enemies.push({
        x: this.canvas.width + Math.random() * 200,
        y: this.canvas.height - 80,
        width: 40,
        height: 40,
      });
    }, 3000); // Nowy wróg co 3 sekundy
  }

  draw() {
    this.drawBackground(); // ✅ Rysowanie tła z gwiazdami
    this.drawObstacles();
    this.drawEnemies();
  }
}
