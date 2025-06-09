import GUI from "lil-gui";
import { PhaserDebugDraw } from "../../lib/PhaserDebugDraw";
import { b2World_Draw, GetWorldScale } from "phaser-box2d";
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
  }

  public getGUI() {
    return this.gui;
  }

  public update() {
    this.debugGraphics.clear();
    b2World_Draw(this.scene.world.worldId, this.debugDraw);
  }
}
