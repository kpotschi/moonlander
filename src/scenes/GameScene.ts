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
  mpx,
} from "phaser-box2d";

import Lander from "../entities/lander/Lander.js";
import { PhaserDebugDraw } from "../lib/PhaserDebugDraw.js";
import World from "../systems/World";
import Controls from "../systems/Controls";
import { WorldConfig } from "phaser-box2d/types/physics.js";
import Altimeter from "../systems/ui/Altimeter.js";
import UiManager from "../systems/ui/UiManager.js";
import { CONSTANTS } from "../config/CONSTANTS.js";
import { Debugger } from "../systems/debug/Debugger.js";

export default class GameScene extends Phaser.Scene {
  public world: World;
  // private debug: Phaser.GameObjects.Graphics;
  // private debugDraw: PhaserDebugDraw;
  public lander: Lander;
  public controls: Controls;
  public altimeter: Altimeter;
  public ui: UiManager;
  // private tileGrid: Phaser.GameObjects.TileSprite;
  readonly debugMode: boolean = false;
  private debugger: Debugger;
  private background: Phaser.GameObjects.Image;
  constructor() {
    super();
    this.debugMode = window.location.pathname.includes("debug");
  }

  init() {
    this.world = new World(this);
    this.ui = new UiManager(this);
    this.controls = new Controls(this);
    this.lander = new Lander(this);

    if (this.debugMode) {
      this.debugger = Debugger.getInstance(this);
    }
  }

  preload() {
    this.lander.preload();
    this.ui.preload();

    this.load.image("background", "./images/background/lvl_1.png");
  }

  async create() {
    this.createBackground();
    this.createGround();
    this.lander.create();
    this.ui.create();
    this.setupCameras();
    if (this.debugger) this.debugger.start();
  }

  private setupCameras() {
    this.ui.camera.ignore(this.lander.parts.map((part) => part.gameObject));

    this.cameras.main.startFollow(
      this.lander.corpus.gameObject,
      true,
      0.05,
      0.05,
      0,
      CONSTANTS.CAMERA.FOLLOW_OFFSET_Y
    );
  }

  private createBackground() {
    this.background = this.add.image(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      "background"
    );
    this.background.setScrollFactor(0.02);
    this.background.setDepth(-1).setScale(2);
    this.ui.camera.ignore(this.background);
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

  update(time: number, deltaTime: number) {
    const worldId = this.world.worldId;
    const worldConfig: WorldConfig & any = { worldId, deltaTime };
    WorldStep(worldConfig);
    this.ui.update();
    UpdateWorldSprites(this.world.worldNumber);
    if (this.lander) this.lander.update(deltaTime);

    if (this.debugMode) this.debugger.update();
  }
}
