import GameScene from "../../scenes/GameScene";
import Altimeter from "./Altimeter";
import FuelGauge from "./FuelGauge";

export default class UiManager {
  private altimeter: Altimeter;
  public camera: Phaser.Cameras.Scene2D.Camera;
  public fuelGauge: FuelGauge;

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
    this.altimeter.create();
    this.fuelGauge = new FuelGauge(this.scene);
  }

  public update(): void {
    this.altimeter.update();
  }
}
