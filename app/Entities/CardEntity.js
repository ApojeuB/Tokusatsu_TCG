export class CardEntity {
  constructor({
    id,
    name,
    series = "Tokusatsu Chronicle",
    cardType,
    type,
    subTypes,
    subtype,
    classRequirement = null,
    talentRequirement = null,
    cost = 0,
    pitchValue = 0,
    color = null,
    attack,
    power,
    defense = 0,
    health = null,
    text,
    effect,
    keywords = [],
    effects = [],
    comboCondition = null,
    fusionCondition = null,
    goAgain = false,
    dominate = false,
    intimidate = false,
    artwork,
    image,
    rarity = "Common",
    legality = {},
    rules = [],
    flavorText = ""
  }) {
    this.id = id;
    this.name = name;
    this.series = series;
    this.cardType = cardType ?? type ?? "Action";
    this.type = this.cardType;
    this.subTypes = subTypes ?? (subtype ? [subtype] : []);
    this.subtype = this.subTypes[0] ?? null;
    this.classRequirement = classRequirement;
    this.talentRequirement = talentRequirement;
    this.cost = cost;
    this.pitchValue = pitchValue;
    this.color = color;
    this.attack = attack ?? power ?? 0;
    this.power = this.attack;
    this.defense = defense;
    this.health = health;
    this.text = text ?? effect ?? "";
    this.effect = this.text;
    this.keywords = keywords;
    this.effects = effects;
    this.comboCondition = comboCondition;
    this.fusionCondition = fusionCondition;
    this.goAgain = goAgain;
    this.dominate = dominate;
    this.intimidate = intimidate;
    this.artwork = artwork ?? image ?? null;
    this.image = this.artwork;
    this.rarity = rarity;
    this.legality = legality;
    this.rules = rules;
    this.flavorText = flavorText;
  }

  hasKeyword(keywordName) {
    return this.keywords.some((keyword) => {
      const name = typeof keyword === "string" ? keyword : keyword?.name;
      return name?.toLowerCase() === keywordName.toLowerCase();
    });
  }
}
