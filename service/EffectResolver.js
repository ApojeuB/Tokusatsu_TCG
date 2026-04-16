export class EffectResolver {
  static onUnitDestroyed(player, unit) {
    if (unit.tags?.includes('GENERATOR')) {
      player.gainImpulse(1);
      return `${player.name} ganhou 1 Impulso por ${unit.name}.`;
    }
    return null;
  }

  static onPreparationPhase(player) {
    const logs = [];

    player.field.forEach((unit) => {
      if (unit.tags?.includes('ENGINE')) {
        if (unit.tags.includes('KAIJU')) {
          unit.addMarker(1);
          unit.currentPower += 1;
          unit.currentDefense += 1;
          logs.push(`${unit.name} recebeu 1 marcador de crescimento.`);
        } else {
          player.gainImpulse(1);
          logs.push(`${unit.name} gerou 1 Impulso.`);
        }
      }
    });

    return logs;
  }
}
