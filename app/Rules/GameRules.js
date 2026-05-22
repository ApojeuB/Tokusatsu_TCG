export const ZONE_TYPES = {
  deck: "deck",
  hand: "hand",
  graveyard: "graveyard",
  exile: "exile",
  arsenal: "arsenal",
  field: "field",
  forms: "forms",
  soul: "soul"
};

export const CARD_TYPES = {
  action: "Action",
  attack: "Attack",
  reaction: "Reaction",
  defenseReaction: "Defense Reaction",
  attackReaction: "Attack Reaction",
  instant: "Instant",
  support: "Support",
  equipment: "Equipment",
  form: "Form",
  campo: "Campo",
  token: "Token"
};

export const EFFECT_TYPES = {
  triggered: "triggered",
  static: "static",
  replacement: "replacement",
  prevention: "prevention",
  delayed: "delayed",
  activated: "activated"
};

export const GAME_EVENTS = {
  onAttack: "ON_ATTACK",
  onBlock: "ON_BLOCK",
  onDamage: "ON_DAMAGE",
  onFormReveal: "ON_FORM_REVEAL",
  onFieldChange: "ON_FIELD_CHANGE",
  onCardPlayed: "ON_CARD_PLAYED",
  onStackResolved: "ON_STACK_RESOLVED",
  onChainLinkResolved: "ON_CHAIN_LINK_RESOLVED",
  onHit: "ON_HIT",
  onDefenseDeclared: "ON_DEFENSE_DECLARED",
  onEquipmentDefended: "ON_EQUIPMENT_DEFENDED",
  onTurnStart: "ON_TURN_START",
  onTurnEnd: "ON_TURN_END"
};

export const TURN_PHASES = ["start", "action", "reaction", "damage", "end"];

export const FORMATS = {
  blitz: {
    name: "Blitz",
    deckSize: 40,
    startingHealth: 20,
    maxCopies: 2
  },
  constructed: {
    name: "Constructed",
    deckSize: 60,
    startingHealth: 40,
    maxCopies: 3
  }
};

export const DEFAULT_KEYWORDS = [
  {
    id: "go-again",
    name: "Go Again",
    timing: "resolution",
    stackable: false,
    description: "After this action resolves, the player regains an action point.",
    ruleText: "A resolved action with Go Again restores momentum for another action."
  },
  {
    id: "dominate",
    name: "Dominate",
    timing: "attack",
    stackable: false,
    description: "The defender is limited while blocking this attack.",
    ruleText: "A dominated attack restricts defensive options during the block step."
  },
  {
    id: "fusion",
    name: "Fusion",
    timing: "play",
    stackable: false,
    description: "An additional condition unlocks a stronger effect.",
    ruleText: "When the fusion condition is met, apply the fused effect text."
  },
  {
    id: "combo",
    name: "Combo",
    timing: "play",
    stackable: false,
    description: "Checks previous combat chain activity.",
    ruleText: "If the combo condition matches attack history, apply the combo bonus."
  },
  {
    id: "blood-debt",
    name: "Blood Debt",
    timing: "end",
    stackable: true,
    description: "A lingering drawback checked at the end of turn.",
    ruleText: "At end phase, unresolved Blood Debt effects may deal damage to their owner."
  },
  {
    id: "intimidate",
    name: "Intimidate",
    timing: "attack",
    stackable: true,
    description: "Pressures the defender before blocks are declared.",
    ruleText: "When this triggers, temporarily remove a random eligible defending card."
  },
  {
    id: "overpower",
    name: "Overpower",
    timing: "attack",
    stackable: false,
    description: "The defender cannot play defense reactions from hand against this attack.",
    ruleText: "While this attack is defended, defense reactions from hand are not legal."
  },
  {
    id: "on-hit",
    name: "On-Hit",
    timing: "hit",
    stackable: true,
    description: "Mandatory effects that trigger when the attack deals damage to the opposing hero.",
    ruleText: "If this attack hits a hero, resolve the card's on-hit effects."
  },
  {
    id: "reload",
    name: "Reload",
    timing: "resolution",
    stackable: false,
    description: "Draw cards until reaching the player's intellect.",
    ruleText: "When this resolves, the player draws until their hand size equals their intellect."
  },
  {
    id: "temper",
    name: "Temper",
    timing: "defense",
    stackable: false,
    description: "Equipment loses defensive durability after defending instead of immediately going to graveyard.",
    ruleText: "After this equipment defends, reduce its remaining defense durability; destroy it when it reaches zero."
  }
];
