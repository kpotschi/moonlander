import Phaser from "phaser";

import {
  CreateBoxPolygon,
  CreateCapsule,
  CreateWorld,
  DYNAMIC,
  GetWorldScale,
  RotFromRad,
  STATIC,
  SetWorldScale,
  WorldStep,
  b2BodyId,
  b2BodyType,
  b2Body_GetPosition,
  b2ComputeHull,
  b2CreateBody,
  b2CreatePolygonShape,
  b2CreateRevoluteJoint,
  b2DefaultBodyDef,
  b2DefaultRevoluteJointDef,
  b2DefaultShapeDef,
  b2DefaultWorldDef,
  b2HexColor,
  b2MakePolygon,
  b2RevoluteJoint_EnableLimit,
  b2RevoluteJoint_EnableMotor,
  b2RevoluteJoint_SetLimits,
  b2RevoluteJoint_SetMaxMotorTorque,
  b2RevoluteJoint_SetMotorSpeed,
  b2Vec2,
  b2WorldId,
  b2World_Draw,
  pxmVec2,
  AddSpriteToWorld,
  CreatePhysicsEditorShape,
  UpdateWorldSprites,
  b2Body_ApplyForce,
} from "../lib/phaser-box2d-main";

import { WorldConfig } from "src/lib/phaser-box2d-main/types/physics";
import { PhaserDebugDraw } from "../lib/PhaserDebugDraw.js";
import Lander from "../entities/Lander.js";

export default class GameScene extends Phaser.Scene {
  public world: {
    worldId: b2WorldId;
  };
  private debug: Phaser.GameObjects.Graphics;
  private worldDraw: PhaserDebugDraw;
  public lander: Lander;

  constructor() {
    super();
  }

  preload() {
    this.load.image("moonlander", "moonlander_placeholder.png");
    this.load.image("moonlander_feet", "moonlander_feet_placeholder.png");
    this.load.image("moonlander_legs", "moonlander_leg_placeholder.png");
  }

  async create() {
    SetWorldScale(20);

    // create world
    this.world = CreateWorld({ worldDef: b2DefaultWorldDef() });

    // debug
    this.createDebug();

    // create ground

    this.createExampleShapes();
    // this.createMoonlander();

    this.lander = new Lander(this);
  }

  // private createMoonlander() {
  //   this.createMoonlanderCorpus();
  //   this.createMoonlanderLegs();
  // }

  // private createMoonlanderCorpus() {
  //   const bodyDef = b2DefaultBodyDef();
  //   bodyDef.type = b2BodyType.b2_dynamicBody;
  //   bodyDef.position = pxmVec2(
  //     this.sys.canvas.width / 2,
  //     -this.sys.canvas.height / 2
  //   );

  //   this.moonlanderCorpusId = b2CreateBody(this.world.worldId, bodyDef);

  //   // Set vertices for polygon
  //   const vertices = [
  //     new b2Vec2(1, 1),
  //     new b2Vec2(-1, 1),
  //     new b2Vec2(-2, -1),
  //     new b2Vec2(2, -1),
  //   ];

  //   // Create a hull
  //   const hull = b2ComputeHull(vertices, vertices.length);
  //   const polygon = b2MakePolygon(hull, 0);
  //   const shapeDef = b2DefaultShapeDef();
  //   const polygonShape = b2CreatePolygonShape(
  //     this.moonlanderCorpusId,
  //     shapeDef,
  //     polygon
  //   );
  // }

  // private createMoonlanderLegs() {
  //   const corpusPosition = b2Body_GetPosition(this.lander.corpus);

  //   const legHeight = 1;
  //   const leftAnchorOnCorpus = new b2Vec2(-1, -0.8);
  //   const rightAnchorOnCorpus = new b2Vec2(1, -0.8);

  //   const anchorOnLeg = new b2Vec2(0, 0.5);

  //   const corpusLegAngle = 30;
  //   const jointLimits = { inner: 0, outer: 0.4 }; // radians

  //   // top left
  //   const topLeftLeg = CreateCapsule({
  //     worldId: this.world.worldId,
  //     type: DYNAMIC,
  //     position: new b2Vec2(
  //       corpusPosition.x + leftAnchorOnCorpus.x,
  //       corpusPosition.y + leftAnchorOnCorpus.y - legHeight / 2
  //     ),
  //     width: 0.3,
  //     height: legHeight,
  //     density: 1.0,
  //     friction: 0.05,
  //     color: b2HexColor.b2_colorSandyBrown,
  //     linearDamping: 0.1,
  //   });

