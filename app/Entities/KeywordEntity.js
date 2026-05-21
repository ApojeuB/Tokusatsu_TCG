export class KeywordEntity {
  constructor({
    id,
    name,
    description = "",
    timing = "static",
    stackable = false,
    ruleText = ""
  }) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.timing = timing;
    this.stackable = stackable;
    this.ruleText = ruleText;
  }
}
