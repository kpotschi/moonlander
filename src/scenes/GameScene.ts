import * as Phaser from "phaser";

export default class GameScene extends Phaser.Scene {
  constructor() {
    super();
  }

  preload() {
    this.load.image("moonlander", "./moonlander.png");
    this.load.json("shapes", "./moonlander.json");
  }

  create() {
    // Set world bounds for Matter.js
    this.matter.world.setBounds(
      0,
      0,
      this.sys.game.config.width as number,
      this.sys.game.config.height as number
    );

    const shapes = this.cache.json.get("shapes");
    const sprite = this.matter.add.sprite(400, 300, "moonlander", undefined, {
      shape: shapes["moonlander"],
    });

    // Make the sprite collide with world bounds
    sprite.setBounce(0.2); // Optional: add some bounce
    sprite.setScale(2);
    sprite.setOnCollideWith(this.matter.world.walls.bottom, () => {
      // Handle collision with the bottom wall if needed
      // e.g., end game, play sound, etc.
    });
    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      const currentVelocity = sprite.getVelocity();
      if (pointer.y > 300) {
        sprite.setVelocityY(currentVelocity.y - 10);
      }

      if (pointer.x < this.sys.canvas.width / 2) {
        sprite.setVelocityX(currentVelocity.x - 4);
      } else {
        sprite.setVelocityX(currentVelocity.x + 4);
      }
    });
  }

  update(time: number, delta: number) {}
}
