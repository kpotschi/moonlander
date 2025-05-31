import Phaser from "phaser";

import {
  CreateBoxPolygon,
  GetWorldScale,
  RotFromRad,
  STATIC,
  UpdateWorldSprites,
  WorldStep,
  b2DefaultBodyDef,
  b2HexColor,
  b2Vec2,
  b2World_Draw,
  pxmVec2,
} from "phaser-box2d";

import Lander from "../entities/Lander.js";
import { PhaserDebugDraw } from "../lib/PhaserDebugDraw.js";
import World from "../systems/World";
import Controls from "../systems/Controls";
import { WorldConfig } from "phaser-box2d/types/physics.js";
import Altimeter from "../systems/ui/Altimeter.js";
import UiManager from "../systems/ui/UiManager.js";

export default class GameScene extends Phaser.Scene {
  public world: World;
  private debug: Phaser.GameObjects.Graphics;
  private worldDraw: PhaserDebugDraw;
  public lander: Lander;
  public controls: Controls;
  public altimeter: Altimeter;
  public ui: UiManager;

  constructor() {
    super();
  }

  init() {
    this.world = new World(this);
    this.ui = new UiManager(this);
    this.createDebug();
    this.controls = new Controls(this);
    this.lander = new Lander(this);
  }

  preload() {
    this.lander.preload();
    this.ui.preload();
  }

  async create() {
    this.createGround();
    this.lander.create();
    this.ui.create();
  }

  private createDebug() {
    this.debug = this.add.graphics();

    this.worldDraw = new PhaserDebugDraw(
      this.debug,
      1280,
      720,
      GetWorldScale()
    );
  }

  private createGround() {
    const groundBodyDef = b2DefaultBodyDef();

    groundBodyDef.rotation = RotFromRad(-0.06);

    CreateBoxPolygon({
      worldId: this.world.worldId,
      type: STATIC,
      bodyDef: groundBodyDef,
      position: pxmVec2(this.sys.canvas.width / 2, -800),
      size: new b2Vec2(20, 1),
      density: 1.0,
      friction: 0.5,
      color: b2HexColor.b2_colorLawnGreen,
    });
  }

  update(time: number, delta: number) {
    const worldId = this.world.worldId;
    const worldConfig: WorldConfig & any = { worldId, deltaTime: delta };
    WorldStep(worldConfig);
    this.debug.clear();
    UpdateWorldSprites(this.world.worldNumber);
    if (this.lander) this.lander.update();
    b2World_Draw(worldId, this.worldDraw);
  }
}
