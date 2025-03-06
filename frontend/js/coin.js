export class Coin {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.width = 40;
    this.height = 40;

    // 🔥 Ustawianie pozycji monety na podłożu
    this.x = Math.random() * (canvas.width - this.width);
    this.y = canvas.height - 180; // Monety zawsze na ziemi

    this.frames = [];
    this.currentFrame = 0;
    this.frameCount = 0;
    this.loadImages();

    // 🎵 Dźwięk zbierania monety
    this.coinSound = new Audio("/frontend/asset/sounds/coin.wav");
    this.coinSound.volume = 0.2; // 🔊 Przyciszony dźwięk
  }

  loadImages() {
    for (let i = 1; i <= 8; i++) {
      const img = new Image();
      img.src = `/frontend/asset/images/Coins/${i}.png`; // 🔥 Poprawiona ścieżka
      img.onerror = () => console.error(`Nie znaleziono obrazka: ${img.src}`);
      this.frames.push(img);
    }
  }

  update() {
    this.frameCount++;
    if (this.frameCount % 6 === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.frames.length;
    }
  }

  draw() {
    if (!this.frames.length) return;
    this.ctx.drawImage(
      this.frames[this.currentFrame],
      this.x,
      this.y,
      this.width,
      this.height
    );
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
    this.coinSound.currentTime = 0; // Resetuj dźwięk przed odtworzeniem
    this.coinSound
      .play()
      .catch((error) =>
        console.error("Błąd odtwarzania dźwięku monety:", error)
      );

    player.collectCoin(this); // 🔥 Przekazujemy monetę do gracza
  }
}
