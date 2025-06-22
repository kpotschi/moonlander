import { CONSTANTS } from "../../config/CONSTANTS";
import GameScene from "../../scenes/GameScene";

export default class Background {
  public bgSprite: Phaser.GameObjects.Image;
  constructor(readonly scene: GameScene) {}

  preload() {
    this.scene.load.image("background", "./images/background/debug.png");
  }

  create() {
    this.bgSprite = this.scene.add.image(0, 0, "background").setOrigin(0, 0);
    // this.bgSprite.setScrollFactor(1 / CONSTANTS.WORLD.SCALE);
    this.bgSprite.setDepth(-1);
    this.scene.ui.camera.ignore(this.bgSprite);
  }

  // updateScrollFactor() {
  //   const cam = this.scene.cameras.main;

  //   const camCenterY = cam.scrollY + cam.height / 2;
  //   const camCenterX = cam.scrollX + cam.width / 2;

  //   // Y parallax
  //   const newBgY =
  //     camCenterY -
  //     this.bgSprite.height *
  //       (camCenterY / (this.bgSprite.height * CONSTANTS.WORLD.SCALE));
  //   this.bgSprite.y = newBgY;

  //   // X parallax
  //   const parallaxFactorX = 0.05;
  //   const newBgX = camCenterX * parallaxFactorX;

  //   // Use tilePositionX for seamless horizontal wrapping
  //   this.bgSprite.tilePositionX = newBgX; // Negative because tile position moves opposite to sprite
  //   this.bgSprite.x = camCenterX; // Keep sprite centered
  // }

  // public getBgSize() {
  //   return {
  //     width: this.bgSprite.width,
  //     height: this.bgSprite.height,
  //   };
  // }

  // public update() {
  //   this.updateScrollFactor();
  // }
}
