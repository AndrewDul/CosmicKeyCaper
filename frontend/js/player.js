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

  update() {
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    // Zatrzymanie spadania na ziemi
    if (this.y >= this.canvas.height - 80) {
      this.y = this.canvas.height - 80;
      this.isJumping = false;
    }
  }
}
