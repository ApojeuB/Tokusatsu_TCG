export class PersonaEntity {
  constructor({
    id,
    name,
    health,
    intellect,
    class: personaClass,
    talents = [],
    passiveAbility = null,
    traits = [],
    keywords = [],
    startingForms = [],
    soulCapacity = 0,
    artwork = null,
    voice = null,
    introAnimation = null
  }) {
    this.id = id;
    this.name = name;
    this.health = health;
    this.intellect = intellect;
    this.class = personaClass;
    this.talents = talents;
    this.passiveAbility = passiveAbility;
    this.traits = traits;
    this.keywords = keywords;
    this.startingForms = startingForms;
    this.soulCapacity = soulCapacity;
    this.artwork = artwork;
    this.voice = voice;
    this.introAnimation = introAnimation;
  }
}
