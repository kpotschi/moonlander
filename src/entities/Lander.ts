import { CONSTANTS } from "../config/CONSTANTS.js";
import {
  AddSpriteToWorld,
  b2Body_GetPosition,
  b2BodyId,
  b2BodyType,
  b2CreateRevoluteJoint,
  b2DefaultRevoluteJointDef,
  b2Polygon,
  b2RevoluteJoint_EnableLimit,
  b2RevoluteJoint_EnableMotor,
  b2RevoluteJoint_SetLimits,
  b2RevoluteJoint_SetMaxMotorTorque,
  b2RevoluteJoint_SetMotorSpeed,
  b2ShapeId,
  b2Vec2,
  CreatePhysicsEditorShape,
  pxm,
  mpx,
  b2Body_ApplyForce,
  b2Body_SetLinearVelocity,
  b2Body_ApplyTorque,
  b2Body_GetAngularVelocity,
  b2Body_SetAngularVelocity,
  b2Body_GetRotation,
  b2Body_SetFixedRotation,
} from "../lib/phaser-box2d-main";
import GameScene from "../scenes/GameScene";

type BodyObject = {
  bodyId: b2BodyId;
  shapeId: b2ShapeId;
  object: b2Polygon;
};

export default class Lander {
  private corpus: BodyObject;
  private leftLeg: BodyObject;
  private rightLeg: BodyObject;
  private leftFoot: BodyObject;
  private rightFoot: BodyObject;
  private corpusSprite: Phaser.GameObjects.Sprite;

  constructor(readonly scene: GameScene) {
    this.createLander();
  }

  private async createLander() {
    await this.createCorpus();

    await this.createLegs();
    await this.createFeet();
    this.createJoints();

    this.scene.cameras.main.startFollow(
      this.corpusSprite,
      true,
      0.05,
      0.05,
      0,
      CONSTANTS.CAMERA.FOLLOW_OFFSET_Y
    );
  }

  private async createCorpus() {
    this.corpusSprite = this.scene.add
      .sprite(this.scene.sys.canvas.width / 2, 100, "moonlander")
      .setDepth(10);

    // @ts-expect-error
    this.corpus = await CreatePhysicsEditorShape({
      worldId: this.scene.world.worldId,
      type: b2BodyType.b2_dynamicBody,
      key: "moonlander_placeholder",
      url: "moonlander.xml",
      position: new b2Vec2(pxm(this.corpusSprite.x), pxm(-this.corpusSprite.y)),
      vertexOffset: new b2Vec2(0, 0),
      vertexScale: new b2Vec2(0.05, 0.05),
    });

    AddSpriteToWorld(
      this.scene.world.worldNumber,
      this.corpusSprite,
      this.corpus
    );
    console.log("1");
  }

  private async createLegs() {
    const corpusPosition = b2Body_GetPosition(this.corpus.bodyId);
    const legOffset = { x: 2.5, y: 3.7 }; // Adjusted for better leg placement
    const legLeft = this.scene.add.sprite(
      mpx(corpusPosition.x - legOffset.x),
      mpx(-corpusPosition.y + legOffset.y),
      "moonlander_legs"
    );

    const legRight = this.scene.add.sprite(
      mpx(corpusPosition.x + legOffset.x),
      mpx(-corpusPosition.y + legOffset.y),
      "moonlander_legs"
    );

    // @ts-expect-error
    this.leftLeg = await CreatePhysicsEditorShape({
      worldId: this.scene.world.worldId,
      type: b2BodyType.b2_dynamicBody,
      key: "moonlander_leg_placeholder",
      url: "moonlander.xml",
      position: new b2Vec2(pxm(legLeft.x), pxm(-legLeft.y)),
      vertexOffset: new b2Vec2(0, 0),
      vertexScale: new b2Vec2(0.05, 0.05),
    });

    // @ts-expect-error
    this.rightLeg = await CreatePhysicsEditorShape({
      worldId: this.scene.world.worldId,
      type: b2BodyType.b2_dynamicBody,
      key: "moonlander_leg_placeholder",
      url: "moonlander.xml",
      position: new b2Vec2(pxm(legRight.x), pxm(-legRight.y)),
      vertexOffset: new b2Vec2(0, 0),
      vertexScale: new b2Vec2(0.05, 0.05),
    });

    AddSpriteToWorld(this.scene.world.worldNumber, legLeft, this.leftLeg);
    AddSpriteToWorld(this.scene.world.worldNumber, legRight, this.rightLeg);
  }

