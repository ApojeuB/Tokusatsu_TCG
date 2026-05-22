import { EffectEntity } from "../Entities/EffectEntity";
import { KeywordEntity } from "../Entities/KeywordEntity";
import { TagBindingEntity } from "../Entities/TagBindingEntity";
import { TagEntity } from "../Entities/TagEntity";
import { TriggerEntity } from "../Entities/TriggerEntity";
import { EFFECT_TYPES, GAME_EVENTS } from "./GameRules";

export const TAG_SOURCES = {
  text: "text",
  border: "border",
  keyword: "keyword",
  subtype: "subtype",
  explicit: "explicit"
};

export const TAG_CATEGORIES = {
  ability: "ability",
  effect: "effect",
  label: "label",
  equipment: "equipment",
  restriction: "restriction"
};

export const TAG_DEFINITIONS = [
  new TagEntity({
    id: "go-again",
    name: "Go Again",
    category: TAG_CATEGORIES.ability,
    timing: "resolution",
    aliases: ["go again"],
    description: "Permite ganhar 1 Ponto de Acao extra apos resolver a carta ou elo.",
    ruleText: "Quando a carta/elo resolve, o controlador ganha 1 ponto de acao.",
    visibleOnBorder: true
  }),
  new TagEntity({
    id: "dominate",
    name: "Dominate",
    category: TAG_CATEGORIES.restriction,
    timing: "attack",
    aliases: ["dominate"],
    description: "O defensor so pode defender com no maximo 1 carta da mao.",
    ruleText: "Durante a defesa, limite cartas vindas da mao do defensor a 1.",
    visibleOnBorder: true
  }),
  new TagEntity({
    id: "overpower",
    name: "Overpower",
    category: TAG_CATEGORIES.restriction,
    timing: "reaction",
    aliases: ["overpower"],
    description: "O defensor nao pode usar Defense Reactions da mao.",
    ruleText: "Durante a Reaction Step, Defense Reactions da mao nao sao legais.",
    visibleOnBorder: true
  }),
  new TagEntity({
    id: "on-hit",
    name: "On-Hit",
    category: TAG_CATEGORIES.effect,
    timing: "hit",
    aliases: ["on-hit", "on hit", "hit"],
    stackable: true,
    description: "Efeitos obrigatorios se o ataque causar dano ao heroi oponente.",
    ruleText: "Quando este ataque acerta um heroi, resolva os efeitos on-hit configurados."
  }),
  new TagEntity({
    id: "combo",
    name: "Combo",
    category: TAG_CATEGORIES.label,
    timing: "play",
    aliases: ["combo"],
    description: "Ativa bonus se uma carta especifica foi jogada anteriormente no turno.",
    ruleText: "Ao jogar a carta, verifique o historico do turno antes de aplicar o bonus."
  }),
  new TagEntity({
    id: "reload",
    name: "Reload",
    category: TAG_CATEGORIES.effect,
    timing: "resolution",
    aliases: ["reload"],
    description: "Compra cartas ate atingir o limite de intelecto do jogador.",
    ruleText: "Ao resolver, compre ate a mao ter cartas iguais ao intelecto."
  }),
  new TagEntity({
    id: "temper",
    name: "Temper",
    category: TAG_CATEGORIES.equipment,
    timing: "defense",
    aliases: ["temper"],
    description: "Equipamento perde durabilidade defensiva depois de defender.",
    ruleText: "Depois de defender, reduza a durabilidade; destrua quando chegar a zero."
  })
];

export const TAG_BY_ID = TAG_DEFINITIONS.reduce((index, tag) => {
  index[tag.id] = tag;
  return index;
}, {});

function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[_\s]+/g, "-");
}

function getPlayer(matchState, playerId) {
  return (matchState.players ?? []).find((player) => (player.id ?? player) === playerId) ?? null;
}

function getControllerId(matchState, sourceCard, fallbackOwner) {
  return sourceCard?.controller ?? sourceCard?.owner ?? fallbackOwner ?? matchState.activePlayer;
}

function ensureTurnState(matchState) {
  if (!matchState.turnState) {
    matchState.turnState = {
      cardsPlayed: [],
      actionPoints: {}
    };
  }

  if (!matchState.turnState.cardsPlayed) {
    matchState.turnState.cardsPlayed = [];
  }

  if (!matchState.turnState.actionPoints) {
    matchState.turnState.actionPoints = {};
  }

  return matchState.turnState;
}

function gainActionPoint(matchState, playerId, amount = 1) {
  const turnState = ensureTurnState(matchState);
  turnState.actionPoints[playerId] = (turnState.actionPoints[playerId] ?? 0) + amount;

  const player = getPlayer(matchState, playerId);
  if (player) {
    player.actionPoints = (player.actionPoints ?? 0) + amount;
  }
}

