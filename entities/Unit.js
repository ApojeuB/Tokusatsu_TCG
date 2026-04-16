import { Card } from './Card';

export class Unit extends Card {
  constructor(data) {
    super({ ...data, type: 'unit' });
    this.power = data.power ?? 0;
    this.defense = data.defense ?? 0;
    this.currentPower = data.currentPower ?? this.power;
    this.currentDefense = data.currentDefense ?? this.defense;
    this.materials = data.materials ?? [];
    this.markers = data.markers ?? 0;
    this.summoningSickness = data.summoningSickness ?? true;
    this.canAttack = data.canAttack ?? true;
    this.canBlock = data.canBlock ?? true;
    this.attachedItems = data.attachedItems ?? [];
  }

  addMaterial(card) {
    this.materials.push(card);
    this.currentPower += 1;
    this.currentDefense += 1;
  }

  addMarker(amount = 1) {
    this.markers += amount;
  }

  takeDamage(amount) {
    this.currentDefense -= amount;
    return this.currentDefense <= 0;
  }

  healFull() {
    this.currentDefense = this.defense;
  }

  startTurn({ ignoreSummoningSickness = false } = {}) {
    this.canAttack = true;
    if (ignoreSummoningSickness) {
      this.summoningSickness = false;
      return;
    }
    if (this.summoningSickness) {
      this.summoningSickness = false;
    }
  }

  toJSON() {
    return {
      ...super.toJSON(),
      power: this.power,
      defense: this.defense,
      currentPower: this.currentPower,
      currentDefense: this.currentDefense,
      materials: this.materials,
      markers: this.markers,
      summoningSickness: this.summoningSickness,
      canAttack: this.canAttack,
      canBlock: this.canBlock,
      attachedItems: this.attachedItems,
    };
  }
}
