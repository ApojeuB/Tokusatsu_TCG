import { createValidationResult } from "./ValidationResult";

export class BlockValidator {
  validate({ blockCard, combatLink, sourceZone = blockCard?.sourceZone ?? "hand" } = {}) {
    const errors = [];

    if (!combatLink) {
      errors.push("Nao ha ataque atual para bloquear.");
    }

    if (!blockCard) {
      errors.push("Bloqueio sem carta.");
    }

    if ((blockCard?.defense ?? 0) <= 0) {
      errors.push("Esta carta nao possui defesa valida.");
    }

    if (combatLink?.resolved) {
      errors.push("O elo de combate ja foi resolvido.");
    }

    const cardsFromHand = (combatLink?.reactions ?? []).filter((reaction) => {
      return reaction.type === "block" && reaction.sourceZone === "hand";
    }).length;
    const maxCardsFromHand = combatLink?.defenseRestrictions?.maxCardsFromHand;

    if (sourceZone === "hand" && maxCardsFromHand !== undefined && cardsFromHand >= maxCardsFromHand) {
      errors.push(`Este ataque limita a defesa a ${maxCardsFromHand} carta(s) da mao.`);
    }

    const cardType = blockCard?.cardType ?? blockCard?.type;
    if (
      sourceZone === "hand"
      && cardType === "Defense Reaction"
      && combatLink?.reactionRestrictions?.defenseReactionsFromHand === false
    ) {
      errors.push("Este ataque nao permite Defense Reactions da mao.");
    }

    return createValidationResult(errors);
  }
}
