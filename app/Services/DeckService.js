import { DeckRepository } from "../Repositories/DeckRepository";
import { DeckValidator } from "../Validators/DeckValidator";

const deckValidator = new DeckValidator();

export class DeckService {
  static validateDeck(deckSections, catalog, config) {
    return deckValidator.validate(deckSections, catalog, config);
  }

  static getDecks() {
    return DeckRepository.getDecks();
  }

  static getDeckById(deckId) {
    return DeckRepository.getDeckById(deckId);
  }

  static saveDeck(deck) {
    return DeckRepository.saveDeck(deck);
  }

  static getDeckCount(deckSections, section = "main") {
    return (deckSections?.[section] ?? []).reduce((total, entry) => total + (entry.quantity ?? 1), 0);
  }
}
