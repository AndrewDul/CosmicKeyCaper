export class EnemyManager {
  constructor(canvas, ctx, level) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.level = level;
    this.enemies = [];
    this.spawnEnemy();
  }

  // Tworzenie nowych wrogów co 3 sekundy
  spawnEnemy() {
    setInterval(() => {
      this.enemies.push({
        x: this.canvas.width + Math.random() * 200, // Wrogowie pojawiają się poza ekranem
        y: this.canvas.height - 80,
        width: 40,
        height: 40,
        speed: 2 + Math.random() * 2, // Losowa prędkość wrogów
      });
    }, 3000);
  }

  update(player) {
    this.enemies.forEach((enemy, index) => {
      enemy.x -= enemy.speed; // Przesuwanie wrogów w lewo

      // Sprawdzanie kolizji bocznej (utrata HP)
      if (typeof player.checkSideCollision === "function") {
        if (player.checkSideCollision(enemy)) {
          player.loseHealth();
          this.enemies.splice(index, 1); // Usunięcie wroga po kolizji
        }
      } else {
        console.error("Błąd: player.checkSideCollision() nie istnieje!");
      }

      // Sprawdzanie kolizji górnej (gracz skacze na wroga)
      if (typeof player.checkTopCollision === "function") {
        if (player.checkTopCollision(enemy)) {
          player.addExp(1.25);
          this.enemies.splice(index, 1); // Usunięcie wroga po zdobyciu EXP
        }
      } else {
        console.error("Błąd: player.checkTopCollision() nie istnieje!");
      }
    });

    // Usunięcie wrogów, którzy wyszli poza ekran
    this.enemies = this.enemies.filter((enemy) => enemy.x > -50);
  }

  draw() {
    this.ctx.fillStyle = "purple";
    this.enemies.forEach((enemy) => {
      this.ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
  }
}
