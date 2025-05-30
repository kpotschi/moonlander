import GameScene from "../scenes/GameScene";

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  width: 600,
  height: 1000,
  parent: "game",
  scene: [GameScene],
  backgroundColor: "#003322",

  physics: {
    default: "matter",
    matter: {
      debug: {
        showBody: true,
        showStaticBody: true,
        showVelocity: true,
        showCollisions: true,
      },
    },
  },
};
