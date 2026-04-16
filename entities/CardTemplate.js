export class CardTemplate {
  static getBaseTemplate() {
    return {
      id: '',
      name: '',
      type: 'unit',
      cost: 1,
      tags: [],
      effect: '',
      flavorText: '',
      series: 'Original',
      rarity: 'common',
      imageUrl: null,
    };
  }

  static getUnitTemplate() {
    return {
      ...this.getBaseTemplate(),
      type: 'unit',
      power: 1,
      defense: 1,
      materials: [],
      summoningSickness: true,
    };
  }
}
