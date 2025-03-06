export class Player {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = 50;
    this.y = canvas.height - 80;
    this.width = 30;
    this.height = 30;
    this.speed = 5;
    this.velocityY = 0;
    this.gravity = 0.5;
    this.isJumping = false;

    this.health = 3;
    this.exp = 0;
    this.level = 1;

    this.updateHUD();
  }

  updateHUD() {
    document.getElementById("hp").textContent = this.health;
    document.getElementById("exp").textContent = this.exp.toFixed(2) + "%";
    document.getElementById("level").textContent = this.level;
  }

  addExp(amount) {
    this.exp += amount;
    if (this.exp >= 100) {
      this.levelUp();
    }
    this.updateHUD();
  }

  levelUp() {
    this.level += 1;
    this.exp = 0;
    console.log(`Level UP! Teraz masz poziom ${this.level}`);
    this.updateHUD();
  }

  loseHealth() {
    this.health -= 1;
    console.log(`Utrata życia! HP: ${this.health}`);
    if (this.health <= 0) {
      console.log("Game Over!");
      this.health = 3;
    }
    this.updateHUD();
  }

  update() {
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    if (this.y >= this.canvas.height - 80) {
      this.y = this.canvas.height - 80;
      this.isJumping = false;
    }
  }

  draw() {
    this.ctx.fillStyle = "yellow";
    this.ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  moveLeft() {
    this.x -= this.speed;
    if (this.x < 0) this.x = 0;
  }

  moveRight() {
    this.x += this.speed;
    if (this.x + this.width > this.canvas.width) {
      this.x = this.canvas.width - this.width;
    }
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = -10;
      this.isJumping = true;
    }
  }

  // ✅ Dodajemy sprawdzanie kolizji bocznej
  checkSideCollision(enemy) {
    return (
      this.x + this.width > enemy.x && // Prawa strona gracza dotyka wroga
      this.x < enemy.x + enemy.width && // Lewa strona gracza dotyka wroga
      this.y + this.height > enemy.y + 10 // Gracz nie dotyka górnej części
    );
  }

  // ✅ Dodajemy sprawdzanie kolizji górnej (gracz skacze na wroga)
  checkTopCollision(enemy) {
    return (
      this.x + this.width > enemy.x &&
      this.x < enemy.x + enemy.width &&
      this.y + this.height > enemy.y - 5 &&
      this.y + this.height < enemy.y + enemy.height / 2
    );
  }
}
