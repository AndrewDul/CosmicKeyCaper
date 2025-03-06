export class Player {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = 50;
    this.y = canvas.height - 180;
    this.width = 63;
    this.height = 150;
    this.speed = 5;
    this.velocityX = 0; // 🔥 Ruch poziomy
    this.velocityY = 0;
    this.gravity = 0.5;
    this.isJumping = false;
    this.facingLeft = false;

    this.health = 3;
    this.exp = 0;
    this.level = 1;

    this.walkFrames = [];
    this.jumpFrames = [];
    this.currentFrame = 0;
    this.frameCount = 0;

    this.keys = {}; // 🔥 Rejestrowanie klawiszy

    this.loadImages();
    this.setupKeyboardListeners();
  }

  loadImages() {
    for (let i = 1; i <= 6; i++) {
      const img = new Image();
      img.src = `/frontend/asset/images/player/walk/${i}.png`;
      img.onerror = () => console.error(`Nie znaleziono obrazka: ${img.src}`);
      this.walkFrames.push(img);
    }

    for (let i = 1; i <= 4; i++) {
      const img = new Image();
      img.src = `/frontend/asset/images/player/jump/${i}.png`;
      img.onerror = () => console.error(`Nie znaleziono obrazka: ${img.src}`);
      this.jumpFrames.push(img);
    }
  }

  setupKeyboardListeners() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;

      if (e.key === "ArrowLeft") this.facingLeft = true;
      if (e.key === "ArrowRight") this.facingLeft = false;

      if (e.key === " " && !this.isJumping) this.jump();
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });
  }

  moveLeft() {
    this.velocityX = -this.speed;
    this.facingLeft = true;
    this.animateWalk();
  }

  moveRight() {
    this.velocityX = this.speed;
    this.facingLeft = false;
    this.animateWalk();
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = -12;
      this.isJumping = true;

      // 🔥 Dodaj poziomy ruch do skoku
      if (this.keys["ArrowLeft"]) this.velocityX = -this.speed * 1.5;
      if (this.keys["ArrowRight"]) this.velocityX = this.speed * 1.5;

      this.currentFrame = 0;
    }
  }

  update() {
    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    // 🔥 Hamowanie poziomego ruchu po skoku
    this.velocityX *= 0.9;

    // 🔥 Zatrzymanie na ziemi
    const groundLevel = this.canvas.height - 180;
    if (this.y >= groundLevel) {
      this.y = groundLevel;
      this.isJumping = false;
      this.velocityY = 0;
    }

    if (!this.isJumping) {
      if (this.keys["ArrowLeft"]) this.moveLeft();
      if (this.keys["ArrowRight"]) this.moveRight();
    }

    if (this.isJumping) {
      this.animateJump();
    }
  }

  draw() {
    if (this.walkFrames.length === 0 || this.jumpFrames.length === 0) return;

    let frame;
    if (this.isJumping) {
      frame = this.jumpFrames[this.currentFrame];
    } else {
      frame = this.walkFrames[this.currentFrame];
    }

    const flip = this.facingLeft ? -1 : 1;

    this.ctx.save();
    this.ctx.translate(this.x + this.width / 2, this.y);
    this.ctx.scale(flip, 1);
    this.ctx.drawImage(frame, -this.width / 2, 0, this.width, this.height);
    this.ctx.restore();
  }

  animateWalk() {
    this.frameCount++;
    if (this.frameCount % 5 === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.walkFrames.length;
    }
  }

  animateJump() {
    this.frameCount++;
    if (this.frameCount % 7 === 0) {
      this.currentFrame = (this.currentFrame + 1) % this.jumpFrames.length;
    }
  }

  addExp(amount) {
    this.exp += amount;
    if (this.exp >= 100) {
      this.levelUp();
    }
    this.updateHUD();
  }

  levelUp() {
    this.level += 1;
    this.exp = 0;
    console.log(`Level UP! Teraz masz poziom ${this.level}`);
    this.updateHUD();
  }

  loseHealth() {
    this.health -= 1;
    console.log(`Utrata życia! HP: ${this.health}`);
    if (this.health <= 0) {
      console.log("Game Over!");
      this.health = 3;
    }
    this.updateHUD();
  }

  updateHUD() {
    const hpEl = document.getElementById("hp");
    const expEl = document.getElementById("exp");
    const levelEl = document.getElementById("level");

    if (hpEl && expEl && levelEl) {
      hpEl.textContent = this.health;
      expEl.textContent = this.exp.toFixed(2) + "%";
      levelEl.textContent = this.level;
    } else {
      console.error("HUD elements not found in the DOM!");
    }
  }

  checkSideCollision(enemy) {
    return (
      this.x + this.width > enemy.x &&
      this.x < enemy.x + enemy.width &&
      this.y + this.height > enemy.y
    );
  }

  checkTopCollision(enemy) {
    return (
      this.x + this.width > enemy.x &&
      this.x < enemy.x + enemy.width &&
      this.y + this.height > enemy.y - 5 &&
      this.y + this.height < enemy.y + enemy.height / 2
    );
  }
}
