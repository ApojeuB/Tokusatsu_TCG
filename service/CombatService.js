export class CombatService {
  static resolveUnitCombat(attacker, blocker) {
    const attackBonus = attacker.isPressure() ? 1 : 0;
    const attackerDamage = attacker.currentPower + attackBonus;
    const blockerDamage = blocker.currentPower;

    const attackerDies = attacker.currentDefense - blockerDamage <= 0;
    const blockerDies = blocker.currentDefense - attackerDamage <= 0;

    return {
      attackerDamage,
      blockerDamage,
      attackerDies,
      blockerDies,
    };
  }
}
