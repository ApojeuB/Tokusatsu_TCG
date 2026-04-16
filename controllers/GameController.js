import CardMasterService from '../service/CardMasterService';
import { DeckService } from '../service/DeckService';
import { GameState } from '../entities/GameState';
import { Player } from '../entities/Player';
import { TurnController } from './TurnController';

export class GameController {
  constructor() {
    this.gameState = null;
    this.listeners = [];
    this.turnController = new TurnController(this);
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((entry) => entry !== listener);
    };
  }

  notify() {
    this.listeners.forEach((listener) => listener(this.gameState));
  }

  async initGame(playerCommanderId = 'ichigo', opponentCommanderId = 'shocker') {
    await CardMasterService.initialize();

    const playerCommander = CardMasterService.getCommanderById(playerCommanderId);
    const opponentCommander = CardMasterService.getCommanderById(opponentCommanderId);
    const playerDeck = DeckService.shuffle(await DeckService.loadDeck('ichigo_deck'));
    const opponentDeck = DeckService.shuffle(await DeckService.loadDeck('shocker_deck'));

    const player = new Player({
      id: 'player',
      name: playerCommander.name,
      commander: playerCommander,
      deck: playerDeck,
      impulse: playerCommander.startingImpulse,
    });

    const opponent = new Player({
      id: 'opponent',
      name: opponentCommander.name,
      commander: opponentCommander,
      deck: opponentDeck,
      impulse: opponentCommander.startingImpulse,
    });

    this.gameState = new GameState({
      player,
      opponent,
    });

    for (let i = 0; i < 5; i += 1) {
      player.drawCard();
      opponent.drawCard();
    }

    this.gameState.addLog('A batalha começou.');
    this.turnController.startTurn();
    this.turnController.drawPhase();
    this.notify();
    return this.gameState;
  }

  playCard(cardId) {
    const state = this.gameState;
    const player = state.currentPlayer();
    const card = player.hand.find((entry) => entry.id === cardId);
    if (!card) return { success: false, error: 'Carta não encontrada na mão.' };
    if (state.phase !== 'main') return { success: false, error: 'Só é possível jogar cartas na fase principal.' };

    let adjustedCost = card.cost;
    if (card.tags?.includes('RIDER') && player.commander.id === 'ichigo') {
      adjustedCost = Math.max(0, adjustedCost - 1);
    }
    if (card.tags?.includes('ULTRAMAN') && player.commander.id === 'ultraman') {
      adjustedCost += 1;
    }

    if (!player.spendImpulse(adjustedCost)) {
      return { success: false, error: 'Impulso insuficiente.' };
    }

    const playedCard = player.removeCardFromHand(cardId);
    if (!playedCard) return { success: false, error: 'Falha ao remover a carta da mão.' };

    if (playedCard.type === 'unit') {
      if (player.commander.id === 'ultraman' && playedCard.tags?.includes('ULTRAMAN')) {
        playedCard.summoningSickness = false;
      }
      player.summonUnit(playedCard);
    } else if (playedCard.type === 'action') {
      this.resolveActionCard(playedCard, player, state.opponentPlayer());
      player.sendCardToGrave(playedCard);
    } else {
      player.sendCardToGrave(playedCard);
    }

    if (playedCard.name.toLowerCase().includes('rider') && player.commander.id === 'ichigo') {
      player.gainImpulse(1);
    }

    state.addLog(`${player.name} jogou ${playedCard.name}.`);
    this.notify();
    return { success: true, card: playedCard };
  }

  resolveActionCard(card, player, opponent) {
    if (card.id === 'rider_punch_001' || card.id === 'shocker_massacre_001') {
      const target = opponent.field[0];
      if (!target) return;
      target.currentDefense -= 2;
      if (target.currentDefense <= 0) {
        opponent.sendUnitToGrave(target.id);
      }
      return;
    }

    if (card.id === 'shocker_ritual_001') {
      const host = player.field.find((unit) => unit.tags?.includes('SHOCKER'));
      const materials = player.grave.filter((graveCard) => graveCard.tags?.includes('SHOCKER')).slice(0, 2);
      if (!host || !materials.length) return;
      materials.forEach((material) => host.addMaterial(material));
    }
  }

  moveToPhase(phase) {
    this.gameState.phase = phase;
    this.notify();
  }

  beginNextTurn() {
    this.turnController.startTurn();
    this.turnController.drawPhase();
    this.notify();
  }

  endTurn() {
    this.turnController.endTurn();
  }
}
