import { GameEvents } from "./GameEvents.js";
import { log } from "../utilities/Logger.js";

export class EventEmitter extends Phaser.Events.EventEmitter {
  private static instance: EventEmitter;

  private constructor() {
    super();
  }

  public static getInstance(): EventEmitter {
    if (!EventEmitter.instance) {
      EventEmitter.instance = new EventEmitter();
    }
    return EventEmitter.instance;
  }

  public emit<T extends keyof GameEvents, E extends keyof GameEvents[T]>(
    type: T,
    event: E,
    ...args: GameEvents[T][E] extends void ? [] : [GameEvents[T][E]]
  ): boolean {
    log("Emitting event", type, event, args);
    return super.emit(type + "." + String(event), ...args);
  }

  public on<T extends keyof GameEvents, E extends keyof GameEvents[T]>(
    type: T,
    event: E,
    listener: (arg: GameEvents[T][E]) => void
  ): this {
    return super.on(type + "." + String(event), listener);
  }

  public off<T extends keyof GameEvents, E extends keyof GameEvents[T]>(
    type: T,
    event: E,
    listener: (arg: GameEvents[T][E]) => void
  ): this {
    return super.off(type + "." + String(event), listener);
  }

  public once<T extends keyof GameEvents, E extends keyof GameEvents[T]>(
    type: T,
    event: E,
    listener: (arg: GameEvents[T][E]) => void
  ): this {
    return super.once(type + "." + String(event), listener);
  }
}
