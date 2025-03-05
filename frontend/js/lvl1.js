class Level1 {
  constructor() {
    this.levelNumber = 1;

    // Paralaksa
    this.bgImage = new Image();
    this.bgImage.src = "/frontend/assets/images/parallax.png";

    // Klucze i monety
    this.keys = [
      new Item(200, 300, "/frontend/assets/images/key.png"),
      new Item(400, 200, "/frontend/assets/images/key.png"),
      new Item(600, 250, "/frontend/assets/images/key.png"),
    ];

    this.coins = [
      new Item(150, 350, "/frontend/assets/images/coin.png"),
      new Item(350, 400, "/frontend/assets/images/coin.png"),
      new Item(500, 450, "/frontend/assets/images/coin.png"),
    ];
  }

  update() {
    // Można dodać efekt paralaksy
  }

  render(ctx) {
    ctx.drawImage(this.bgImage, 0, 0, canvas.width, canvas.height);
    this.keys.forEach((key) => key.draw(ctx));
    this.coins.forEach((coin) => coin.draw(ctx));
  }
}
