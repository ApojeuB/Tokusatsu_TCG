export class GameEventEntity {
  constructor({
    type,
    source = null,
    target = null,
    payload = {},
    timestamp = Date.now()
  }) {
    this.type = type;
    this.source = source;
    this.target = target;
    this.payload = payload;
    this.timestamp = timestamp;
  }
}