function drawToIntellect(matchState, playerId) {
  const player = getPlayer(matchState, playerId);

  if (!player) {
    return 0;
  }

  const intellect = player.intellect ?? player.persona?.intellect ?? 4;
  player.hand = player.hand ?? [];
  player.deck = player.deck ?? [];

  let drawn = 0;
  while (player.hand.length < intellect && player.deck.length > 0) {
    player.hand.push(player.deck.shift());
    drawn += 1;
  }

  return drawn;
}

function cardMatchesSource(event, sourceCard) {
  const sourceId = sourceCard?.id ?? sourceCard;
  return [event.source, event.payload?.source, event.payload?.card, event.payload?.attackCard]
    .some((candidate) => (candidate?.id ?? candidate) === sourceId);
}

function getPreviousCardsThisTurn(matchState) {
  const turnState = ensureTurnState(matchState);
  return [
    ...turnState.cardsPlayed,
    ...(matchState.combatChain?.attackHistory ?? [])
  ];
}

function getOnHitEffects(sourceCard) {
  return (sourceCard?.effects ?? []).filter((effect) => {
    return effect?.timing === "hit"
      || effect?.trigger === "on-hit"
      || effect?.type === "on-hit"
      || effect?.tag === "on-hit";
  });
}

function applyDiscreteOnHitEffect(matchState, effect, event) {
  const defenderId = event.target ?? event.payload?.defender;
  const attackerId = event.payload?.attacker ?? getControllerId(matchState, event.source);
  const defender = getPlayer(matchState, defenderId);
  const attacker = getPlayer(matchState, attackerId);

  if (typeof effect.resolution === "function") {
    effect.resolution(matchState, effect, event);
    return;
  }

  switch (effect.action) {
    case "discard": {
      const amount = effect.amount ?? 1;
      if (defender) {
        defender.hand = defender.hand ?? [];
        defender.graveyard = defender.graveyard ?? [];
        defender.graveyard.push(...defender.hand.splice(0, amount));
      }
      break;
    }
    case "draw": {
      const amount = effect.amount ?? 1;
      if (attacker) {
        attacker.hand = attacker.hand ?? [];
        attacker.deck = attacker.deck ?? [];
        for (let index = 0; index < amount && attacker.deck.length > 0; index += 1) {
          attacker.hand.push(attacker.deck.shift());
        }
      }
      break;
    }
    case "gain-life": {
      if (attacker) {
        attacker.life = (attacker.life ?? 0) + (effect.amount ?? 1);
      }
      break;
    }
    default:
      matchState.pendingOnHitEffects = matchState.pendingOnHitEffects ?? [];
      matchState.pendingOnHitEffects.push({ effect, event });
  }
}

export function findTagDefinition(value) {
  const normalized = normalize(value);
  return TAG_DEFINITIONS.find((tag) => {
    return tag.id === normalized
      || normalize(tag.name) === normalized
      || tag.aliases.some((alias) => normalize(alias) === normalized);
  }) ?? null;
}

export function extractTextTags(text = "") {
  const lowerText = text.toLowerCase();
  return TAG_DEFINITIONS.filter((tag) => {
    return tag.aliases.some((alias) => lowerText.includes(alias.toLowerCase()))
      || lowerText.includes(tag.name.toLowerCase());
  });
}

export function getCardTagBindings(card) {
  const bindings = [];

  for (const tag of extractTextTags(`${card?.text ?? ""} ${card?.effect ?? ""}`)) {
    bindings.push(new TagBindingEntity({
      cardId: card.id,
      tagId: tag.id,
      source: TAG_SOURCES.text,
      value: tag.name
    }));
  }

  for (const rawTag of [...(card?.keywords ?? []), ...(card?.tags ?? [])]) {
    const tag = findTagDefinition(rawTag?.name ?? rawTag);
    if (tag) {
      bindings.push(new TagBindingEntity({
        cardId: card.id,
        tagId: tag.id,
        source: TAG_SOURCES.keyword,
        value: rawTag
      }));
    }
  }

  const borderTag = findTagDefinition(card?.borderTag);
  if (borderTag) {
    bindings.push(new TagBindingEntity({
      cardId: card.id,
      tagId: borderTag.id,
      source: TAG_SOURCES.border,
      value: card.borderTag
    }));
  }

  const booleanTags = [
    ["goAgain", "go-again"],
    ["dominate", "dominate"],
    ["overpower", "overpower"],
    ["reload", "reload"],
    ["temper", "temper"]
  ];

  for (const [property, tagId] of booleanTags) {
    if (card?.[property]) {
      bindings.push(new TagBindingEntity({
        cardId: card.id,
        tagId,
        source: TAG_SOURCES.explicit,
        value: property
      }));
    }
  }

  return bindings.filter((binding, index, list) => {
    return index === list.findIndex((candidate) => (
      candidate.cardId === binding.cardId
      && candidate.tagId === binding.tagId
      && candidate.source === binding.source
    ));
  });
}

