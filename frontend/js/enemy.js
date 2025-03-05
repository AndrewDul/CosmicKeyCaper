// Platform class
class Platform {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  // Draw the platform
  draw(ctx) {
    ctx.fillStyle = "brown";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// Coin class
class Coin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.collected = false;
  }

  // Draw the coin
  draw(ctx) {
    if (!this.collected) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = "gold";
      ctx.fill();
      ctx.closePath();
    }
  }

  // Check if the player collects the coin
  collect(player) {
    if (
      !this.collected &&
      player.x + player.width > this.x - this.radius &&
      player.x < this.x + this.radius &&
      player.y + player.height > this.y - this.radius &&
      player.y < this.y + this.radius
    ) {
      this.collected = true;
      return true;
    }
    return false;
  }
}

// Key class
class Key {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 10;
    this.collected = false;
  }

  // Draw the key
  draw(ctx) {
    if (!this.collected) {
      ctx.fillStyle = "silver";
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
  }

  // Check if the player collects the key
  collect(player) {
    if (
      !this.collected &&
      player.x + player.width > this.x &&
      player.x < this.x + this.width &&
      player.y + player.height > this.y &&
      player.y < this.y + this.height
    ) {
      this.collected = true;
      return true;
    }
    return false;
  }
}

// Meteor class
class Meteor {
  constructor(x, y, dx = -2) {
    this.x = x;
    this.y = y;
    this.dx = dx; // Horizontal speed
    this.radius = 20;
  }

  // Update meteor position
  update() {
    this.x += this.dx;
    if (this.x + this.radius < 0) {
      this.x = canvas.width + this.radius; // Reset meteor position
    }
  }

  // Draw the meteor
  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
    ctx.closePath();
  }

  // Check collision with the player
  checkCollision(player) {
    const distance = Math.sqrt(
      (player.x - this.x) ** 2 + (player.y - this.y) ** 2
    );
    return distance < this.radius + player.width / 2;
  }
}

// Update all objects (platforms, coins, keys, meteors)
function updateObjects() {
  meteors.forEach((meteor) => meteor.update());
}

// Draw all objects
function drawObjects(ctx) {
  platforms.forEach((platform) => platform.draw(ctx));
  coins.forEach((coin) => coin.draw(ctx));
  keys.forEach((key) => key.draw(ctx));
  meteors.forEach((meteor) => meteor.draw(ctx));
}
