import { createValidationResult } from "./ValidationResult";

export class BlockValidator {
  validate({ blockCard, combatLink } = {}) {
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

    return createValidationResult(errors);
  }
}
