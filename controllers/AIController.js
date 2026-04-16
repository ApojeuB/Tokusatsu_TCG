export class AIController {
  constructor(gameController, combatController, finalizerController) {
    this.gameController = gameController;
    this.combatController = combatController;
    this.finalizerController = finalizerController;
  }

  playTurn() {
    const state = this.gameController.gameState;
    const ai = state.currentPlayer();
    const player = state.opponentPlayer();

    const finalizerCheck = this.finalizerController.checkAndTriggerFinalizer();
    if (finalizerCheck.canUse) {
      return this.finalizerController.useFinalizer();
    }

    this.playMainPhase(ai, player);
    state.phase = 'combat';
    this.playCombatPhase(ai, player);
    this.gameController.endTurn();
    return { success: true };
  }

  playMainPhase(ai, player) {
    const actionableCards = [...ai.hand];

    actionableCards.forEach((card) => {
      if (card.type === 'action' && ai.impulse >= card.cost && player.field.length) {
        this.gameController.playCard(card.id);
        return;
      }

      if (card.type === 'unit' && ai.impulse >= card.cost) {
        const shouldPlayGuard = card.tags?.includes('GUARD') && player.field.some((unit) => unit.canAttack);
        const shouldPlayShocker = card.tags?.includes('SHOCKER');
        if (shouldPlayGuard || shouldPlayShocker || ai.impulse > 0) {
          this.gameController.playCard(card.id);
        }
      }
    });
  }

  playCombatPhase(ai, player) {
    const enemyGuards = player.field.filter((unit) => unit.isGuard());

    ai.field.forEach((unit) => {
      if (unit.summoningSickness || !unit.canAttack) return;

      if (enemyGuards.length) {
        const preferredGuard = enemyGuards.find((guard) => unit.currentPower >= guard.currentDefense);
        const target = preferredGuard || enemyGuards[0];
        this.combatController.declareAttack(unit.id, target.id, false);
        return;
      }

      const favorableTrade = player.field.find(
        (enemy) =>
          unit.currentPower >= enemy.currentDefense && unit.currentDefense > enemy.currentPower
      );

      if (favorableTrade) {
        this.combatController.declareAttack(unit.id, favorableTrade.id, false);
      } else {
        this.combatController.declareAttack(unit.id, null, true);
      }
    });
  }
}
