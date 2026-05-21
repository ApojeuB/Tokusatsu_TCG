export class ContinuousEffectEntity {
  constructor({
    source,
    modifiers = [],
    duration = "while_source_active",
    layer = "rules"
  }) {
    this.source = source;
    this.modifiers = modifiers;
    this.duration = duration;
    this.layer = layer;
  }
}
