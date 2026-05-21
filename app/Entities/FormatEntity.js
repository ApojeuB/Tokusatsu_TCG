export class FormatEntity {
  constructor({
    name,
    deckSize,
    startingHealth,
    bannedCards = [],
    restrictedCards = []
  }) {
    this.name = name;
    this.deckSize = deckSize;
    this.startingHealth = startingHealth;
    this.bannedCards = bannedCards;
    this.restrictedCards = restrictedCards;
  }
}
