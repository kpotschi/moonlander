import GUI from "lil-gui";
import {
  b2Body_ApplyForce,
  b2Body_ApplyTorque,
  b2Body_GetAngularDamping,
  b2Body_GetAngularVelocity,
  b2Body_GetLinearVelocity,
  b2Body_GetPosition,
  b2Body_GetRotation,
  b2Body_SetAngularDamping,
  b2Body_SetLinearVelocity,
  b2Body_SetTransform,
  b2CreateRevoluteJoint,
  b2DefaultRevoluteJointDef,
  b2JointId,
  b2RevoluteJoint_EnableLimit,
  b2RevoluteJoint_SetLimits,
  b2Vec2,
  mpx,
  pxm,
} from "phaser-box2d";
import { CONSTANTS } from "../../config/CONSTANTS.js";
import GameScene from "../../scenes/GameScene.js";
import { IDebug } from "../../systems/debug/debug.js";
import { Debuggable } from "../../systems/debug/Debugger.js";
import { JointsCreateConfig } from "./Lander.d.js";
import { createParts, Part } from "./LanderParts.js";
import LanderSystems from "./LanderSystems.js";

@Debuggable
export default class Lander implements IDebug {
  public parts: Part[] = [];
  private joints: Record<string, b2JointId> = {};
  public physicsData: XMLDocument;
  public corpus: Part;
  private systems: LanderSystems;

  constructor(readonly scene: GameScene) {}

  public preload() {
    this.scene.load.image(
      "moonlander",
      "/images/moonlander/moonlander_placeholder.png"
    );
    this.scene.load.image(
      "moonlander_foot",
      "images/moonlander/moonlander_feet_placeholder.png"
    );
    this.scene.load.image(
      "moonlander_leg",
      "images/moonlander/moonlander_leg_placeholder.png"
    );

    this.scene.load.xml("moonlander_data", "images/moonlander/moonlander.xml");
  }

  public create() {
    this.physicsData = this.scene.cache.xml.get(
      "moonlander_data"
    ) as XMLDocument;

    createParts(this);
    this.createJoints();
    this.systems = new LanderSystems(this.scene, this);
    this.setupAngularMovement();
    // Debugger.getInstance(this.scene).addDebugMethod(this.debug.bind(this));
  }

  private setupAngularMovement() {
    // limit the maximum rotation

    // makes the body harder to rotate in general
    b2Body_SetAngularDamping(
      this.corpus.body.bodyId,
      CONSTANTS.LANDER.ANGULAR_DAMPING
    );
  }

  private createJoints() {
    this.joints["leg_left"] = this.createJoint({
      bodyA: "corpus",
      bodyB: "leg_left",
      localAnchorA: CONSTANTS.LANDER.CORPUS.JOINTS.ANCHORS.LEFT,
      localAnchorB: CONSTANTS.LANDER.LEGS.JOINTS.ANCHORS.TOP,
      referenceAngle: -CONSTANTS.LANDER.LEGS.JOINTS.REFERENCE_ANGLE,
      angleLimit: CONSTANTS.LANDER.LEGS.JOINTS.ANGLE_LIMIT,
      // motorTorque: CONSTANTS.LANDER.LEGS.JOINTS.MOTOR_TORQUE,
    });

    this.joints["leg_right"] = this.createJoint({
      bodyA: "corpus",
      bodyB: "leg_right",
      localAnchorA: CONSTANTS.LANDER.CORPUS.JOINTS.ANCHORS.RIGHT,
      localAnchorB: CONSTANTS.LANDER.LEGS.JOINTS.ANCHORS.TOP,
      referenceAngle: CONSTANTS.LANDER.LEGS.JOINTS.REFERENCE_ANGLE,
      angleLimit: CONSTANTS.LANDER.LEGS.JOINTS.ANGLE_LIMIT,
      // motorTorque: CONSTANTS.LANDER.LEGS.JOINTS.MOTOR_TORQUE,
    });

    this.joints["foot_left"] = this.createJoint({
      bodyA: "leg_left",
      bodyB: "foot_left",
      localAnchorA: CONSTANTS.LANDER.LEGS.JOINTS.ANCHORS.BOTTOM,
      localAnchorB: CONSTANTS.LANDER.FEET.JOINTS.ANCHORS.CENTER,
      referenceAngle: CONSTANTS.LANDER.LEGS.JOINTS.REFERENCE_ANGLE,
      angleLimit: CONSTANTS.LANDER.FEET.JOINTS.ANGLE_LIMIT,
      // motorTorque: CONSTANTS.LANDER.FEET.JOINTS.MOTOR_TORQUE,
    });

    this.joints["foot_right"] = this.createJoint({
      bodyA: "leg_right",
      bodyB: "foot_right",
      localAnchorA: CONSTANTS.LANDER.LEGS.JOINTS.ANCHORS.BOTTOM,
      localAnchorB: CONSTANTS.LANDER.FEET.JOINTS.ANCHORS.CENTER,
      referenceAngle: -CONSTANTS.LANDER.LEGS.JOINTS.REFERENCE_ANGLE,
      angleLimit: CONSTANTS.LANDER.FEET.JOINTS.ANGLE_LIMIT,
      // motorTorque: CONSTANTS.LANDER.FEET.JOINTS.MOTOR_TORQUE,
    });
  }

