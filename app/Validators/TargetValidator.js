import { createValidationResult } from "./ValidationResult";

export class TargetValidator {
  validate({ targets = [], required = 0, predicate = null } = {}) {
    const errors = [];

    if (targets.length < required) {
      errors.push(`Sao necessarios ${required} alvo(s).`);
    }

    if (predicate) {
      targets.forEach((target, index) => {
        if (!predicate(target)) {
          errors.push(`Alvo ${index + 1} invalido.`);
        }
      });
    }

    return createValidationResult(errors);
  }
}
