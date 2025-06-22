import {
  b2Body_ApplyForce,
  b2Body_ApplyTorque,
  b2Body_GetPosition,
  b2Body_GetRotation,
  b2Body_SetFixedRotation,
  b2Vec2,
} from "phaser-box2d";
import GameScene from "../../scenes/GameScene";
import Lander from "./Lander";
import { CONSTANTS } from "../../config/CONSTANTS";

export default class LanderSystems {
  private _fuel: number = CONSTANTS.LANDER.FUEL.STARTING;
  private _heat: number = 0;

  constructor(readonly scene: GameScene, readonly lander: Lander) {
    this.scene = scene;
    // this.createSystems();
  }

  // set fuel(value: number) {
  //   this._fuel = value;
  //   this.scene.ui.fuelGauge.setValue(value);
  // }

  // get fuel(): number {
  //   return this._fuel;
  // }

  // public useFuel(deltaTime: number, magnitude: number): void {
  //   const amount =
  //     CONSTANTS.LANDER.FUEL.CONSUMPTION * magnitude * (deltaTime / 1000);

  //   this.fuel = Math.max(0, this.fuel - amount);
  //   if (this.fuel === 0) {
  //     //   this.scene.controls.disable();
  //     //   this.scene.ui.fuelGauge.setValue(0);
  //     // Optionally, you can trigger an event or show a message when fuel runs out
  //     console.warn("Fuel depleted! Lander controls disabled.");
  //   }
  // }

  public thrust(deltaTime: number) {
    const body = this.lander.corpus.body.bodyId;
    const rot = b2Body_GetRotation(body);
    const angle = Math.atan2(rot.s, rot.c);

    // Apply thrust in the direction the lander is facing
    const thrustMagnitude = CONSTANTS.LANDER.THRUST.UPWARDS;
    const force = new b2Vec2(
      -Math.sin(angle) * thrustMagnitude,
      Math.cos(angle) * thrustMagnitude
    );

    // Apply force at center of mass (no offset needed)
    const pos = b2Body_GetPosition(body);
    b2Body_ApplyForce(body, force, pos, true);

    // this.useFuel(deltaTime, thrustMagnitude);
  }

  public rotate(deltaTime: number, vector: number) {
    b2Body_ApplyTorque(
      this.lander.corpus.body.bodyId,
      vector * CONSTANTS.LANDER.THRUST.ROTATION * deltaTime,
      true
    );
    // this.useFuel(deltaTime, sideThrustMagnitude);
  }

  //   set heat(value: number) {
  //     this._heat = value;
  //     this.scene.ui.heatGauge.setValue(value);
  //   }

  //   get heat(): number {
  //     return this._heat;
  //   }

  //   private createSystems() {
  //     this.createAltimeter();
  //     this.createFuelGauge();
  //     this.createHeatGauge();
  //   }
}
