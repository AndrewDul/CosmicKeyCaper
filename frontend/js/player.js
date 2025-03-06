export class Player {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.x = 50;
    this.y = canvas.height - 180;
    this.width = 90;
    this.height = 150;
    this.speed = 5;
    this.velocityX = 0;
    this.velocityY = 0;
    this.gravity = 0.5;
    this.isJumping = false;
    this.facingLeft = false;
    this.isAttacking = false;

    this.health = 100;
    this.exp = 0;
    this.level = 1;

    this.walkFrames = [];
    this.jumpFrames = [];
    this.attackFrames = [];
    this.currentFrame = 0;
    this.frameCount = 0;

    this.lasers = []; // 🔥 Lista strzałów gracza
    this.shootCooldown = false; // 🔥 Ograniczenie tempa strzelania

    this.keys = {};
    // 🔥 Załaduj dźwięki
    this.levelUpSound = new Audio("/frontend/asset/sounds/blessing2.ogg");
    this.shootSound = new Audio("/frontend/asset/sounds/laser.wav");

    this.loadImages();
    this.setupKeyboardListeners();
  }

  loadImages() {
    for (let i = 1; i <= 6; i++) {
      const img = new Image();
      img.src = `/frontend/asset/images/player/walk/${i}.png`;
      this.walkFrames.push(img);
    }

    for (let i = 1; i <= 4; i++) {
      const img = new Image();
      img.src = `/frontend/asset/images/player/jump/${i}.png`;
      this.jumpFrames.push(img);
    }

    for (let i = 1; i <= 4; i++) {
      const img = new Image();
      img.src = `/frontend/asset/images/player/attack/${i}.png`;
      this.attackFrames.push(img);
    }
  }

  setupKeyboardListeners() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.key] = true;
      if (e.key === "ArrowLeft") this.facingLeft = true;
      if (e.key === "ArrowRight") this.facingLeft = false;
      if (e.key === " " && !this.isJumping) this.jump();
      if (e.key === "f") this.shoot();
    });

    window.addEventListener("keyup", (e) => {
      this.keys[e.key] = false;
    });

    this.canvas.addEventListener("click", () => this.shoot());
  }

  shoot() {
    if (this.shootCooldown) return;
    this.shootCooldown = true;
    setTimeout(() => (this.shootCooldown = false), 500);

    const target = this.findNearestEnemy();
    if (!target) return;

    const dx = target.x - this.x;
    const dy = target.y - this.y;
    const magnitude = Math.sqrt(dx * dx + dy * dy);
    const speed = 6;

    const velocityX = (dx / magnitude) * speed;
    const velocityY = (dy / magnitude) * speed;

    this.lasers.push({
      x: this.x + this.width / 2,
      y: this.y + this.height / 2,
      width: 10,
      height: 30,
      velocityX,
      velocityY,
    });
    // 🔥 Odtwórz dźwięk strzału
    this.shootSound.currentTime = 0;
    this.shootSound.play();
    // 🔥 Uruchom animację ataku
    this.isAttacking = true;
    this.currentFrame = 0;
    this.animateAttack();
  }

  findNearestEnemy() {
    if (!this.level1 || this.level1.enemies.length === 0) return null;

    let nearestEnemy = null;
    let minDistance = Infinity;

    this.level1.enemies.forEach((enemy) => {
      const distance = Math.sqrt(
        (this.x - enemy.x) ** 2 + (this.y - enemy.y) ** 2
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestEnemy = enemy;
      }
    });

    return nearestEnemy;
  }

  moveLeft() {
    if (!this.isJumping) {
      this.velocityX = -this.speed;
    }
    this.facingLeft = true;
    this.animateWalk();
  }

  moveRight() {
    if (!this.isJumping) {
      this.velocityX = this.speed;
    }
    this.facingLeft = false;
    this.animateWalk();
  }

  jump() {
    if (!this.isJumping) {
      this.velocityY = -12;
      this.isJumping = true;

      // 🔥 Skok w kierunku ruchu, jeśli trzymamy strzałkę
      if (this.keys["ArrowLeft"]) this.velocityX = -this.speed * 1.5;
      if (this.keys["ArrowRight"]) this.velocityX = this.speed * 1.5;

      this.currentFrame = 0;
    }
  }

  update() {
    // 🔥 Sprawdzenie czy gracz się porusza
    if (this.keys["ArrowLeft"]) {
      this.moveLeft();
    }
    if (this.keys["ArrowRight"]) {
      this.moveRight();
    }

    this.x += this.velocityX;
    this.y += this.velocityY;
    this.velocityY += this.gravity;

    // 🔥 Stopniowe hamowanie, jeśli nie wciskasz strzałek
    if (!this.keys["ArrowLeft"] && !this.keys["ArrowRight"]) {
      this.velocityX *= 0.8;
      if (Math.abs(this.velocityX) < 0.1) this.velocityX = 0;
    }

    // 🔥 Sprawdzenie kolizji z ziemią
    const groundLevel = this.canvas.height - 180;
    if (this.y >= groundLevel) {
      this.y = groundLevel;
      this.isJumping = false;
      this.velocityY = 0;
    }

    // 🔥 Aktualizacja strzałów gracza
    this.lasers.forEach((laser, index) => {
      laser.x += laser.velocityX;
      laser.y += laser.velocityY;

      this.level1.enemies.forEach((enemy, enemyIndex) => {
        if (
          laser.x < enemy.x + enemy.width &&
          laser.x + laser.width > enemy.x &&
          laser.y < enemy.y + enemy.height &&
          laser.y + laser.height > enemy.y
        ) {
          this.addExp(22);
          this.level1.enemies.splice(enemyIndex, 1);
          this.lasers.splice(index, 1);
        }
      });
    });

    if (this.isJumping) {
      this.animateJump();
    }
  }

  draw() {
    let frame;

    if (this.isAttacking) {
      frame = this.attackFrames[this.currentFrame]; // 🔥 Rysowanie ataku
    } else if (this.isJumping) {
      frame = this.jumpFrames[this.currentFrame]; // 🔥 Rysowanie skoku
    } else {
      frame = this.walkFrames[this.currentFrame]; // 🔥 Normalny ruch
    }

    if (!frame || !frame.complete || frame.naturalWidth === 0) {
      console.warn("Obraz nie został jeszcze wczytany lub jest niepoprawny.");
      return;
    }

    this.ctx.save();
    this.ctx.translate(this.x + this.width / 2, this.y);
    this.ctx.scale(this.facingLeft ? -1 : 1, 1);
    this.ctx.drawImage(frame, -this.width / 2, 0, this.width, this.height);
    this.ctx.restore();

    this.ctx.fillStyle = "cyan";
    this.lasers.forEach((laser) => {
      this.ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
    });
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

  animateAttack() {
    if (!this.attackFrames.length) {
      console.warn("Animacja ataku nie jest wczytana.");
      return;
    }

    let frame = 0;
    const interval = setInterval(() => {
      this.currentFrame = frame;

      if (!this.attackFrames[frame]) {
        console.warn(`Nie znaleziono klatki animacji ataku: ${frame}`);
        clearInterval(interval);
        this.isAttacking = false;
        return;
      }

      frame++;
      if (frame >= this.attackFrames.length) {
        clearInterval(interval);
        this.isAttacking = false; // 🔥 Po zakończeniu animacji wracamy do normalnej
      }
    }, 50);
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
    // 🔥 Odtwórz dźwięk poziomu
    this.levelUpSound.currentTime = 0;
    this.levelUpSound.play();
    console.log(`Level UP! Teraz masz poziom ${this.level}`);
    this.updateHUD();
  }

  loseHealth(amount) {
    this.health -= amount; // 🔥 Odejmuje procenty HP
    console.log(`Utrata życia! HP: ${this.health.toFixed(2)}%`);
    if (this.health <= 0) {
      console.log("Game Over!");
      this.health = 100; // 🔥 Restart HP
    }
    this.updateHUD();
  }

  updateHUD() {
    const hpEl = document.getElementById("hp");
    const expEl = document.getElementById("exp");
    const levelEl = document.getElementById("level");

    if (hpEl && expEl && levelEl) {
      hpEl.textContent = this.health.toFixed(2) + "%";
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
