export class ExpansionEntity {
  constructor({
    id,
    name,
    releaseDate,
    cards = [],
    legalFormats = []
  }) {
    this.id = id;
    this.name = name;
    this.releaseDate = releaseDate;
    this.cards = cards;
    this.legalFormats = legalFormats;
  }
}
