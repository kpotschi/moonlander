import GameScene from "../../scenes/GameScene";
import Altimeter from "./Altimeter";

export default class UiManager {
  private altimeter: Altimeter;
  public camera: Phaser.Cameras.Scene2D.Camera;

  constructor(readonly scene: GameScene) {
    this.altimeter = new Altimeter(this.scene);

    this.camera = this.scene.cameras.add(
      0,
      0,
      this.scene.sys.canvas.width,
      this.scene.sys.canvas.height,
      false,
      "ui-camera"
    );
  }

  public preload(): void {
    this.altimeter.preload();
  }

  public create(): void {
    this.createAltimeter();
  }

  public update(): void {
    this.altimeter.update();
  }

  private createAltimeter(): void {
    this.altimeter.create();
  }
}
