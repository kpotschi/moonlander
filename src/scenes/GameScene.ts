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
import Background from "../entities/background/Background.js";
import { LevelData } from "../config/types.js";
import LevelManager from "../systems/LevelManager.js";

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
  public background: Background;
  private levelData: LevelData;

  constructor() {
    super();
    this.debugMode = window.location.pathname.includes("debug");
  }

  init() {
    this.world = new World(this);
    this.ui = new UiManager(this);
    this.controls = new Controls(this);
    this.lander = new Lander(this);
    this.background = new Background(this);
    if (this.debugMode) {
      this.debugger = Debugger.getInstance(this);
    }
  }

  preload() {
    this.load.image("star", "./images/star.png");
    this.load.json(
      "level-0",
      "./material/chunk-test/simplified/Level_0/data.json"
    );
    this.background.preload();
    this.lander.preload();
    this.ui.preload();
  }

  async create() {
    this.levelData = this.cache.json.get("level-0");
    console.log(this.levelData);

    // LevelManager.shapeLevelData(this.levelData);
    this.createCollectibles();
    this.background.create();
    this.world.setWorldSize();
    this.createGround();
    this.lander.create(this.levelData);
    this.ui.create();
    this.setupCameras();
    if (this.debugger) this.debugger.start();
  }

  createCollectibles() {
    const entities = this.levelData.entities;
    if (entities && entities.star) {
      entities.star.forEach((star) => {
        const starSprite = this.add
          .sprite(star.x, star.y, "star")
          .setOrigin(0.5, 0.5)
          .setDepth(10);
        // console.log(star.x, star.y);
        this.ui.camera.ignore(starSprite);
      });
    }
  }

  private setupCameras() {
    this.ui.camera.ignore(this.lander.parts.map((part) => part.gameObject));
    this.cameras.main.startFollow(this.lander.corpus.gameObject, true);
  }

  private createGround() {
    const groundBodyDef = b2DefaultBodyDef();

    // groundBodyDef.rotation = RotFromRad(-0.06);

    CreateBoxPolygon({
      worldId: this.world.worldId,
      type: STATIC,
      bodyDef: groundBodyDef,
      position: pxmVec2(0, 0),
      size: new b2Vec2(10, 1),
      density: 1.0,
      friction: 0.5,
      color: b2HexColor.b2_colorLawnGreen,
    });
  }

  update(time: number, deltaTime: number) {
    // const worldId = this.world.worldId;
    // const worldConfig: WorldConfig & any = { worldId, deltaTime };
    // this.ui.update();
    // if (this.lander) this.lander.update(deltaTime);
    // UpdateWorldSprites(this.world.worldNumber);
    // if (this.debugMode) this.debugger.update();
    // this.background.update();
    // WorldStep(worldConfig);
  }
}
