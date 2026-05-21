import { createValidationResult } from "./ValidationResult";

export class PriorityValidator {
  validate(playerId, matchState = {}) {
    const errors = [];

    if (!matchState.priorityPlayer) {
      errors.push("Nao existe jogador com prioridade.");
    }

    if (matchState.priorityPlayer && matchState.priorityPlayer !== playerId) {
      errors.push("Este jogador nao possui prioridade.");
    }

    return createValidationResult(errors);
  }
}
