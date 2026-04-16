export class FinalizerController {
  constructor(gameController) {
    this.gameController = gameController;
  }

  evaluateCondition(condition, player, opponent) {
    try {
      const evaluator = new Function('player', 'opponent', `return (${condition});`);
      return Boolean(evaluator(player, opponent));
    } catch (error) {
      return false;
    }
  }

  checkAndTriggerFinalizer() {
    const state = this.gameController.gameState;
    const player = state.currentPlayer();
    const opponent = state.opponentPlayer();

    if (!opponent.commander.isVulnerable()) {
      return { canUse: false, reason: 'Oponente ainda não está vulnerável.' };
    }

    if (player.commander.finalizerUsed) {
      return { canUse: false, reason: 'Finalizador já foi usado.' };
    }

    const conditionMet = this.evaluateCondition(
      player.commander.finalizerCondition,
      player,
      opponent
    );

    return conditionMet
      ? { canUse: true, reason: 'Finalizador disponível.' }
      : { canUse: false, reason: 'Condição do finalizador não foi cumprida.' };
  }

  useFinalizer() {
    const check = this.checkAndTriggerFinalizer();
    if (!check.canUse) return { success: false, message: check.reason };

    const state = this.gameController.gameState;
    const player = state.currentPlayer();
    player.commander.finalizerUsed = true;
    state.winner = player.id;
    state.addLog(`${player.commander.finalizerName} foi ativado com sucesso.`);
    this.gameController.notify();
    return { success: true, message: `${player.name} venceu com ${player.commander.finalizerName}!` };
  }
}
