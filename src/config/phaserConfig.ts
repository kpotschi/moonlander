import GameScene from "../scenes/GameScene";

export const phaserConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.HEIGHT_CONTROLS_WIDTH,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  width: 720,
  height: 1280,
  parent: "game",
  scene: [GameScene],
  backgroundColor: "#003322",
};
