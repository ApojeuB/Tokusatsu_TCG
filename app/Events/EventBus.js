import { GameEventEntity } from "../Entities/GameEventEntity";

export class EventBus {
  constructor() {
    this.listeners = new Map();
    this.history = [];
  }

  on(type, handler) {
    const handlers = this.listeners.get(type) ?? [];
    handlers.push(handler);
    this.listeners.set(type, handlers);

    return () => {
      this.listeners.set(type, (this.listeners.get(type) ?? []).filter((item) => item !== handler));
    };
  }

  emit(eventLike) {
    const event = eventLike instanceof GameEventEntity
      ? eventLike
      : new GameEventEntity(eventLike);

    this.history.push(event);
    const handlers = this.listeners.get(event.type) ?? [];
    handlers.forEach((handler) => handler(event));
    return event;
  }
}
