class Enemy {
  constructor(x, y, speed) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.speed = speed;
  }

  draw(ctx) {
    ctx.fillStyle = "red";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  update() {
    this.y += this.speed; // Przeciwnik porusza się w dół
  }
}
