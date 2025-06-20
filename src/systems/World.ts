import GameScene from "../scenes/GameScene";
import {
  b2DefaultWorldDef,
  b2WorldId,
  CreateWorld,
  pxm,
  SetWorldScale,
} from "phaser-box2d";
import { CONSTANTS } from "../config/CONSTANTS";

export default class World {
  readonly worldId: b2WorldId;
  readonly worldNumber: number;
  public worldSizePx: { width: number; height: number };
  public worldSizeM: { width: number; height: number };

  constructor(readonly scene: GameScene) {
    this.worldId = CreateWorld({ worldDef: b2DefaultWorldDef() }).worldId;
    SetWorldScale(CONSTANTS.WORLD.SCALE);
    this.worldNumber = Number(this.worldId);
  }

  setWorldSize() {
    let { width, height } = this.scene.background.getBgSize();

    width *= CONSTANTS.WORLD.SCALE;
    height *= CONSTANTS.WORLD.SCALE;

    this.worldSizePx = {
      width,
      height,
    };

    this.worldSizeM = {
      width: pxm(width),
      height: pxm(height),
    };
    console.log("world in m", this.worldSizeM);
    console.log("world in px", this.worldSizePx);
  }

  getWorldId(): b2WorldId {
    return this.worldId;
  }
}
