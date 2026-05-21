export class RulesEngineEntity {
  constructor({
    validators = {},
    managers = {}
  } = {}) {
    this.validators = validators;
    this.managers = managers;
  }

  validateAction(action, matchState) {
    return this.validators.action?.validate(action, matchState) ?? { ok: true, errors: [] };
  }

  validateAttack(attack, matchState) {
    return this.validators.attack?.validate(attack, matchState) ?? { ok: true, errors: [] };
  }

  validateBlock(block, matchState) {
    return this.validators.block?.validate(block, matchState) ?? { ok: true, errors: [] };
  }

  validatePriority(playerId, matchState) {
    return this.validators.priority?.validate(playerId, matchState) ?? { ok: true, errors: [] };
  }

  resolveCombat(matchState) {
    return this.managers.combat?.resolveCombat(matchState) ?? matchState;
  }

  resolveStack(matchState) {
    return this.managers.stack?.resolveStack(matchState) ?? matchState;
  }

  checkTriggers(event, matchState) {
    return this.managers.trigger?.checkTriggers(event, matchState) ?? [];
  }

  applyContinuousEffects(matchState) {
    return this.managers.effect?.applyContinuousEffects(matchState) ?? matchState;
  }
}
