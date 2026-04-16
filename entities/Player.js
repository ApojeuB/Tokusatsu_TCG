import { GAME_CONFIG } from '../constants/config';

export class Player {
  constructor({
    id,
    name,
    commander,
    deck = [],
    hand = [],
    field = [],
    grave = [],
    impulse = GAME_CONFIG.startingImpulse,
    maxImpulse = GAME_CONFIG.maxImpulse,
    reactions = [],
    items = [],
    turnFlags = {},
  }) {
    this.id = id;
    this.name = name;
    this.commander = commander;
    this.deck = deck;
    this.hand = hand;
    this.field = field;
    this.grave = grave;
    this.impulse = impulse;
    this.maxImpulse = maxImpulse;
    this.reactions = reactions;
    this.items = items;
    this.turnFlags = turnFlags;
  }

  drawCard() {
    if (!this.deck.length) return null;
    const card = this.deck.shift();
    this.hand.push(card);
    return card;
  }

  gainImpulse(amount) {
    this.impulse = Math.min(this.maxImpulse, this.impulse + amount);
  }

  spendImpulse(amount) {
    if (this.impulse < amount) return false;
    this.impulse -= amount;
    return true;
  }

  removeCardFromHand(cardId) {
    const index = this.hand.findIndex((card) => card.id === cardId);
    if (index < 0) return null;
    return this.hand.splice(index, 1)[0];
  }

  summonUnit(unit) {
    this.field.push(unit);
  }

  sendUnitToGrave(unitId) {
    const index = this.field.findIndex((unit) => unit.id === unitId);
    if (index < 0) return null;
    const [unit] = this.field.splice(index, 1);
    this.grave.push(unit);
    return unit;
  }

  sendCardToGrave(card) {
    this.grave.push(card);
  }

  getRiderCountInGrave() {
    return this.grave.filter((card) => card.tags?.includes('RIDER')).length;
  }

  getFieldUnitsWithMaterials() {
    return this.field.filter((unit) => unit.materials?.length >= 3);
  }

  getUnitsByTag(tag) {
    return this.field.filter((unit) => unit.tags?.includes(tag));
  }

  startTurn() {
    this.turnFlags = {};
  }
}
