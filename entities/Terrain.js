import { Card } from './Card';

export class Terrain extends Card {
  constructor(data) {
    super({ ...data, type: 'terrain' });
    this.globalEffect = data.globalEffect ?? true;
    this.duration = data.duration ?? 'whileActive';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      globalEffect: this.globalEffect,
      duration: this.duration,
    };
  }
}
