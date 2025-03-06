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
        x: this.canvas.width + Math.random() * 200,
        y: this.canvas.height - 80,
        width: 40,
        height: 40,
        speed: 2 + Math.random() * 2,
      });
    }, 3000);
  }

  update(player) {
    this.enemies.forEach((enemy, index) => {
      enemy.x -= enemy.speed;

      // Sprawdzenie kolizji bocznej (tracimy życie)
      if (player.checkSideCollision(enemy)) {
        player.loseHealth();
        this.enemies.splice(index, 1); // Usunięcie wroga
      }

      // Sprawdzenie kolizji górnej (EXP)
      if (player.checkTopCollision(enemy)) {
        player.addExp(1.25); // +1.25% EXP
        this.enemies.splice(index, 1); // Wróg znika
      }
    });

    // Usunięcie wrogów poza ekranem
    this.enemies = this.enemies.filter((enemy) => enemy.x > -50);
  }

  draw() {
    this.ctx.fillStyle = "purple";
    this.enemies.forEach((enemy) => {
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
  }
}
