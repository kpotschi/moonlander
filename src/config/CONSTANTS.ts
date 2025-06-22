export const CONSTANTS = {
  LANDER: {
    DEFAULT_STARTING_POSITION: { x: 720, y: -160 }, // px
    FUEL: {
      STARTING: 1000,
      CONSUMPTION: 0.03,
    }, // fuel consumed per second when thrusting
    ANGULAR_DAMPING: 3, // angular damping
    THRUST: { UPWARDS: 800, ROTATION: 60 }, // nM
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
    SCALE: 16, // 1 meter = 20 pixels
    GRAVITY: -9.81, // m/s^2
    TERMINAL_VELOCITY: 30, // m/s
    LEVEL_SIZE: {
      METERS: {
        WIDTH: 80, // meters
        HEIGHT: 160, // meters
      },
      PIXELS: {
        WIDTH: 1280, // pixels
        HEIGHT: 2560, // pixels}
      },
    },
  },
  CAMERA: {
    FOLLOW_OFFSET_Y: -200,
  },
};
