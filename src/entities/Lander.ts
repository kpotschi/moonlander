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
} from "../lib/phaser-box2d-main";
import GameScene from "src/scenes/GameScene";

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

  constructor(readonly scene: GameScene) {
    this.createLander();
  }

  private async createLander() {
    await this.createCorpus();
    await this.createLegs();
    await this.createFeet();
    this.createJoints();
  }

  private async createCorpus() {
    const corpus = this.scene.add
      .sprite(this.scene.sys.canvas.width / 2, 100, "moonlander")
      .setDepth(10);

    // @ts-expect-error
    this.corpus = await CreatePhysicsEditorShape({
      worldId: this.scene.world.worldId,
      type: b2BodyType.b2_dynamicBody,
      key: "moonlander_placeholder",
      url: "moonlander.xml",
      position: new b2Vec2(pxm(corpus.x), pxm(-corpus.y)),
      vertexOffset: new b2Vec2(0, 0),
      vertexScale: new b2Vec2(0.05, 0.05),
    });

    AddSpriteToWorld(this.scene.world.worldId, corpus, this.corpus);
    console.log("corpus");
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

    AddSpriteToWorld(this.scene.world.worldId, legLeft, this.leftLeg);
    AddSpriteToWorld(this.scene.world.worldId, legRight, this.rightLeg);
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

    AddSpriteToWorld(this.scene.world.worldId, footLeft, this.leftFoot);
    AddSpriteToWorld(this.scene.world.worldId, footRight, this.rightFoot);
  }

  private createJoints() {
    const corpusPosition = b2Body_GetPosition(this.corpus.bodyId);

    const leftAnchorOnCorpus = new b2Vec2(-2.7, -2.7);
    const rightAnchorOnCorpus = new b2Vec2(2.7, -2.7);
    const anchorOnLeg = new b2Vec2(0, 1.3);

    const corpusLegAngle = 30;
    const jointLimits = { inner: 0, outer: 0.4 }; // radians

    // left joint
    const leftCorpusDef = b2DefaultRevoluteJointDef();
    leftCorpusDef.bodyIdA = this.corpus.bodyId;
    leftCorpusDef.bodyIdB = this.leftLeg.bodyId;
    leftCorpusDef.localAnchorA = leftAnchorOnCorpus;
    leftCorpusDef.localAnchorB = anchorOnLeg;
    leftCorpusDef.collideConnected = false;

    leftCorpusDef.referenceAngle = Phaser.Math.DegToRad(-corpusLegAngle);
    const leftCorpusJoint = b2CreateRevoluteJoint(
      this.scene.world.worldId,
      leftCorpusDef
    );

    // After creating the joint:
    b2RevoluteJoint_EnableLimit(leftCorpusJoint, true);
    b2RevoluteJoint_SetLimits(
      leftCorpusJoint,
      -jointLimits.outer,
      jointLimits.inner
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
    rightCorpusDef.collideConnected = false;
    rightCorpusDef.enableLimit = true;

    rightCorpusDef.referenceAngle = Phaser.Math.DegToRad(corpusLegAngle);
    const rightCorpusJoint = b2CreateRevoluteJoint(
      this.scene.world.worldId,
      rightCorpusDef
    );

    b2RevoluteJoint_EnableLimit(rightCorpusJoint, true);
    b2RevoluteJoint_SetLimits(
      rightCorpusJoint,
      -jointLimits.inner,
      jointLimits.outer
    );

    // b2RevoluteJoint_EnableMotor(rightCorpusJoint, true);
    // b2RevoluteJoint_SetMotorSpeed(rightCorpusJoint, -0.1);
    // b2RevoluteJoint_SetMaxMotorTorque(rightCorpusJoint, 62);

    // left foot joint
    const leftFootDef = b2DefaultRevoluteJointDef();

    leftFootDef.bodyIdA = this.leftLeg.bodyId;
    leftFootDef.bodyIdB = this.leftFoot.bodyId;
    leftFootDef.localAnchorA = new b2Vec2(anchorOnLeg.x, -anchorOnLeg.y);
    leftFootDef.collideConnected = false;

    leftFootDef.referenceAngle = Phaser.Math.DegToRad(corpusLegAngle);
    const leftFootJoint = b2CreateRevoluteJoint(
      this.scene.world.worldId,
      leftFootDef
    );

    b2RevoluteJoint_EnableLimit(leftFootJoint, true);
    b2RevoluteJoint_SetLimits(leftFootJoint, 0, 0);

    b2RevoluteJoint_EnableMotor(leftFootJoint, true);

    // right foot joint
    const rightFootDef = b2DefaultRevoluteJointDef();

    rightFootDef.bodyIdA = this.rightLeg.bodyId;
    rightFootDef.bodyIdB = this.rightFoot.bodyId;
    rightFootDef.localAnchorA = new b2Vec2(anchorOnLeg.x, -anchorOnLeg.y);
    rightFootDef.collideConnected = false;

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
}
