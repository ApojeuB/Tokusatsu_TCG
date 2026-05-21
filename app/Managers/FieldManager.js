export class FieldManager {
  setField(matchState, campo) {
    matchState.field = campo;
    return campo;
  }

  clearField(matchState) {
    const previous = matchState.field;
    matchState.field = null;
    return previous;
  }

  getGlobalEffects(matchState) {
    return matchState.field?.globalEffects ?? [];
  }
}