  private createJoint(config: JointsCreateConfig): b2JointId {
    const bodyA = this.getPart(config.bodyA).body;
    const bodyB = this.getPart(config.bodyB).body;

    const jointDef = b2DefaultRevoluteJointDef();
    jointDef.bodyIdA = bodyA.bodyId;
    jointDef.bodyIdB = bodyB.bodyId;
    jointDef.localAnchorA = new b2Vec2(
      pxm(config.localAnchorA.x),
      pxm(config.localAnchorA.y)
    );
    jointDef.localAnchorB = new b2Vec2(
      pxm(config.localAnchorB.x),
      pxm(config.localAnchorB.y)
    );

    jointDef.referenceAngle = Phaser.Math.DegToRad(config.referenceAngle || 0);
    const jointId = b2CreateRevoluteJoint(this.scene.world.worldId, jointDef);

    if (config.angleLimit != null) {
      b2RevoluteJoint_EnableLimit(jointId, true);
      b2RevoluteJoint_SetLimits(
        jointId,
        Phaser.Math.DegToRad(-config.angleLimit),
        Phaser.Math.DegToRad(config.angleLimit)
      );
    }

    // Always enable the motor for spring-like behavior
    // b2RevoluteJoint_EnableMotor(jointId, true);
    // b2RevoluteJoint_SetMaxMotorTorque(jointId, config.motorTorque ?? 2000);

    return jointId;
  }

  // public applyForce() {
  //   const force = new b2Vec2(0, 2000);
  //   const position = b2Body_GetPosition(this.corpus.bodyId);

  //   b2Body_ApplyForce(this.corpus.bodyId, force, position, true);
  //   // b2Body_SetLinearVelocity(this.corpus.bodyId, force);
  // }

  public getPosition(): Phaser.Types.Math.Vector2Like {
    const position = b2Body_GetPosition(this.corpus.body.bodyId);
    return new Phaser.Math.Vector2(mpx(position.x), mpx(-position.y));
  }

  private updateAngularMovement() {
    const desiredAngle = 0;
    const angle = Phaser.Math.Angle.Wrap(this.corpus.gameObject.rotation);
    const angleDiff = angle - desiredAngle;
    const angularVelocity = b2Body_GetAngularVelocity(this.corpus.body.bodyId);
    const correctionTorque = -angleDiff * 10 - angularVelocity * 2;

    // works like a sudden kick with no easing - doesn't seem to be correct for what we need
    // b2Body_ApplyAngularImpulse(this.corpus.body.bodyId, correctionTorque, true);
    b2Body_ApplyTorque(this.corpus.body.bodyId, correctionTorque, true);
  }

  public getFuel(): number {
    return this.systems.fuel;
  }

  update(deltaTime: number) {
    if (this.scene.controls.thrust) this.systems.thrust(deltaTime);
    const vector = this.scene.controls.steer; // -1 for left, +1 for right, 0 for none
    if (vector !== 0) this.systems.steer(deltaTime, vector);
    this.checkTerminalVelocity();
    this.updateAngularMovement();

    this.checkWorldWrap();
  }

