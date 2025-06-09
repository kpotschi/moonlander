import GUI from "lil-gui";
import { PhaserDebugDraw } from "../../lib/PhaserDebugDraw";
import { b2World_Draw, GetWorldScale, mpx } from "phaser-box2d";
import GameScene from "../../scenes/GameScene";

export function Debuggable(target: any) {
  // Save the original create method
  const originalCreate = target.prototype.create;

  target.prototype.create = function (...args: any[]) {
    if (this.scene?.debugMode) {
      Debugger.getInstance(this.scene).addDebugMethod(this.debug.bind(this));
    }
    if (originalCreate) {
      return originalCreate.apply(this, args);
    }
  };
}

export class Debugger {
  private static instance: Debugger;
  private gui: GUI;
  private debugList: ((gui: GUI) => void)[] = [];
  private debugDraw: PhaserDebugDraw;
  private debugGraphics: Phaser.GameObjects.Graphics;
  private tileGrid: Phaser.GameObjects.TileSprite;

  private constructor(readonly scene: GameScene) {
    this.gui = new GUI();
    this.debugGraphics = scene.add.graphics();

    this.debugDraw = new PhaserDebugDraw(
      scene,
      this.debugGraphics,
      1280,
      720,
      GetWorldScale()
    );
  }

  private createGrid() {
    const gridSpacing = mpx(10);
    const textureWidth = gridSpacing * 4;
    const textureHeight = gridSpacing * 4;

    const graphics = this.scene.make.graphics({ x: 0, y: 0 });
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
    const rt = this.scene.make.renderTexture(
      { width: textureWidth, height: textureHeight },
      false
    );
    rt.draw(graphics);
    rt.render();
    // Add the grid as a tile sprite that follows the camera
    this.tileGrid = this.scene.add.tileSprite(0, 0, 4000, 4000, rt.texture.key);
    this.tileGrid.setDepth(-1);
    this.tileGrid.setOrigin(0);
    this.tileGrid.setScrollFactor(0);

    this.scene.ui.camera.ignore(this.tileGrid);
  }

  public static getInstance(scene: GameScene): Debugger {
    if (!Debugger.instance) {
      Debugger.instance = new Debugger(scene);
    }
    return Debugger.instance;
  }

  public addDebugMethod(fn: (gui: GUI) => void) {
    this.debugList.push(fn);
  }

  public start() {
    this.debugList.forEach((fn) => fn(this.gui));
    this.createGrid();
  }

  public getGUI() {
    return this.gui;
  }

  public update() {
    this.debugGraphics.clear();
    b2World_Draw(this.scene.world.worldId, this.debugDraw);

    // update grid backround
    if (this.tileGrid) {
      this.tileGrid.tilePositionX = this.scene.cameras.main.scrollX;
      this.tileGrid.tilePositionY = this.scene.cameras.main.scrollY;
    }
  }
}
