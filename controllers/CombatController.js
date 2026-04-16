import { CombatService } from '../service/CombatService';
import { EffectResolver } from '../service/EffectResolver';

export class CombatController {
  constructor(gameController) {
    this.gameController = gameController;
  }

  declareAttack(attackerId, targetId = null, isDirectAttack = false) {
    const state = this.gameController.gameState;
    const attackerOwner = state.currentPlayer();
    const defenderOwner = state.opponentPlayer();
    const attacker = attackerOwner.field.find((unit) => unit.id === attackerId);

    if (!attacker) return { success: false, error: 'Atacante não encontrado.' };
    if (attacker.summoningSickness) return { success: false, error: 'Unidade com fadiga não pode atacar.' };
    if (!attacker.canAttack) return { success: false, error: 'Unidade já atacou neste turno.' };

    const guardUnits = defenderOwner.field.filter((unit) => unit.isGuard());
    if (guardUnits.length && isDirectAttack) {
      return { success: false, error: 'Existe uma unidade GUARD protegendo o comandante.' };
    }

    let blocker = null;
    if (guardUnits.length) {
      blocker = guardUnits.find((unit) => unit.id === targetId);
      if (!blocker) {
        return { success: false, error: 'Você deve atacar uma unidade GUARD primeiro.' };
      }
    } else if (!isDirectAttack && targetId) {
      blocker = defenderOwner.field.find((unit) => unit.id === targetId) || null;
    }

    const result = blocker
      ? this.resolveUnitCombat(attackerOwner, defenderOwner, attacker, blocker)
      : this.resolveDirectAttack(attacker, defenderOwner);

    attacker.canAttack = false;
    state.addLog(result.log);
    this.gameController.notify();
    return { success: true, result };
  }

  resolveUnitCombat(attackerOwner, defenderOwner, attacker, blocker) {
    const outcome = CombatService.resolveUnitCombat(attacker, blocker);
    attacker.currentDefense -= outcome.blockerDamage;
    blocker.currentDefense -= outcome.attackerDamage;

    if (outcome.attackerDies) {
      const deadAttacker = attackerOwner.sendUnitToGrave(attacker.id);
      const triggerLog = deadAttacker ? EffectResolver.onUnitDestroyed(attackerOwner, deadAttacker) : null;
      if (triggerLog) this.gameController.gameState.addLog(triggerLog);
    }

    if (outcome.blockerDies) {
      const deadBlocker = defenderOwner.sendUnitToGrave(blocker.id);
      const triggerLog = deadBlocker ? EffectResolver.onUnitDestroyed(defenderOwner, deadBlocker) : null;
      if (triggerLog) this.gameController.gameState.addLog(triggerLog);
    }

    return {
      isDirect: false,
      attackerDestroyed: outcome.attackerDies,
      blockerDestroyed: outcome.blockerDies,
      log: `${attacker.name} lutou contra ${blocker.name}.`,
    };
  }

  resolveDirectAttack(attacker, defenderOwner) {
    const damage = attacker.currentPower + (attacker.isPressure() ? 1 : 0);
    defenderOwner.commander.takeDamage(damage);
    return {
      isDirect: true,
      commanderDamage: damage,
      log: `${attacker.name} causou ${damage} de dano direto ao comandante.`,
    };
  }

  canAttackDirectly(opponentField) {
    return !opponentField.some((unit) => unit.isGuard());
  }
}
