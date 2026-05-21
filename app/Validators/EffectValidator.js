import { createValidationResult } from "./ValidationResult";

export class EffectValidator {
  validate(effect, matchState = {}) {
    const errors = [];

    if (!effect) {
      errors.push("Efeito inexistente.");
    }

    (effect?.conditions ?? []).forEach((condition, index) => {
      const passed = typeof condition === "function" ? condition(matchState) : Boolean(condition);
      if (!passed) {
        errors.push(`Condicao ${index + 1} do efeito nao foi atendida.`);
      }
    });

    return createValidationResult(errors);
  }
}
