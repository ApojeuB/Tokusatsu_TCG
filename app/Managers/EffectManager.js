export class EffectManager {
  canResolve(effect, matchState) {
    return (effect.conditions ?? []).every((condition) => {
      return typeof condition === "function" ? condition(matchState) : Boolean(condition);
    });
  }

  resolve(effect, matchState, event = null) {
    if (!this.canResolve(effect, matchState)) {
      return false;
    }

    if (typeof effect.resolution === "function") {
      effect.resolution(matchState, effect, event);
    }

    return true;
  }

  applyContinuousEffects(matchState) {
    const effects = matchState.continuousEffects ?? [];
    effects.forEach((effect) => {
      (effect.modifiers ?? []).forEach((modifier) => {
        if (typeof modifier === "function") {
          modifier(matchState, effect);
        }
      });
    });
    return matchState;
  }
}
