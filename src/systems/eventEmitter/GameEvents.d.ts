export type GameEvents = {
  UI: {
    START_BUTTON_CLICKED: void;
  };

  SOUND: {
    CLICK: void;
  };
  DATA: {
    POINTS_CHANGED: number;
  };
  LIFECYCLE: {
    START_CONFIGURATOR: void;
    SPLASH_SCREEN_LOADED: void;
    GAME_START: void;
  };
};
