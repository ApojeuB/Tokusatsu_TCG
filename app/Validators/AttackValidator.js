import { createValidationResult } from "./ValidationResult";

export class AttackValidator {
  validate({ card, attacker, defender, resources = 0 } = {}, matchState = {}) {
    const errors = [];

    if (!card) {
      errors.push("Ataque sem carta.");
    }

    if (!attacker) {
      errors.push("Ataque sem atacante.");
    }

    if (!defender) {
      errors.push("Ataque sem defensor.");
    }

    if ((card?.cost ?? 0) > resources) {
      errors.push("Recursos insuficientes para declarar o ataque.");
    }

    if (matchState.combatChain?.currentLink && !matchState.combatChain.currentLink.resolved) {
      errors.push("Ja existe um elo de combate pendente.");
    }

    return createValidationResult(errors);
  }
}
