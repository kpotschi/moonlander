import GameScene from "../../scenes/GameScene";

export default class Background {
  private bgSprite: Phaser.GameObjects.TileSprite;
  constructor(readonly scene: GameScene) {}

  preload() {
    this.scene.load.image("background", "./images/background/level-1.png");
  }

  create() {
    this.bgSprite = this.scene.add
      .tileSprite(0, this.scene.sys.canvas.height / 2, 0, 0, "background")
      .setOrigin(0.5, 1);
    this.bgSprite.setScrollFactor(0.1);
    this.bgSprite.setDepth(-1).setScale(2);
    this.scene.ui.camera.ignore(this.bgSprite);
  }
}
