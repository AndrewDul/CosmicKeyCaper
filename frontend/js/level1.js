class Level1 {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.backgroundX = 0;
    this.speed = 2; // Szybkość przesuwania tła
  }

  drawBackground() {
    this.ctx.fillStyle = "gray";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Rysowanie "ziemi"
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
  }

  drawObstacles() {
    this.ctx.fillStyle = "red";
    this.ctx.fillRect(300 - this.backgroundX, this.canvas.height - 80, 50, 30);
    this.ctx.fillRect(600 - this.backgroundX, this.canvas.height - 80, 50, 30);
  }

  update() {
    this.backgroundX += this.speed;
  }

  draw() {
    this.drawBackground();
    this.drawObstacles();
  }
}
