class Item {
  constructor(x, y, imageSrc) {
    this.x = x;
    this.y = y;
    this.width = 30;
    this.height = 30;
    this.image = new Image();
    this.image.src = imageSrc;
  }

  draw(ctx) {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