  private async createFeet() {
    const footLeft = this.scene.add.sprite(100, 100, "moonlander_feet");
    const footRight = this.scene.add.sprite(100, 100, "moonlander_feet");

    // @ts-expect-error
    this.leftFoot = await CreatePhysicsEditorShape({
      worldId: this.scene.world.worldId,
      type: b2BodyType.b2_dynamicBody,
      key: "moonlander_feet_placeholder",
      url: "moonlander.xml",
      position: new b2Vec2(35, 0),
      vertexOffset: new b2Vec2(0, 0),
      vertexScale: new b2Vec2(0.05, 0.05),
    });

    // @ts-expect-error
    this.rightFoot = await CreatePhysicsEditorShape({
      worldId: this.scene.world.worldId,
      type: b2BodyType.b2_dynamicBody,
      key: "moonlander_feet_placeholder",
      url: "moonlander.xml",
      position: new b2Vec2(30, 10),
      vertexOffset: new b2Vec2(0, 0),
      vertexScale: new b2Vec2(0.05, 0.05),
    });

    AddSpriteToWorld(this.scene.world.worldNumber, footLeft, this.leftFoot);
    AddSpriteToWorld(this.scene.world.worldNumber, footRight, this.rightFoot);
  }

  private createJoints() {
    const leftAnchorOnCorpus = new b2Vec2(-2.7, -2.7);
    const rightAnchorOnCorpus = new b2Vec2(2.7, -2.7);
    const anchorOnLeg = new b2Vec2(0, 1.3);

    const corpusLegAngle = 30;

    // left joint
    const leftCorpusDef = b2DefaultRevoluteJointDef();
    leftCorpusDef.bodyIdA = this.corpus.bodyId;
    leftCorpusDef.bodyIdB = this.leftLeg.bodyId;
    leftCorpusDef.localAnchorA = leftAnchorOnCorpus;
    leftCorpusDef.localAnchorB = anchorOnLeg;

    leftCorpusDef.referenceAngle = Phaser.Math.DegToRad(-corpusLegAngle);
    const leftCorpusJoint = b2CreateRevoluteJoint(
      this.scene.world.worldId,
      leftCorpusDef
    );

    b2RevoluteJoint_EnableLimit(leftCorpusJoint, true);
    b2RevoluteJoint_SetLimits(
      leftCorpusJoint,
      -CONSTANTS.LANDER.LEGS.JOINT_ANGLE_LIMIT,
      CONSTANTS.LANDER.LEGS.JOINT_ANGLE_LIMIT
    );

    // b2RevoluteJoint_EnableMotor(leftCorpusJoint, true);
    // b2RevoluteJoint_SetMotorSpeed(leftCorpusJoint, 0.1);
    // b2RevoluteJoint_SetMaxMotorTorque(leftCorpusJoint, 62);

    // right joint
    const rightCorpusDef = b2DefaultRevoluteJointDef();

    rightCorpusDef.bodyIdA = this.corpus.bodyId;
    rightCorpusDef.bodyIdB = this.rightLeg.bodyId;
    rightCorpusDef.localAnchorA = rightAnchorOnCorpus;
    rightCorpusDef.localAnchorB = anchorOnLeg;
    rightCorpusDef.enableLimit = true;

    rightCorpusDef.referenceAngle = Phaser.Math.DegToRad(corpusLegAngle);
    const rightCorpusJoint = b2CreateRevoluteJoint(
      this.scene.world.worldId,
      rightCorpusDef
    );

    b2RevoluteJoint_EnableLimit(rightCorpusJoint, true);
    b2RevoluteJoint_SetLimits(
      rightCorpusJoint,
      -CONSTANTS.LANDER.LEGS.JOINT_ANGLE_LIMIT,
      CONSTANTS.LANDER.LEGS.JOINT_ANGLE_LIMIT
    );

    // b2RevoluteJoint_EnableMotor(rightCorpusJoint, true);
    // b2RevoluteJoint_SetMotorSpeed(rightCorpusJoint, -0.1);
    // b2RevoluteJoint_SetMaxMotorTorque(rightCorpusJoint, 62);

    // left foot joint
    const leftFootDef = b2DefaultRevoluteJointDef();

    leftFootDef.bodyIdA = this.leftLeg.bodyId;
    leftFootDef.bodyIdB = this.leftFoot.bodyId;
    leftFootDef.localAnchorA = new b2Vec2(anchorOnLeg.x, -anchorOnLeg.y);

    leftFootDef.referenceAngle = Phaser.Math.DegToRad(corpusLegAngle);
    const leftFootJoint = b2CreateRevoluteJoint(
      this.scene.world.worldId,
      leftFootDef
    );

    b2RevoluteJoint_EnableLimit(leftFootJoint, true);
    b2RevoluteJoint_SetLimits(
      leftFootJoint,
      -CONSTANTS.LANDER.FEET.JOINT_ANGLE_LIMIT,
      CONSTANTS.LANDER.FEET.JOINT_ANGLE_LIMIT
    );

    b2RevoluteJoint_EnableMotor(leftFootJoint, true);

    // right foot joint
    const rightFootDef = b2DefaultRevoluteJointDef();

    rightFootDef.bodyIdA = this.rightLeg.bodyId;
    rightFootDef.bodyIdB = this.rightFoot.bodyId;
    rightFootDef.localAnchorA = new b2Vec2(anchorOnLeg.x, -anchorOnLeg.y);

    rightFootDef.referenceAngle = Phaser.Math.DegToRad(-corpusLegAngle);
    const rightFootJoint = b2CreateRevoluteJoint(
      this.scene.world.worldId,
      rightFootDef
    );

    b2RevoluteJoint_EnableLimit(rightFootJoint, true);
    b2RevoluteJoint_SetLimits(rightFootJoint, 0, 0);

    b2RevoluteJoint_EnableMotor(rightFootJoint, true);
  }

