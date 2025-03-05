class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 50;
    this.speed = 5;
    this.image = new Image();
    this.image.src = "assets/images/astronaut.png";
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  move(direction) {
    if (direction === "left") this.x -= this.speed;
    if (direction === "right") this.x += this.speed;
    if (direction === "up") this.y -= this.speed;
    if (direction === "down") this.y += this.speed;
  }

  // update() {
  //   // Możesz dodać np. grawitację
  // }

  collidesWith(object) {
    return (
      this.x < object.x + object.width &&
      this.x + this.width > object.x &&
      this.y < object.y + object.height &&
      this.y + this.height > object.y
    );
  }
}
