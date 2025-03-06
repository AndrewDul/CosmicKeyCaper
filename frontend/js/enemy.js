export class EnemyManager {
  constructor(canvas, ctx, level) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.level = level;
    this.enemies = [];

    this.spawnEnemy();
  }

  spawnEnemy() {
    setInterval(() => {
      this.enemies.push({
        x: this.canvas.width + Math.random() * 200, // Wrogowie pojawiają się poza ekranem
        y: this.canvas.height - 80,
        width: 40,
        height: 40,
        speed: 2 + Math.random() * 2, // Losowa prędkość wroga
      });
    }, 3000); // Nowy wróg co 3 sekundy
  }

  update() {
    this.enemies.forEach((enemy) => {
      enemy.x -= enemy.speed;
    });

    // Usunięcie wrogów spoza ekranu
    this.enemies = this.enemies.filter((enemy) => enemy.x > -50);
  }

  draw() {
    this.ctx.fillStyle = "purple";
    this.enemies.forEach((enemy) => {
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
  }
}
