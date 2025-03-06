export class Level1 {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.backgroundX = 0;
    this.speed = 2; // Szybkość przesuwania tła
    this.obstacles = [];
  }

  drawBackground() {
    this.ctx.fillStyle = "darkblue";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Rysowanie "ziemi"
    this.ctx.fillStyle = "green";
    this.ctx.fillRect(0, this.canvas.height - 50, this.canvas.width, 50);
  }

  drawObstacles() {
    this.ctx.fillStyle = "red";
    this.obstacles.forEach((obs) => {
      this.ctx.fillRect(obs.x - this.backgroundX, obs.y, obs.width, obs.height);
    });
  }

  update() {
    this.backgroundX += this.speed;
  }

  draw() {
    this.drawBackground();
    this.drawObstacles();
  }
}
