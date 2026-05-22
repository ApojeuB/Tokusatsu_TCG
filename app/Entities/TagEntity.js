export class TagEntity {
  constructor({
    id,
    name,
    category = "effect",
    source = "text",
    description = "",
    ruleText = "",
    aliases = [],
    stackable = false,
    visibleOnBorder = false,
    timing = "static"
  }) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.source = source;
    this.description = description;
    this.ruleText = ruleText;
    this.aliases = aliases;
    this.stackable = stackable;
    this.visibleOnBorder = visibleOnBorder;
    this.timing = timing;
  }
}
