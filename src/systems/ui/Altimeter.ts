import GameScene from "../../scenes/GameScene";

export default class Altimeter extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image;
  private text: Phaser.GameObjects.Text;

  constructor(readonly scene: GameScene) {
    super(scene, 0, 0);
    scene.add.existing(this);
  }

  public preload(): void {
    this.scene.load.image(
      "altimeter_back",
      "images/ui/altimeter/altimeter-back.png"
    );
  }

  create() {
    this.background = this.scene.add.image(0, 100, "altimeter_back");
    this.background.setOrigin(0, 0.5).setAngle(90);

    this.add(this.background);

    // const text = this.scene.add.text(0, 0, "Altitude: 0 m", {
    //   fontSize: "16px",
    // });
    // text.setOrigin(0.5, 0.5);
    // this.add(text);

    // this.text = text;

    this.scene.add.existing(this);
    this.scene.cameras.main.ignore(this);
  }

  update(altitude: number): void {
    this.text.setText(`Altitude: ${altitude.toFixed(2)} m`);
  }
}
