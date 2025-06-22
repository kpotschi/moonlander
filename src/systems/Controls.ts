import GameScene from "../scenes/GameScene";

export default class Controls {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private keyA: Phaser.Input.Keyboard.Key;
  private keyD: Phaser.Input.Keyboard.Key;
  private keyW: Phaser.Input.Keyboard.Key;

  constructor(private scene: GameScene) {
    if (this.scene.input.keyboard) {
      this.cursors = this.scene.input.keyboard.createCursorKeys();
      this.keyA = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.A
      );
      this.keyD = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.D
      );
      this.keyW = this.scene.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.W
      );
    }
  }

  // Returns true if thrust (up) is pressed
  get thrust(): boolean {
    const pointer = this.scene.input.activePointer;
    const isCanvas = pointer.downElement === this.scene.game.canvas;
    const canvasPressed = isCanvas && pointer.isDown;

    return this.cursors.up.isDown || this.keyW.isDown || canvasPressed;
  }

  // Returns -1 for left, 1 for right, 0 for none
  get rotate(): number {
    const leftPressed = this.cursors.left.isDown || this.keyA.isDown;
    const rightPressed = this.cursors.right.isDown || this.keyD.isDown;

    return (rightPressed ? 0 : 1) - (leftPressed ? 0 : 1);
  }
}