  public applyForce() {
    const force = new b2Vec2(0, 2000);
    const position = b2Body_GetPosition(this.corpus.bodyId);

    b2Body_ApplyForce(this.corpus.bodyId, force, position, true);
    // b2Body_SetLinearVelocity(this.corpus.bodyId, force);
  }

  public getPosition(): Phaser.Types.Math.Vector2Like {
    const position = b2Body_GetPosition(this.corpus.bodyId);
    return new Phaser.Math.Vector2(mpx(position.x), mpx(-position.y));
  }

  update() {
    if (this.scene.controls.thrust) {
      const force = new b2Vec2(0, 2000); // Adjust value as needed
      const position = b2Body_GetPosition(this.corpus.bodyId);
      b2Body_ApplyForce(this.corpus.bodyId, force, position, true);
    }

    // Rotation (steering)
    const steer = this.scene.controls.steer;
    if (steer !== 0) {
      const torque = 300; // Adjust for feel
      b2Body_ApplyTorque(this.corpus.bodyId, -steer * torque, true);
    }

    // // --- NEW: Angular damping ---
    // // If your API supports it, set angular damping once (not every frame)
    // // Example: b2Body_SetAngularDamping(this.corpus.bodyId, 2.0);

    // // --- Clamp angular velocity ---
    if (this.corpus) {
      const maxAngVel = 2.5; // radians/sec, adjust for feel
      const angVel = b2Body_GetAngularVelocity(this.corpus.bodyId);
      if (Math.abs(angVel) > maxAngVel) {
        b2Body_SetAngularVelocity(
          this.corpus.bodyId,
          Math.sign(angVel) * maxAngVel
        );
      }

      // --- Optional: Auto-stabilization ---
      // If the lander is tilted more than 45 degrees, apply corrective torque
      const rot = b2Body_GetRotation(this.corpus.bodyId); // { c: ..., s: ... }
      const angle = Math.atan2(rot.s, rot.c); // angle in radians

      const maxTilt = Math.PI / 4; // 45 degrees
      if (Math.abs(angle) > maxTilt) {
        const correctionTorque = -angle * 50; // Proportional controller, tune as needed
        b2Body_ApplyTorque(this.corpus.bodyId, correctionTorque, true);
      }
    }
  }
}
