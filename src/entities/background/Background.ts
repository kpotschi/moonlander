import { CONSTANTS } from "../../config/CONSTANTS";
import GameScene from "../../scenes/GameScene";

export default class Background {
  private bgSprite: Phaser.GameObjects.Image;
  constructor(readonly scene: GameScene) {}

  preload() {
    this.scene.load.image("background", "./images/background/level-1.png");
  }

  create() {
    this.bgSprite = this.scene.add.image(0, 0, "background").setOrigin(0.5, 1);
    // this.bgSprite.setScrollFactor(1 / CONSTANTS.WORLD.SCALE);
    this.bgSprite.setDepth(-1);
    this.scene.ui.camera.ignore(this.bgSprite);
  }

  updateScrollFactor() {
    const cam = this.scene.cameras.main;

    const camCenterY = cam.scrollY + cam.height / 2;
    const camCenterX = cam.scrollX + cam.width / 2;

    // Y parallax (your working solution)
    const newBgY =
      camCenterY -
      this.bgSprite.height *
        (camCenterY / (this.bgSprite.height * CONSTANTS.WORLD.SCALE));

    // X parallax (same math)
    const newBgX =
      camCenterX -
      this.bgSprite.width *
        (camCenterX / (this.bgSprite.width * CONSTANTS.WORLD.SCALE));

    this.bgSprite.y = newBgY;
    this.bgSprite.x = newBgX;
  }

  public getBgSize() {
    return {
      width: this.bgSprite.width,
      height: this.bgSprite.height,
    };
  }

  public update() {
    this.updateScrollFactor();
  }
}
