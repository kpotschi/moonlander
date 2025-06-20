import GameScene from "../../scenes/GameScene";

export default class Altimeter extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Image;
  private meter: Phaser.GameObjects.Image;
  private text: Phaser.GameObjects.Text;
  private graphics: Phaser.GameObjects.Graphics;

  constructor(readonly scene: GameScene) {
    super(scene, 0, 0);
    scene.add.existing(this);
  }

  public preload(): void {
    this.scene.load.image(
      "altimeter_back",
      "images/ui/altimeter/altimeter-back.png"
    );
    this.scene.load.image(
      "altimeter_meter",
      "images/ui/altimeter/altimeter-meter.png"
    );
  }

  create() {
    this.background = this.scene.add
      .image(0, 100, "altimeter_back")
      .setOrigin(0, 0.5)
      .setAngle(90);

    this.meter = this.scene.add
      .image(0, 100, "altimeter_meter")
      .setOrigin(0, 0.5)
      .setAngle(90);

    this.graphics = this.scene.add.graphics();

    this.add([this.background, this.meter, this.graphics]);

    this.scene.add.existing(this);
    this.scene.cameras.main.ignore(this);

    this.createAltimeterText();
    this.scene.cameras.main.ignore(this.text);
  }

  createAltimeterText(): void {
    const text = this.getAltitudeText(this.scene.lander.getAltitude());
    this.text = this.scene.add
      .text(this.scene.sys.canvas.width - 20, 70, text, {
        fontSize: "32px",
        fontFamily: "Monospace",
      })
      .setOrigin(1, 0);
  }

  public setAltitudeText(value: number): void {
    const altitudeText = this.getAltitudeText(value);
    this.text.setText(altitudeText);
  }

  private getAltitudeText(value: number): string {
    return `Altitude: ${value.toFixed()} m`;
  }

  update(): void {
    const altitude = this.scene.lander.getAltitude();
    this.drawIndicator(altitude);
    this.setAltitudeText(altitude);
  }

  private drawIndicator(altitude: number): void {
    // Clear previous graphics
    this.graphics.clear();

    // Parameters for the triangle
    const minAltitude = 0;
    const maxAltitude = 1000; // Adjust as needed for your game
    const meterHeight = this.meter.displayWidth;
    const meterStartY = 120;
    const meterEndY = 80 + meterHeight;
    const meterX = 30;

    // Clamp and map altitude to meter position
    const clamped = Phaser.Math.Clamp(altitude, minAltitude, maxAltitude);
    const t = 1 - (clamped - minAltitude) / (maxAltitude - minAltitude);
    const y = meterStartY + t * (meterEndY - meterStartY);

    // Triangle points (pointing left)
    const size = 22;
    const triangle = [
      { x: meterX - size, y: y }, // tip (left)
      { x: meterX, y: y - size / 2 }, // top right
      { x: meterX, y: y + size / 2 }, // bottom right
    ];

    this.graphics.fillStyle(0xff0000, 1);
    this.graphics.beginPath();
    this.graphics.moveTo(triangle[0].x, triangle[0].y);
    this.graphics.lineTo(triangle[1].x, triangle[1].y);
    this.graphics.lineTo(triangle[2].x, triangle[2].y);
    this.graphics.closePath();
    this.graphics.fillPath();
  }
}