export function createKeywordEntities() {
  return TAG_DEFINITIONS.map((tag) => new KeywordEntity({
    id: tag.id,
    name: tag.name,
    description: tag.description,
    timing: tag.timing,
    stackable: tag.stackable,
    ruleText: tag.ruleText
  }));
}

export function createTagEffects(card) {
  return getCardTagBindings(card).map((binding) => {
    const tag = TAG_BY_ID[binding.tagId];

    return new EffectEntity({
      id: `${card.id}-${binding.tagId}-${binding.source}`,
      type: tag.category === TAG_CATEGORIES.restriction ? EFFECT_TYPES.static : EFFECT_TYPES.triggered,
      duration: tag.timing === "attack" || tag.timing === "reaction" ? "current_chain_link" : "instant",
      targets: ["self"],
      conditions: [],
      resolution: (matchState, effect, event = {}) => resolveTagEffect(binding.tagId, matchState, card, event)
    });
  });
}

export function createTagTriggers(card) {
  return getCardTagBindings(card)
    .map((binding) => {
      switch (binding.tagId) {
        case "go-again":
          return new TriggerEntity({
            event: GAME_EVENTS.onChainLinkResolved,
            condition: (event) => cardMatchesSource(event, card),
            effect: createTagEffects(card).find((effect) => effect.id.includes("go-again")),
            optional: false
          });
        case "dominate":
        case "overpower":
        case "combo":
          return new TriggerEntity({
            event: GAME_EVENTS.onAttack,
            condition: (event) => cardMatchesSource(event, card),
            effect: createTagEffects(card).find((effect) => effect.id.includes(binding.tagId)),
            optional: false
          });
        case "on-hit":
          return new TriggerEntity({
            event: GAME_EVENTS.onHit,
            condition: (event) => cardMatchesSource(event, card) && (event.payload?.damageDealt ?? 0) > 0,
            effect: createTagEffects(card).find((effect) => effect.id.includes("on-hit")),
            optional: false
          });
        case "reload":
          return new TriggerEntity({
            event: GAME_EVENTS.onStackResolved,
            condition: (event) => cardMatchesSource(event, card),
            effect: createTagEffects(card).find((effect) => effect.id.includes("reload")),
            optional: true
          });
        case "temper":
          return new TriggerEntity({
            event: GAME_EVENTS.onEquipmentDefended,
            condition: (event) => cardMatchesSource(event, card),
            effect: createTagEffects(card).find((effect) => effect.id.includes("temper")),
            optional: false
          });
        default:
          return null;
      }
    })
    .filter(Boolean);
}

export function resolveTagEffect(tagId, matchState, sourceCard, event = {}) {
  const controllerId = getControllerId(matchState, sourceCard, event.payload?.controller);
  const link = matchState.combatChain?.currentLink ?? event.payload?.combatLink ?? null;

  switch (tagId) {
    case "go-again":
      gainActionPoint(matchState, controllerId, 1);
      return { ok: true, actionPointsGained: 1 };
    case "dominate":
      if (link) {
        link.defenseRestrictions = {
          ...(link.defenseRestrictions ?? {}),
          maxCardsFromHand: 1
        };
      }
      return { ok: true, maxCardsFromHand: 1 };
    case "overpower":
      if (link) {
        link.reactionRestrictions = {
          ...(link.reactionRestrictions ?? {}),
          defenseReactionsFromHand: false
        };
      }
      return { ok: true, defenseReactionsFromHand: false };
    case "on-hit":
      getOnHitEffects(sourceCard).forEach((effect) => applyDiscreteOnHitEffect(matchState, effect, event));
      return { ok: true, effectsResolved: getOnHitEffects(sourceCard).length };
    case "combo": {
      const requiredCardId = sourceCard.comboCondition?.cardId
        ?? sourceCard.comboCondition
        ?? sourceCard.comboWith;
      const comboActive = Boolean(requiredCardId && getPreviousCardsThisTurn(matchState).some((card) => {
        return (card?.id ?? card) === requiredCardId;
      }));

      sourceCard.comboActive = comboActive;
      if (link) {
        link.comboActive = comboActive;
      }
      return { ok: comboActive, comboActive };
    }
    case "reload":
      return { ok: true, cardsDrawn: drawToIntellect(matchState, controllerId) };
    case "temper": {
      const equipment = event.payload?.equipment ?? sourceCard;
      equipment.temperCounters = Math.max(0, (equipment.temperCounters ?? equipment.defense ?? 0) - 1);
      equipment.destroyed = equipment.temperCounters <= 0;
      return { ok: true, remainingTemper: equipment.temperCounters, destroyed: equipment.destroyed };
    }
    default:
      return { ok: false, reason: "unknown-tag" };
  }
}
