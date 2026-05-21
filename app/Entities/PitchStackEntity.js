export class PitchStackEntity {
  constructor({ cards = [], generatedResources = 0 } = {}) {
    this.cards = cards;
    this.generatedResources = generatedResources;
  }
}
