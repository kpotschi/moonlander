import {
  AddSpriteToWorld,
  b2Body_ApplyForce,
  b2Body_ApplyTorque,
  b2Body_GetAngularVelocity,
  b2Body_GetLinearVelocity,
  b2Body_GetPosition,
  b2Body_GetRotation,
  b2Body_SetAngularVelocity,
  b2Body_SetLinearVelocity,
  b2BodyId,
  b2BodyType,
  b2CreateRevoluteJoint,
  b2DefaultRevoluteJointDef,
  b2JointId,
  b2Polygon,
  b2RevoluteJoint_EnableLimit,
  b2RevoluteJoint_EnableMotor,
  b2RevoluteJoint_GetAngle,
  b2RevoluteJoint_GetMotorSpeed,
  b2RevoluteJoint_SetLimits,
  b2RevoluteJoint_SetMaxMotorTorque,
  b2RevoluteJoint_SetMotorSpeed,
  b2ShapeId,
  b2Vec2,
  CreatePhysicsEditorShape,
  mpx,
  pxm,
} from "phaser-box2d";
import { CONSTANTS } from "../config/CONSTANTS.js";
import GameScene from "../scenes/GameScene";
import { b2GetJoint } from "phaser-box2d/types/joint_c.js";

type BodyObject = {
  bodyId: b2BodyId;
  shapeId: b2ShapeId;
  object: b2Polygon;
};

type Part = {
  name: string;
  gameObject: Phaser.GameObjects.Sprite;
  body: BodyObject;
};

type PartCreateConfig = {
  name: string; // Unique name for the part
  sprite: string;
  position: Phaser.Types.Math.Vector2Like;
  dataKey: string; // Key to access the XML data for this part
};

type JointsCreateConfig = {
  bodyA: string;
  bodyB: string;
  localAnchorA: Phaser.Types.Math.Vector2Like;
  localAnchorB: Phaser.Types.Math.Vector2Like;
  referenceAngle?: number; // Optional, if you need to set a specific angle for the joint
  angleLimit?: number; // Optional, if you need to set an angle limit for the joint
  motorTorque?: number; // Optional, if you want to enable motor torque
};

export default class Lander {
  private parts: Part[] = [];
  private joints: Record<string, b2JointId> = {};
  private physicsData: XMLDocument;
  private corpus: Part;

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

    this.createParts();
    this.createJoints();
    this.setupCameras();
  }

  private setupCameras() {
    this.scene.ui.camera.ignore(this.parts.map((part) => part.gameObject));

    this.scene.cameras.main.startFollow(
      this.corpus.gameObject,
      true,
      0.05,
      0.05,
      0,
      CONSTANTS.CAMERA.FOLLOW_OFFSET_Y
    );
  }

  private createPart(config: PartCreateConfig): Part {
    const gameObject = this.scene.add
      .sprite(config.position.x, config.position.y, config.sprite)
      .setDepth(10);

    const body = CreatePhysicsEditorShape({
      worldId: this.scene.world.worldId,
      type: b2BodyType.b2_dynamicBody,
      key: config.dataKey,
      xmlData: this.physicsData,
      position: new b2Vec2(pxm(config.position.x), pxm(config.position.y)),
    });

    const part = { name: config.name, gameObject, body };

    this.addPart(part);

    AddSpriteToWorld(this.scene.world.worldNumber, gameObject, body);

    return part;
  }

  private createParts() {
    // corpus
    this.corpus = this.createPart({
      name: "corpus",
      sprite: "moonlander",
      position: { x: this.scene.sys.canvas.width / 2, y: 100 },
      dataKey: "moonlander_placeholder",
    });

    const corpusPosition = b2Body_GetPosition(this.corpus.body.bodyId);

    // legs
    const legOffset = { x: 2.5, y: 3.7 };

    this.createPart({
      name: "leg_left",
      sprite: "moonlander_leg",
      position: {
        x: mpx(corpusPosition.x - legOffset.x),
        y: mpx(-corpusPosition.y + legOffset.y),
      },
      dataKey: "moonlander_leg_placeholder",
    });

    this.createPart({
      name: "leg_right",
      sprite: "moonlander_leg",
      position: {
        x: mpx(corpusPosition.x + legOffset.x),
        y: mpx(-corpusPosition.y + legOffset.y),
      },
      dataKey: "moonlander_leg_placeholder",
    });

    //feet
    this.createPart({
      name: "foot_left",
      sprite: "moonlander_foot",
      position: {
        x: mpx(corpusPosition.x - legOffset.x),
        y: mpx(-corpusPosition.y + legOffset.y),
      },
      dataKey: "moonlander_foot_placeholder",
    });

    this.createPart({
      name: "foot_right",
      sprite: "moonlander_foot",
      position: {
        x: mpx(corpusPosition.x + legOffset.x),
        y: mpx(-corpusPosition.y + legOffset.y),
      },
      dataKey: "moonlander_foot_placeholder",
    });
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

  update() {
    // this.updateLegMotors();
    if (this.scene.controls.thrust) {
      const force = new b2Vec2(0, 2000);
      const position = b2Body_GetPosition(this.corpus.body.bodyId);
      b2Body_ApplyForce(this.corpus.body.bodyId, force, position, true);
    }

    this.checkTerminalVelocity();
    // // Rotation (steering)
    // const steer = this.scene.controls.steer;
    // if (steer !== 0) {
    //   const torque = 300; // Adjust for feel
    //   b2Body_ApplyTorque(this.corpus.bodyId, -steer * torque, true);
    // }
    // // // --- NEW: Angular damping ---
    // // // If your API supports it, set angular damping once (not every frame)
    // // // Example: b2Body_SetAngularDamping(this.corpus.bodyId, 2.0);
    // // // --- Clamp angular velocity ---
    // if (this.corpus) {
    //   const maxAngVel = 2.5; // radians/sec, adjust for feel
    //   const angVel = b2Body_GetAngularVelocity(this.corpus.bodyId);
    //   if (Math.abs(angVel) > maxAngVel) {
    //     b2Body_SetAngularVelocity(
    //       this.corpus.bodyId,
    //       Math.sign(angVel) * maxAngVel
    //     );
    //   }
    //   // --- Optional: Auto-stabilization ---
    //   // If the lander is tilted more than 45 degrees, apply corrective torque
    //   const rot = b2Body_GetRotation(this.corpus.bodyId); // { c: ..., s: ... }
    //   const angle = Math.atan2(rot.s, rot.c); // angle in radians
    //   const maxTilt = Math.PI / 4; // 45 degrees
    //   if (Math.abs(angle) > maxTilt) {
    //     const correctionTorque = -angle * 50; // Proportional controller, tune as needed
    //     b2Body_ApplyTorque(this.corpus.bodyId, correctionTorque, true);
    //   }
    // }
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

  private addPart(part: Part) {
    this.parts.push(part);
  }
}
