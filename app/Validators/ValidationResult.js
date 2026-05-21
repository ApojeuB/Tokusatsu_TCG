export function createValidationResult(errors = [], warnings = []) {
  return {
    ok: errors.length === 0,
    errors,
    warnings
  };
}
