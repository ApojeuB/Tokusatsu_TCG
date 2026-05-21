export class EffectEntity {
  constructor({
    id,
    type = "static",
    trigger = null,
    resolution = null,
    duration = "instant",
    targets = [],
    conditions = []
  }) {
    this.id = id;
    this.type = type;
    this.trigger = trigger;
    this.resolution = resolution;
    this.duration = duration;
    this.targets = targets;
    this.conditions = conditions;
  }
}
