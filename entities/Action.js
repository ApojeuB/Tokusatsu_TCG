import { Card } from './Card';

export class Action extends Card {
  constructor(data) {
    super({ ...data, type: 'action' });
    this.speed = data.speed ?? 'normal';
    this.targets = data.targets ?? 'any';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      speed: this.speed,
      targets: this.targets,
    };
  }
}
