export class TriggerEntity {
  constructor({ event, condition = null, effect, optional = false }) {
    this.event = event;
    this.condition = condition;
    this.effect = effect;
    this.optional = optional;
  }
}
