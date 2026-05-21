export class CombatLinkEntity {
  constructor({
    id,
    attackCard,
    attacker,
    defender,
    attackValue = attackCard?.attack ?? attackCard?.power ?? 0,
    defenseValue = 0,
    reactions = [],
    damageDealt = 0,
    resolved = false
  }) {
    this.id = id;
    this.attackCard = attackCard;
    this.attacker = attacker;
    this.defender = defender;
    this.attackValue = attackValue;
    this.defenseValue = defenseValue;
    this.reactions = reactions;
    this.damageDealt = damageDealt;
    this.resolved = resolved;
  }
}
