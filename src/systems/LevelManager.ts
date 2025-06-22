import { mpx } from "phaser-box2d";
import { CONSTANTS } from "../config/CONSTANTS";
import { LevelData } from "../config/types";

export default class LevelManager {
  static shapeLevelData(levelData: LevelData): LevelData {
    levelData.entities = levelData.entities || {};

    // Level dimensions from Tiled (in Tiled units)
    const levelWidth = 2160; // Your level width in Tiled
    const levelHeight = 3840; // Your level height in Tiled

    // Get level offset coordinates
    const levelOffsetX = (levelData.x || 0) * CONSTANTS.WORLD.SCALE;
    const levelOffsetY = (levelData.y || 0) * -CONSTANTS.WORLD.SCALE;

    // Iterate through all entity types
    Object.keys(levelData.entities).forEach((entityType) => {
      const entityArray = levelData.entities[entityType];

      if (Array.isArray(entityArray)) {
        entityArray.forEach((entity) => {
          entity.x = entity.x * CONSTANTS.WORLD.SCALE + levelOffsetX;
          entity.y = -entity.y * CONSTANTS.WORLD.SCALE + levelOffsetY;
        });
      }
    });

    return levelData;
  }
}
