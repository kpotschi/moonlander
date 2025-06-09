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
  private tileGrid: Phaser.GameObjects.TileSprite;
  readonly debugMode: boolean = false;
  private debugger: Debugger;

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
  }

  async create() {
    this.createBackground();
    this.createGround();
    this.lander.create();
    this.ui.create();
    if (this.debugger) this.debugger.start();
  }

  private createBackground() {
    const gridSpacing = mpx(10);
    const textureWidth = gridSpacing * 4;
    const textureHeight = gridSpacing * 4;

    const graphics = this.make.graphics({ x: 0, y: 0 });
    graphics.lineStyle(4, 0xffffff, 0.1);

    // Draw horizontal lines
    for (let y = 0; y <= textureHeight; y += gridSpacing) {
      graphics.lineBetween(0, y, textureWidth, y);
    }

    // Draw vertical lines
    for (let x = 0; x <= textureWidth; x += gridSpacing) {
      graphics.lineBetween(x, 0, x, textureHeight);
    }

    // Create a render texture and draw graphics onto it
    const rt = this.make.renderTexture(
      { width: textureWidth, height: textureHeight },
      false
    );
    rt.draw(graphics);
    rt.render();
    // Add the grid as a tile sprite that follows the camera
    this.tileGrid = this.add.tileSprite(0, 0, 4000, 4000, rt.texture.key);
    this.tileGrid.setDepth(-1);
    this.tileGrid.setOrigin(0);
    this.tileGrid.setScrollFactor(0);

    this.ui.camera.ignore(this.tileGrid);
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
    this.ui.update();
    UpdateWorldSprites(this.world.worldNumber);
    if (this.lander) this.lander.update();

    // update grid backround
    if (this.tileGrid) {
      this.tileGrid.tilePositionX = this.cameras.main.scrollX;
      this.tileGrid.tilePositionY = this.cameras.main.scrollY;
    }

    if (this.debugMode) this.debugger.update();
  }
}
