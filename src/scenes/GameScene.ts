import Phaser from "phaser";

import {
  CreateBoxPolygon,
  STATIC,
  UpdateWorldSprites,
  WorldStep,
  b2DefaultBodyDef,
  b2HexColor,
  b2Vec2,
} from "phaser-box2d";

import { WorldConfig } from "phaser-box2d/types/physics.js";
import { CONSTANTS } from "../config/CONSTANTS.js";
import Background from "../entities/background/Background.js";
import Lander from "../entities/lander/Lander.js";
import Controls from "../systems/Controls";
import { Debugger } from "../systems/debug/Debugger.js";
import EntitiesManager from "../systems/EntitiesManager.js";
import Altimeter from "../systems/ui/Altimeter.js";
import UiManager from "../systems/ui/UiManager.js";
import World from "../systems/World";

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
  mapData: Phaser.Tilemaps.Tilemap;
  public entitiesManager: EntitiesManager;
  // private levelData: LevelData;

  constructor() {
    super();
    this.debugMode = window.location.pathname.includes("debug");
  }

  init() {
    this.entitiesManager = new EntitiesManager(this);
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
    this.load.tilemapTiledJSON("level-1", "./levels/level-1.json");
    this.load.atlas(
      "textures",
      "./images/textures.webp",
      "./images/textures.json"
    );
    // this.load.image("mountain", "./images/mountain.png");
    // this.load.json(
    //   "level-0",
    //   "./material/chunk-test/simplified/Level_0/data.json"
    // );
    // this.background.preload();

    this.lander.preload();
    // this.ui.preload();
  }

  async create() {
    this.entitiesManager.createFromTilemap();

    // this.createCollectibles();
    // this.background.create();
    // this.world.setWorldSize();
    // this.createGround();
    this.lander.create();
    // this.ui.create();
    this.setupCameras();
    this.createGround();
    if (this.debugger) this.debugger.start();
  }

  private setupCameras() {
    this.ui.camera.ignore(this.lander.parts.map((part) => part.gameObject));
    this.cameras.main.startFollow(this.lander.corpus.gameObject, true);
    this.cameras.main.setBounds(
      0,
      0,
      CONSTANTS.WORLD.LEVEL_SIZE.PIXELS.WIDTH,
      CONSTANTS.WORLD.LEVEL_SIZE.PIXELS.HEIGHT
    );
  }

  private createGround() {
    const groundBodyDef = b2DefaultBodyDef();

    CreateBoxPolygon({
      worldId: this.world.worldId,
      type: STATIC,
      bodyDef: groundBodyDef,
      position: new b2Vec2(0, -CONSTANTS.WORLD.LEVEL_SIZE.METERS.HEIGHT),
      size: new b2Vec2(CONSTANTS.WORLD.LEVEL_SIZE.METERS.WIDTH, 1),
      density: 1.0,
      friction: 0.5,
      color: b2HexColor.b2_colorLawnGreen,
    });
  }

  update(time: number, deltaTime: number) {
    const worldId = this.world.worldId;
    const worldConfig: WorldConfig & any = { worldId, deltaTime };
    // this.ui.update();
    if (this.lander) this.lander.update(deltaTime);
    UpdateWorldSprites(this.world.worldNumber);
    if (this.debugMode) this.debugger.update();
    // this.background.update();
    WorldStep(worldConfig);
  }
}
