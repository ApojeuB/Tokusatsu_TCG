export class StackItemEntity {
  constructor({
    source,
    type,
    owner,
    targets = [],
    effect,
    timestamp = Date.now()
  }) {
    this.source = source;
    this.type = type;
    this.owner = owner;
    this.targets = targets;
    this.effect = effect;
    this.timestamp = timestamp;
  }
}
