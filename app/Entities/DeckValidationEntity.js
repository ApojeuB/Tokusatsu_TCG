export class DeckValidationEntity {
  constructor({
    deckSize = 60,
    maxCopies = 3,
    allowedClasses = [],
    allowedTalents = [],
    format = "constructed"
  } = {}) {
    this.deckSize = deckSize;
    this.maxCopies = maxCopies;
    this.allowedClasses = allowedClasses;
    this.allowedTalents = allowedTalents;
    this.format = format;
  }
}
