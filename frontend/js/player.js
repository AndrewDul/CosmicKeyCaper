class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.dy = 0;
    this.speed = 3;
    this.gravity = 0.5;
    this.jumpForce = -12;
    this.isJumping = false;
    this.isDucking = false;
  }

  // Update player position
  updatePlayer() {
    this.dy += this.gravity;
    this.y += this.dy;
    this.x += this.speed;
    if (this.y > canvas.height) this.y = 300;
  }

  // Draw the player
  drawPlayer(ctx) {
    ctx.fillStyle = this.isDucking ? "orange" : "green";
    ctx.fillRect(
      this.x,
      this.y,
      this.width,
      this.isDucking ? this.height / 2 : this.height
    );
  }

  // Check collision with platforms
  checkCollision(platform) {
    if (
      this.x + this.width > platform.x &&
      this.x < platform.x + platform.width &&
      this.y + this.height > platform.y &&
      this.y + this.height <= platform.y + platform.height + 5 &&
      this.dy > 0
    ) {
      this.y = platform.y - this.height;
      this.dy = 0;
      this.isJumping = false;
    }
  }
}
