export class ZoneEntity {
  constructor({
    id,
    type,
    owner = null,
    cards = [],
    visibility = "owner",
    capacity = null
  }) {
    this.id = id;
    this.type = type;
    this.owner = owner;
    this.cards = cards;
    this.visibility = visibility;
    this.capacity = capacity;
  }
}
