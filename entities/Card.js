export class Card {
  constructor({
    id,
    name,
    type,
    cost = 0,
    tags = [],
    effect = '',
    flavorText = '',
    series = 'Original',
    rarity = 'common',
    imageUrl = null,
  }) {
    this.id = id;
    this.name = name;
    this.type = type;
    this.cost = cost;
    this.tags = tags;
    this.effect = effect;
    this.flavorText = flavorText;
    this.series = series;
    this.rarity = rarity;
    this.imageUrl = imageUrl;
  }

  hasTag(tag) {
    return this.tags.includes(tag);
  }

  isGuard() {
    return this.hasTag('GUARD');
  }

  isPressure() {
    return this.hasTag('PRESSURE');
  }

  isEngine() {
    return this.hasTag('ENGINE');
  }

  isGenerator() {
    return this.hasTag('GENERATOR');
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      type: this.type,
      cost: this.cost,
      tags: this.tags,
      effect: this.effect,
      flavorText: this.flavorText,
      series: this.series,
      rarity: this.rarity,
      imageUrl: this.imageUrl,
    };
  }
}
