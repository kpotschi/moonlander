import GameScene from "../scenes/GameScene";
import {
  b2DefaultWorldDef,
  b2WorldId,
  CreateWorld,
  SetWorldScale,
} from "phaser-box2d";
import { CONSTANTS } from "../config/CONSTANTS";

export default class World {
  readonly worldId: b2WorldId;
  readonly worldNumber: number;

  constructor(readonly scene: GameScene) {
    this.worldId = CreateWorld({ worldDef: b2DefaultWorldDef() }).worldId;
    SetWorldScale(CONSTANTS.WORLD.SCALE);

    this.worldNumber = Number(this.worldId);
  }

  getWorldId(): b2WorldId {
    return this.worldId;
  }

  // Additional methods to manage the world can be added here
}