  private checkWorldWrap() {
    const body = this.corpus.body.bodyId;
    const corpusPos = b2Body_GetPosition(body);
    const worldSize = this.scene.world.worldSizeM; // meters, adjust as needed;

    if (Math.abs(corpusPos.x) > worldSize.width * 0.5) {
      const wrappedLeft = corpusPos.x < 0;
      this.parts.forEach((part: Part) => {
        const partPos = b2Body_GetPosition(part.body.bodyId);
        const newX = wrappedLeft
          ? partPos.x + worldSize.width
          : partPos.x - worldSize.width;

        b2Body_SetTransform(part.body.bodyId, new b2Vec2(newX, partPos.y));
      });

      if (wrappedLeft) {
        this.scene.cameras.main.scrollX += mpx(worldSize.width);
      } else {
        this.scene.cameras.main.scrollX -= mpx(worldSize.width);
      }
      // this.scene.background.updateScrollFactor();
    }
  }

  public debug(gui: GUI) {
    const debugObject = {
      angularDamping: b2Body_GetAngularDamping(this.corpus.body.bodyId),
    };

    const debugFolder = gui.addFolder("Lander");
    debugFolder.add(debugObject, "angularDamping", 0, 10);
    //   .step(0.1)
    //   .onFinishChange((value: number) => {
    //     console.log("hehe");

    //     b2Body_SetAngularDamping(this.corpus.body.bodyId, value);
    //   });
    debugFolder.open();
  }

  private checkTerminalVelocity() {
    const maxFallSpeed = CONSTANTS.WORLD.TERMINAL_VELOCITY; // meters/second, realistic for a lander
    const body = this.corpus.body.bodyId;
    const velocity = b2Body_GetLinearVelocity(body);

    if (velocity.y < -maxFallSpeed) {
      velocity.y = -maxFallSpeed;
      b2Body_SetLinearVelocity(body, velocity);
    }
  }

  public getAltitude(): number {
    const altitude = -pxm(this.corpus.gameObject.y);

    return altitude;
  }

  private updateLegMotors() {
    // // --- Example: Spring-like return for leg joints ---
    // // Tune these gains for your desired "springiness"
    // const springGain = 50; // How strongly the joint tries to return
    // const dampingGain = 0.8; // How much to damp oscillation
    // // Left leg
    // {
    //   const jointId = this.joints["leg_left"];
    //   const reference = -Phaser.Math.DegToRad(
    //     CONSTANTS.LANDER.LEGS.JOINTS.REFERENCE_ANGLE
    //   );
    //   const angle = b2RevoluteJoint_GetAngle(jointId); // radians
    //   // Get angular velocities of both bodies
    //   const bodyA = this.getPart("corpus").body.bodyId;
    //   const bodyB = this.getPart("leg_left").body.bodyId;
    //   const angVelA = b2Body_GetAngularVelocity(bodyA);
    //   const angVelB = b2Body_GetAngularVelocity(bodyB);
    //   const speed = angVelB - angVelA; // relative angular velocity
    //   const error = reference - angle;
    //   const motorSpeed = error * springGain - speed * dampingGain;
    //   b2RevoluteJoint_SetMotorSpeed(jointId, motorSpeed);
    // }
    // // Right leg
    // {
    //   const jointId = this.joints["leg_right"];
    //   const reference = Phaser.Math.DegToRad(
    //     CONSTANTS.LANDER.LEGS.JOINTS.REFERENCE_ANGLE
    //   );
    //   const angle = b2RevoluteJoint_GetAngle(jointId);
    //   const bodyA = this.getPart("corpus").body.bodyId;
    //   const bodyB = this.getPart("leg_right").body.bodyId;
    //   const angVelA = b2Body_GetAngularVelocity(bodyA);
    //   const angVelB = b2Body_GetAngularVelocity(bodyB);
    //   const speed = angVelB - angVelA;
    //   const error = reference - angle;
    //   const motorSpeed = error * springGain - speed * dampingGain;
    //   b2RevoluteJoint_SetMotorSpeed(jointId, motorSpeed);
    // }
  }

  public getPart(name: string): Part {
    const part = this.parts.find((part) => part.name === name);

    if (!part) {
      throw new Error(`Part with name "${name}" not found.`);
    }
    return part;
  }

  public addPart(part: Part) {
    this.parts.push(part);
  }
}
