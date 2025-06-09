import { b2Polygon, b2ShapeId, b2BodyId } from "phaser-box2d";

export type BodyObject = {
  bodyId: b2BodyId;
  shapeId: b2ShapeId;
  object: b2Polygon;
};

export type JointsCreateConfig = {
  bodyA: string;
  bodyB: string;
  localAnchorA: Phaser.Types.Math.Vector2Like;
  localAnchorB: Phaser.Types.Math.Vector2Like;
  referenceAngle?: number; // Optional, if you need to set a specific angle for the joint
  angleLimit?: number; // Optional, if you need to set an angle limit for the joint
  motorTorque?: number; // Optional, if you want to enable motor torque
};
