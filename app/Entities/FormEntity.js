export class FormEntity {
  constructor({
    id,
    name,
    pitchValue = 0,
    color = null,
    attackBonus = 0,
    defenseBonus = 0,
    abilities = [],
    keywords = [],
    formType = "base",
    transformationCost = 0,
    duration = "until_destroyed",
    canBeDestroyed = true,
    stackEffects = []
  }) {
    this.id = id;
    this.name = name;
    this.pitchValue = pitchValue;
    this.color = color;
    this.attackBonus = attackBonus;
    this.defenseBonus = defenseBonus;
    this.abilities = abilities;
    this.keywords = keywords;
    this.formType = formType;
    this.transformationCost = transformationCost;
    this.duration = duration;
    this.canBeDestroyed = canBeDestroyed;
    this.stackEffects = stackEffects;
  }
}
