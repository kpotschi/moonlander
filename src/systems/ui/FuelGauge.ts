import GameScene from "../../scenes/GameScene";

export default class FuelGauge {
  text: Phaser.GameObjects.Text;
  constructor(readonly scene: GameScene) {
    this.scene = scene;
    this.create();
    scene.cameras.main.ignore(this.text);
  }

  private create() {
    const text = this.getFuelText(this.scene.lander.getFuel());
    this.text = this.scene.add
      .text(this.scene.sys.canvas.width - 20, 20, text, {
        fontSize: "32px",
        fontFamily: "Monospace",
      })
      .setOrigin(1, 0);
  }

  public setValue(value: number): void {
    const fuelText = this.getFuelText(value);
    this.text.setText(fuelText);
  }

  private getFuelText(value: number): string {
    return `Fuel: ${value.toFixed()} L`;
  }
}