  //   // top right
  //   const topRightLeg = CreateCapsule({
  //     worldId: this.world.worldId,
  //     type: DYNAMIC,
  //     position: new b2Vec2(
  //       corpusPosition.x + rightAnchorOnCorpus.x,
  //       corpusPosition.y + rightAnchorOnCorpus.y - legHeight / 2
  //     ),
  //     width: 0.3,
  //     height: legHeight,
  //     density: 1.0,
  //     friction: 0.05,
  //     color: b2HexColor.b2_colorSandyBrown,
  //     linearDamping: 0.1,
  //   });

  //   const leftCorpusDef = b2DefaultRevoluteJointDef();
  //   leftCorpusDef.bodyIdA = this.moonlanderCorpusId;
  //   leftCorpusDef.bodyIdB = topLeftLeg.bodyId;
  //   leftCorpusDef.localAnchorA = leftAnchorOnCorpus;
  //   leftCorpusDef.localAnchorB = anchorOnLeg;
  //   leftCorpusDef.collideConnected = false;
  //   leftCorpusDef.enableLimit = true;

  //   leftCorpusDef.referenceAngle = Phaser.Math.DegToRad(0);
  //   const leftCorpusJoint = b2CreateRevoluteJoint(
  //     this.world.worldId,
  //     leftCorpusDef
  //   );

  //   const rightCorpusDef = b2DefaultRevoluteJointDef();
  //   rightCorpusDef.bodyIdA = this.moonlanderCorpusId;
  //   rightCorpusDef.bodyIdB = topRightLeg.bodyId;
  //   rightCorpusDef.localAnchorA = rightAnchorOnCorpus;
  //   rightCorpusDef.localAnchorB = anchorOnLeg;
  //   rightCorpusDef.collideConnected = false;
  //   rightCorpusDef.enableLimit = true;

  //   rightCorpusDef.referenceAngle = Phaser.Math.DegToRad(0);
  //   const rightCorpusJoint = b2CreateRevoluteJoint(
  //     this.world.worldId,
  //     rightCorpusDef
  //   );

  //   // // After creating the joint:
  //   // b2RevoluteJoint_EnableLimit(leftCorpusJoint, true);
  //   // b2RevoluteJoint_SetLimits(
  //   //   leftCorpusJoint,
  //   //   -jointLimits.outer,
  //   //   jointLimits.inner
  //   // );

  //   // b2RevoluteJoint_EnableMotor(leftCorpusJoint, true);
  //   // b2RevoluteJoint_SetMotorSpeed(leftCorpusJoint, 0.1);
  //   // b2RevoluteJoint_SetMaxMotorTorque(leftCorpusJoint, 62);

  //   // // //  rightCorpusJoint
  //   // b2RevoluteJoint_EnableLimit(rightCorpusJoint, true);
  //   // b2RevoluteJoint_SetLimits(
  //   //   rightCorpusJoint,
  //   //   -jointLimits.inner,
  //   //   jointLimits.outer
  //   // );

  //   // b2RevoluteJoint_EnableMotor(rightCorpusJoint, true);
  //   // b2RevoluteJoint_SetMotorSpeed(rightCorpusJoint, -0.1);
  //   // b2RevoluteJoint_SetMaxMotorTorque(rightCorpusJoint, 62);
  // }

  private createDebug() {
    this.debug = this.add.graphics();

    this.worldDraw = new PhaserDebugDraw(
      this.debug,
      1280,
      720,
      GetWorldScale()
    );
  }

  private createExampleShapes() {
    // CreateBoxPolygon({
    //   worldId: this.world.worldId,
    //   type: DYNAMIC,
    //   position: pxmVec2(630, 64),
    //   size: 1,
    //   density: 1.0,
    //   friction: 0.2,
    //   color: b2HexColor.b2_colorGold,
    // });

    // CreateCircle({
    //   worldId: this.world.worldId,
    //   type: DYNAMIC,
    //   position: pxmVec2(690, 0),
    //   radius: 1,
    //   density: 1.0,
    //   friction: 0.5,
    //   color: b2HexColor.b2_colorRed,
    // });

    // const radius = 0.85;
    // const height = 6.0;

    // CreateCapsule({
    //   worldId: this.world.worldId,
    //   type: DYNAMIC,
    //   position: pxmVec2(400, 0),
    //   center1: new b2Vec2(0, -0.5 * height + radius),
    //   center2: new b2Vec2(0, 0.5 * height - radius),
    //   radius: radius,
    //   density: 1.0,
    //   friction: 0.05,
    //   color: b2HexColor.b2_colorSalmon,
    //   linearDamping: 0.1,
    // });

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

    this.debug.clear();

    UpdateWorldSprites(this.world.worldId);

    if (this.input.activePointer.isDown) {
      this.lander.applyForce();
    }

    b2World_Draw(worldId, this.worldDraw);
  }
}
