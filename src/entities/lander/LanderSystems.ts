import {
  b2Body_ApplyForce,
  b2Body_GetPosition,
  b2Body_GetRotation,
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

  set fuel(value: number) {
    this._fuel = value;
    this.scene.ui.fuelGauge.setValue(value);
  }

  get fuel(): number {
    return this._fuel;
  }

  public useFuel(deltaTime: number, magnitude: number): void {
    const amount =
      CONSTANTS.LANDER.FUEL.CONSUMPTION * magnitude * (deltaTime / 1000);

    this.fuel = Math.max(0, this.fuel - amount);
    if (this.fuel === 0) {
      //   this.scene.controls.disable();
      //   this.scene.ui.fuelGauge.setValue(0);
      // Optionally, you can trigger an event or show a message when fuel runs out
      console.warn("Fuel depleted! Lander controls disabled.");
    }
  }

  public thrust(deltaTime: number) {
    const body = this.lander.corpus.body.bodyId;
    const pos = b2Body_GetPosition(body);
    const rot = b2Body_GetRotation(body);
    const angle = Math.atan2(rot.s, rot.c);

    // Offset from center to bottom (half lander height, adjust as needed)
    const offsetY = -3.5; // meters, negative for "down" in local space
    const thrusterX = pos.x + Math.sin(angle) * offsetY;
    const thrusterY = pos.y - Math.cos(angle) * offsetY;

    const thrustMagnitude = CONSTANTS.LANDER.THRUST.UPWARDS;
    const force = new b2Vec2(
      -Math.sin(angle) * thrustMagnitude,
      Math.cos(angle) * thrustMagnitude
    );

    b2Body_ApplyForce(body, force, new b2Vec2(thrusterX, thrusterY), true);
    this.useFuel(deltaTime, thrustMagnitude);
  }

  public steer(deltaTime: number, vector: number) {
    const body = this.lander.corpus.body.bodyId;
    const pos = b2Body_GetPosition(body);
    const rot = b2Body_GetRotation(body);
    const angle = Math.atan2(rot.s, rot.c);

    // Offset from center to side (half lander width, adjust as needed)
    const offsetX = 5; // meters, positive for right, negative for left
    // Fire from the opposite side for visual realism (optional)
    const thrusterX = pos.x + Math.cos(angle) * -offsetX * vector;
    const thrusterY = pos.y + Math.sin(angle) * -offsetX * vector;

    // Thrust direction: perpendicular to "down" (right is +, left is -)
    const sideThrustMagnitude = CONSTANTS.LANDER.THRUST.SIDEWAYS;
    const force = new b2Vec2(
      Math.cos(angle) * sideThrustMagnitude * vector,
      Math.sin(angle) * sideThrustMagnitude * vector
    );

    b2Body_ApplyForce(body, force, new b2Vec2(thrusterX, thrusterY), true);
    this.useFuel(deltaTime, sideThrustMagnitude);
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
