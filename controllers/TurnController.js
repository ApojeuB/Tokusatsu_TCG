import { EffectResolver } from '../service/EffectResolver';

export class TurnController {
  constructor(gameController) {
    this.gameController = gameController;
  }

  startTurn() {
    const state = this.gameController.gameState;
    const player = state.currentPlayer();
    const ignoreSummoningSickness = player.commander.id === 'ultraman';

    player.startTurn();
    player.gainImpulse(1);
    player.field.forEach((unit) => unit.startTurn({ ignoreSummoningSickness }));
    EffectResolver.onPreparationPhase(player).forEach((message) => state.addLog(message));
    state.phase = 'draw';
    state.addLog(`${player.name} entrou na fase de preparação.`);
  }

  drawPhase() {
    const state = this.gameController.gameState;
    const player = state.currentPlayer();
    const card = player.drawCard();
    state.addLog(card ? `${player.name} comprou ${card.name}.` : `${player.name} não tinha cartas para comprar.`);
    state.phase = 'main';
  }

  endTurn() {
    const state = this.gameController.gameState;
    state.phase = 'preparation';
    state.turn = state.turn === 'player' ? 'opponent' : 'player';
    if (state.turn === 'player') {
      state.turnNumber += 1;
    }
    state.addLog('Turno encerrado.');
    this.gameController.notify();
  }
}
