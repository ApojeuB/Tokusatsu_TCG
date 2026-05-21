export class DamageEntity {
  constructor({
    source,
    target,
    amount,
    type = "combat",
    prevented = 0,
    modified = 0
  }) {
    this.source = source;
    this.target = target;
    this.amount = amount;
    this.type = type;
    this.prevented = prevented;
    this.modified = modified;
  }

  get finalAmount() {
    return Math.max(0, this.amount + this.modified - this.prevented);
  }
}
