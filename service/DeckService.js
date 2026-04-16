import { shuffle as shuffleArray } from '../utils/random';
import CardMasterService from './CardMasterService';

const defaultDecks = require('../data/decks/prebuilt.json');

export class DeckService {
  static async loadDeck(deckId) {
    await CardMasterService.initialize();
    const deckRecord = defaultDecks.find((deck) => deck.id === deckId);
    if (!deckRecord) return [];

    return deckRecord.cardIds
      .map((cardId) => CardMasterService.getCardById(cardId))
      .filter(Boolean)
      .map((card) => CardMasterService.cloneForGameplay(card));
  }

  static shuffle(deck) {
    return shuffleArray(deck);
  }

  static validateDeck(deck) {
    const size = deck.cardIds?.length ?? 0;
    return size >= 30 && size <= 60;
  }
}
