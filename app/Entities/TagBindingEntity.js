export class TagBindingEntity {
  constructor({
    cardId,
    tagId,
    source = "text",
    value = null,
    condition = null,
    payload = {}
  }) {
    this.cardId = cardId;
    this.tagId = tagId;
    this.source = source;
    this.value = value;
    this.condition = condition;
    this.payload = payload;
  }
}
