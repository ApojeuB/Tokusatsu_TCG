import { createValidationResult } from "./ValidationResult";

export class FormValidator {
  validate({ form, resources = 0, persona = null } = {}) {
    const errors = [];

    if (!form) {
      errors.push("Forma inexistente.");
    }

    if ((form?.transformationCost ?? 0) > resources) {
      errors.push("Recursos insuficientes para transformar.");
    }

    if (persona && form?.classRequirement && form.classRequirement !== persona.class) {
      errors.push("A persona nao cumpre o requisito de classe desta forma.");
    }

    return createValidationResult(errors);
  }
}
