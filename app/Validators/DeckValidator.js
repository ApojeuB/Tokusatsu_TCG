import { FORMATS } from "../Rules/GameRules";
import { createValidationResult } from "./ValidationResult";

function countEntries(entries = []) {
  return entries.reduce((total, entry) => total + (entry.quantity ?? 1), 0);
}

export class DeckValidator {
  validate(deckSections, catalog = [], config = {}) {
    const format = FORMATS[config.format] ?? FORMATS.constructed;
    const deckSize = config.deckSize ?? format.deckSize;
    const maxCopies = config.maxCopies ?? format.maxCopies;
    const errors = [];
    const warnings = [];
    const main = deckSections?.main ?? [];
    const total = countEntries(main);
    const cardMap = new Map(catalog.map((card) => [card.id, card]));

    if (total !== deckSize) {
      errors.push(`Deck principal deve conter ${deckSize} cartas. Atual: ${total}.`);
    }

    main.forEach((entry) => {
      if ((entry.quantity ?? 0) > maxCopies) {
        errors.push(`Carta ${entry.cardId} excede o limite de ${maxCopies} copias.`);
      }

      const card = cardMap.get(entry.cardId);
      if (!card) {
        warnings.push(`Carta ${entry.cardId} nao existe no catalogo atual.`);
      }

      if (format.bannedCards?.includes(entry.cardId)) {
        errors.push(`Carta ${entry.cardId} esta banida no formato ${format.name}.`);
      }
    });

    return createValidationResult(errors, warnings);
  }
}
