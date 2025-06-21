import {
  AddSpriteToWorld,
  b2Body_GetPosition,
  b2BodyType,
  b2Vec2,
  CreatePhysicsEditorShape,
  mpx,
  pxm,
  pxmVec2,
} from "phaser-box2d";
import Lander from "./Lander";
import { BodyObject } from "./Lander.d";
import { CONSTANTS } from "../../config/CONSTANTS";

export type Part = {
  name: string;
  gameObject: Phaser.GameObjects.Sprite;
  body: BodyObject;
};

export type PartCreateConfig = {
  name: string; // Unique name for the part
  sprite: string;
  position: Phaser.Types.Math.Vector2Like;
  dataKey: string; // Key to access the XML data for this part
};

const createPart = (lander: Lander, config: PartCreateConfig): Part => {
  const gameObject = lander.scene.add
    .sprite(config.position.x, config.position.y, config.sprite)
    .setDepth(10);

  const body = CreatePhysicsEditorShape({
    worldId: lander.scene.world.worldId,
    type: b2BodyType.b2_dynamicBody,
    key: config.dataKey,
    xmlData: lander.physicsData,
    position: new b2Vec2(pxm(config.position.x), pxm(config.position.y)),
  });

  const part = { name: config.name, gameObject, body };

  lander.addPart(part);

  AddSpriteToWorld(lander.scene.world.worldNumber, gameObject, body);

  return part;
};

export const createParts = (lander: Lander) => {
  // corpus

  const { x: startX, y: startY } = CONSTANTS.LANDER.DEFAULT_STARTING_POSITION;
  CONSTANTS.LANDER.DEFAULT_STARTING_POSITION;
  lander.corpus = createPart(lander, {
    name: "corpus",
    sprite: "moonlander",
    position: CONSTANTS.LANDER.DEFAULT_STARTING_POSITION, // in px
    dataKey: "moonlander_placeholder",
  });

  const corpusPosition = b2Body_GetPosition(lander.corpus.body.bodyId);

  // legs
  const legOffset = { x: 2.5, y: 3.7 };

  createPart(lander, {
    name: "leg_left",
    sprite: "moonlander_leg",
    position: {
      x: mpx(corpusPosition.x - legOffset.x),
      y: mpx(corpusPosition.y - legOffset.y),
    },
    dataKey: "moonlander_leg_placeholder",
  });

  createPart(lander, {
    name: "leg_right",
    sprite: "moonlander_leg",
    position: {
      x: mpx(corpusPosition.x + legOffset.x),
      y: mpx(corpusPosition.y - legOffset.y),
    },
    dataKey: "moonlander_leg_placeholder",
  });

  //feet
  createPart(lander, {
    name: "foot_left",
    sprite: "moonlander_foot",
    position: {
      x: mpx(corpusPosition.x - legOffset.x),
      y: mpx(corpusPosition.y - legOffset.y),
    },
    dataKey: "moonlander_foot_placeholder",
  });

  createPart(lander, {
    name: "foot_right",
    sprite: "moonlander_foot",
    position: {
      x: mpx(corpusPosition.x + legOffset.x),
      y: mpx(corpusPosition.y - legOffset.y),
    },
    dataKey: "moonlander_foot_placeholder",
  });
};
