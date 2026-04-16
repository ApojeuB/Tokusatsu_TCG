import { Card } from './Card';

export class Reaction extends Card {
  constructor(data) {
    super({ ...data, type: 'reaction' });
    this.trigger = data.trigger ?? 'onAttack';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      trigger: this.trigger,
    };
  }
}
