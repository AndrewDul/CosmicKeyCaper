class Level2 {
  constructor() {
    this.enemies = [
      new Enemy(100, 0, 4),
      new Enemy(200, 0, 2),
      new Enemy(300, 0, 3),
    ];
  }

  getEnemies() {
    return this.enemies;
  }
}
