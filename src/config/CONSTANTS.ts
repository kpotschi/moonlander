export const CONSTANTS = {
  LANDER: {
    CORPUS: {
      JOINTS: {
        ANCHORS: {
          LEFT: { x: -60, y: -50 }, // relative to the center of the corpus
          RIGHT: { x: 60, y: -50 }, // relative to the center of the corpus
        },
      },
    },

    LEGS: {
      JOINTS: {
        REFERENCE_ANGLE: 30, // degrees
        ANGLE_LIMIT: 10, //deg
        // MOTOR_TORQUE: 5000, //nM
        ANCHORS: {
          TOP: { x: 0, y: 24 }, // relative to the center of the corpus
          BOTTOM: { x: 0, y: -24 }, // relative to the center of the corpus
        },
      },
    },
    FEET: {
      JOINTS: {
        ANGLE_LIMIT: 10, // degrees
        ANCHORS: {
          CENTER: { x: 0, y: 0 }, // relative to the center of the corpus
        },
        MOTOR_TORQUE: 40, //nM
      },
    },
  },

  WORLD: {
    SCALE: 20, // 1 meter = 20 pixels
    GRAVITY: -9.81, // m/s^2
  },
  CAMERA: {
    FOLLOW_OFFSET_Y: -200,
  },
};
