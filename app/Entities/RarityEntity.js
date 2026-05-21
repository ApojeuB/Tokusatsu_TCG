export class RarityEntity {
  constructor({
    name,
    dropRate = 0,
    craftingValue = 0,
    borderStyle = "default"
  }) {
    this.name = name;
    this.dropRate = dropRate;
    this.craftingValue = craftingValue;
    this.borderStyle = borderStyle;
  }
}
