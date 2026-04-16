import { Card } from './Card';

export class Item extends Card {
  constructor(data) {
    super({ ...data, type: 'item' });
    this.duration = data.duration ?? 'permanent';
    this.slot = data.slot ?? 'accessory';
  }

  toJSON() {
    return {
      ...super.toJSON(),
      duration: this.duration,
      slot: this.slot,
    };
  }
}
