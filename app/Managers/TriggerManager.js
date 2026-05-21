export class TriggerManager {
  constructor(triggers = []) {
    this.triggers = triggers;
  }

  register(trigger) {
    this.triggers.push(trigger);
    return trigger;
  }

  checkTriggers(event, matchState) {
    return this.triggers.filter((trigger) => {
      if (trigger.event !== event.type) {
        return false;
      }

      return typeof trigger.condition === "function"
        ? trigger.condition(event, matchState)
        : true;
    });
  }
}
