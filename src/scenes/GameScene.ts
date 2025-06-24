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
  mapData: Phaser.Tilemaps.Tilemap;
  // private levelData: LevelData;

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
    this.mapData = this.make.tilemap({ key: "level-1" });
    // var img1 = this.mapData.addTilesetImage("mountain.png", "mountain")!;
    // var img2 = this.mapData.addTilesetImage(
    //   "moonlander_placeholder.png",
    //   "moonlander"
    // )!;

    this.mapData.objects.forEach((objectLayer) => {
      objectLayer.objects.forEach((object) => {
        if (object.gid && object.x && object.y) {
          console.log(object);

          const textureName: string = this.getByGid(object.gid);
          this.add.image(object.x, object.y, "textures", textureName);
        }
      });
    });

    // if (obstaclesLayer) {
    //   console.log(obstaclesLayer);
    //   obstaclesLayer.objects.forEach((obj) => {
    //     console.log(obj);
    //     if (obj.gid) {
    //       // This is an image object (from an image collection tileset)
    //       const tileset = this.mapData.tilesets[0]; // Adjust if you have multiple tilesets
    //       console.log(tileset);
    //     }
    //     // You can also check for type/class here if you
    //     // use them
    //   });
    // }
    // console.log(this.mapData.getObjectLayer("obstacles"));

    // this.mapData.createLayer("obstacles", [img1, img2]);

    // this.createObstacleLayer(); // this.levelData = this.cache.json.get("level-0");
    // console.log(this.levelData);
    // // LevelManager.shapeLevelData(this.levelData);
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

  getByGid(gid: number) {
    const collection = this.mapData.imageCollections.find((collection) =>
      collection.containsImageIndex(gid)
    );

    const imageObject = collection?.images.find((image) => image.gid === gid);

    if (!imageObject) {
      console.warn(`No image found for gid ${gid}`);
      return null;
    }

    return imageObject.image.split("/").pop();
  }

  createObstacleLayer() {
    // this.mapData.createFromObjects("obstacles", {
    //   key: "mountain",
    // });
    // const obstaclesLayer = this.mapData.getObjectLayer("obstacles");
    // if (obstaclesLayer) {
    //   console.log(obstaclesLayer);
    //   obstaclesLayer.objects.forEach((obj) => {
    //     console.log(obj);
    //     if (obj.gid) {
    //       // This is an image object (from an image collection tileset)
    //       // const tileset = this.mapData.tilesets[0]; // Adjust if you have multiple tilesets
    //       // const tileProps = tileset.getTileProperties(
    //       //   obj.gid - tileset.firstgid
    //       // );
    //       // const imageName = tileset.getTileImageName(
    //       //   obj.gid - tileset.firstgid
    //       // );
    //       // this.add
    //       //   .image(obj.x, obj.y, imageName)
    //       //   .setOrigin(0, 1) // Tiled's default for image objects
    //       //   .setDisplaySize(obj.width, obj.height);
    //     }
    //     // You can also check for type/class here if you use them
    //   });
    // }
  }

  // createCollectibles() {
  //   const entities = this.levelData.entities;
  //   if (entities && entities.star) {
  //     entities.star.forEach((star) => {
  //       const starSprite = this.add
  //         .sprite(star.x, star.y, "star")
  //         .setOrigin(0.5, 0.5)
  //         .setDepth(10);
  //       // console.log(star.x, star.y);
  //       this.ui.camera.ignore(starSprite);
  //     });
  //   }
  // }

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
