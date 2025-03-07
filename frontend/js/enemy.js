export class Enemy {
  constructor(canvas, ctx, player) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.player = player;
    this.x = Math.random() * (canvas.width - 200) + 100;
    this.y = Math.random() * (canvas.height / 2);
    this.width = 130;
    this.height = 130;
    this.speed = 1.5;
    this.direction = Math.random() < 0.5 ? 1 : -1;

    this.lasers = [];
    this.shootInterval = 2000;
    this.isAttacking = false;
    this.isDying = false;
    this.markForDeletion = false;

    this.deathFrames = [];
    this.deathFrameIndex = 0;
    this.walkFrames = [];
    this.attackFrames = [];
    this.currentFrame = 0;
    this.frameCount = 0;

    this.loadImages();
    this.loadAttackImages();
    this.loadDeathImages();
    this.startShooting();
  }

  loadImages() {
    for (let i = 0; i <= 11; i++) {
      const img = new Image();
      img.src = `frontend/asset/images/enemy/walk/${i}.png`;
      img.onload = () => console.log(`Załadowano: ${img.src}`);
      img.onerror = () => console.error(`❌ Błąd ładowania: ${img.src}`);
      this.walkFrames.push(img);
    }
  }

  loadAttackImages() {
    for (let i = 0; i <= 11; i++) {
      const img = new Image();
      img.src = `frontend/asset/images/enemy/attack/${i}.png`;
      img.onload = () => console.log(`✅ Załadowano atak: ${img.src}`);
      img.onerror = () => console.error(`❌ Błąd ładowania: ${img.src}`);
      this.attackFrames.push(img);
    }
  }

  loadDeathImages() {
    for (let i = 1; i <= 15; i++) {
      const img = new Image();
      img.src = `frontend/asset/images/enemy/dying/${i}.png`;
      img.onload = () => console.log(`Załadowano śmierć: ${img.src}`);
      img.onerror = () => console.warn(`❌ Błąd ładowania śmierci: ${img.src}`);
      this.deathFrames.push(img);
    }
  }

  startShooting() {
    setInterval(() => {
      if (!this.isDying && !this.markForDeletion) this.shoot();
    }, this.shootInterval);
  }

  shoot() {
    if (this.isAttacking) return;
    this.isAttacking = true;
    this.currentFrame = 0;

    setTimeout(() => {
      this.isAttacking = false;
    }, 500);

    const dx = this.player.x - this.x;
    const dy = this.player.y - this.y;
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    const speed = 5;

    if (magnitude === 0) return;

    const velocityX = (dx / magnitude) * speed;
    const velocityY = (dy / magnitude) * speed;

    this.lasers.push({
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      width: 12,
      height: 30,
      velocityX,
      velocityY,
    });
  }

  update() {
    if (this.isDying) {
      this.frameCount++;
      if (this.frameCount % 8 === 0) {
        this.deathFrameIndex++;
        if (this.deathFrameIndex >= this.deathFrames.length) {
          this.markForDeletion = true;
        }
      }
      return;
    }

    // 🔥 Wróg podąża za graczem
    const dx = this.player.x - this.x;
    const dy = this.player.y - this.y;
    const magnitude = Math.sqrt(dx * dx + dy * dy);

    if (magnitude > 50) {
      this.x += (dx / magnitude) * this.speed;
      this.y += (dy / magnitude) * this.speed;
    }

    // 🔥 Aktualizacja strzałów
    this.lasers.forEach((laser, index) => {
      laser.x += laser.velocityX;
      laser.y += laser.velocityY;

      if (
        laser.x < 0 ||
        laser.x > this.canvas.width ||
        laser.y < 0 ||
        laser.y > this.canvas.height
      ) {
        this.lasers.splice(index, 1);
      }
    });

    this.animate();
  }

  animate() {
    if (this.isAttacking) {
      this.currentFrame = (this.currentFrame + 1) % this.attackFrames.length;
    } else if (!this.isDying) {
      this.currentFrame = (this.currentFrame + 1) % this.walkFrames.length;
    }
  }

  draw() {
    let frame;

    if (this.isDying) {
      frame =
        this.deathFrames[
          Math.min(this.deathFrameIndex, this.deathFrames.length - 1)
        ];
    } else if (this.isAttacking) {
      frame = this.attackFrames[this.currentFrame];
    } else {
      frame = this.walkFrames[this.currentFrame];
    }

    if (!frame || !frame.complete || frame.naturalWidth === 0) {
      console.warn("❌ Obraz nie został wczytany lub jest niepoprawny.");
      return;
    }

    this.ctx.save();
    this.ctx.translate(this.x + this.width / 2, this.y);
    this.ctx.scale(this.x > this.player.x ? -1 : 1, 1);
    this.ctx.drawImage(frame, -this.width / 2, 0, this.width, this.height);
    this.ctx.restore();

    this.ctx.fillStyle = "yellow";
    this.lasers.forEach((laser) => {
      this.ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    });
  }

  startDying() {
    this.isDying = true;
    this.deathFrameIndex = 0;
    this.frameCount = 0;
  }

  checkCollision(player) {
    return (
      this.x + this.width > player.x &&
      this.x < player.x + player.width &&
      this.y + this.height > player.y &&
      this.y < player.y + player.height
    );
  }

  removeEnemy() {
    const index = this.player.level1.enemies.indexOf(this);
    if (index > -1) {
      this.player.level1.enemies.splice(index, 1);
    }
  }
}
