export class Key {
  constructor(canvas, ctx, x, y) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.width = 40;
    this.height = 40;

    // ✅ 🔥 Ustawianie pozycji klucza
    this.x = x !== undefined ? x : Math.random() * (canvas.width - this.width);
    this.y = canvas.height - 180; // 🔥 Klucze zawsze na ziemi, tak jak monety

    this.image = new Image();
    this.image.src = `/frontend/asset/images/key/key.png`;
    this.image.onerror = () =>
      console.error(`❌ Nie znaleziono obrazka: ${this.image.src}`);
  }

  draw() {
    if (!this.image.complete || this.image.naturalWidth === 0) {
      console.warn("⚠️ Obraz klucza nie został wczytany!");
      return;
    }
    this.ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  checkCollision(player) {
    return (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    );
  }

  collect(player) {
    console.log("🔑 Zebrano klucz!");
    player.collectKey();
  }
}
