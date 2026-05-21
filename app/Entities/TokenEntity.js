export class TokenEntity {
  constructor({
    id,
    generatedBy,
    stats = {},
    temporary = true
  }) {
    this.id = id;
    this.generatedBy = generatedBy;
    this.stats = stats;
    this.temporary = temporary;
  }
}
