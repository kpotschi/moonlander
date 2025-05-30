import GameScene from "src/scenes/GameScene";
import {
  b2DefaultWorldDef,
  b2WorldId,
  CreateWorld,
  SetWorldScale,
} from "../lib/phaser-box2d-main";
import { CONSTANTS } from "../config/CONSTANTS";

export default class World {
  readonly worldId: b2WorldId;
  readonly worldNumber: number;

  constructor(readonly scene: GameScene) {
    SetWorldScale(CONSTANTS.WORLD.SCALE);

    this.worldId = CreateWorld({ worldDef: b2DefaultWorldDef() }).worldId;
    this.worldNumber = Number(this.worldId);
  }

  getWorldId(): b2WorldId {
    return this.worldId;
  }

  // Additional methods to manage the world can be added here
}
