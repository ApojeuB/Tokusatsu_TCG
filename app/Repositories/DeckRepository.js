import { DeckEntity, cloneDeckSections, createEmptyDeckSections } from "../Entities/DeckEntity";
import { executeSql, getAll, getFirst, runTransaction } from "../DataBase";

const ACTIVE_DECK_META_KEY = "active_deck_id";

function normalizeDeckSections(deck) {
  return cloneDeckSections(deck ?? createEmptyDeckSections());
}

function rowsToDeck(deckRow, cardRows = []) {
  const deck = createEmptyDeckSections();

  cardRows.forEach((row) => {
    if (!deck[row.section]) {
      deck[row.section] = [];
    }

    deck[row.section].push({
      cardId: row.cardId,
      quantity: row.quantity
    });
  });

  return new DeckEntity({
    id: deckRow.id,
    ownerUserId: deckRow.ownerUserId,
    name: deckRow.name,
    createdAt: deckRow.createdAt,
    updatedAt: deckRow.updatedAt,
    deck
  });
}

async function getDeckCards(deckId) {
  return getAll(
    `SELECT deckId, section, cardId, quantity
     FROM deck_cards
     WHERE deckId = ?
     ORDER BY section ASC, cardId ASC`,
    [deckId]
  );
}

async function replaceDeckCards(db, deckId, deck) {
  const sections = normalizeDeckSections(deck);
  await db.runAsync("DELETE FROM deck_cards WHERE deckId = ?", [deckId]);

  for (const section of Object.keys(sections)) {
    for (const entry of sections[section]) {
      if (!entry.cardId || entry.quantity <= 0) {
        continue;
      }

      await db.runAsync(
        `INSERT INTO deck_cards (deckId, section, cardId, quantity)
         VALUES (?, ?, ?, ?)`,
        [deckId, section, entry.cardId, entry.quantity]
      );
    }
  }
}

export const DeckRepository = {
  async getDecks() {
    const deckRows = await getAll("SELECT * FROM decks ORDER BY updatedAt DESC, name COLLATE NOCASE ASC");
    const decks = [];

    for (const deckRow of deckRows) {
      decks.push(rowsToDeck(deckRow, await getDeckCards(deckRow.id)));
    }

    return decks;
  },

  async getDeckById(deckId) {
    const deckRow = await getFirst("SELECT * FROM decks WHERE id = ?", [deckId]);

    if (!deckRow) {
      return null;
    }

    return rowsToDeck(deckRow, await getDeckCards(deckId));
  },

  async createDeck(deck) {
    await runTransaction(async (db) => {
      await db.runAsync(
        `INSERT INTO decks (id, ownerUserId, name, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?)`,
        [deck.id, deck.ownerUserId, deck.name, deck.createdAt, deck.updatedAt]
      );

      await replaceDeckCards(db, deck.id, deck.deck);
    });

    return deck;
  },

  async saveDeck(deck) {
    await runTransaction(async (db) => {
      await db.runAsync(
        `INSERT INTO decks (id, ownerUserId, name, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
          ownerUserId = excluded.ownerUserId,
          name = excluded.name,
          updatedAt = excluded.updatedAt`,
        [deck.id, deck.ownerUserId, deck.name, deck.createdAt, deck.updatedAt]
      );

      await replaceDeckCards(db, deck.id, deck.deck);
    });

    return deck;
  },

  async deleteDeck(deckId) {
    await executeSql("DELETE FROM decks WHERE id = ?", [deckId]);
  },

  async setActiveDeckId(deckId) {
    const timestamp = new Date().toISOString();
    await executeSql(
      `INSERT INTO app_meta (key, value, createdAt, updatedAt)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET
        value = excluded.value,
        updatedAt = excluded.updatedAt`,
      [ACTIVE_DECK_META_KEY, deckId, timestamp, timestamp]
    );
  },

  async getActiveDeckId() {
    const row = await getFirst("SELECT value FROM app_meta WHERE key = ?", [ACTIVE_DECK_META_KEY]);
    return row?.value ?? null;
  },

  async importDecks(decks = [], activeDeckId = null) {
    await runTransaction(async (db) => {
      for (const deck of decks) {
        await db.runAsync(
          `INSERT OR IGNORE INTO decks (id, ownerUserId, name, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?)`,
          [deck.id, deck.ownerUserId, deck.name, deck.createdAt, deck.updatedAt]
        );
        await replaceDeckCards(db, deck.id, deck.deck);
      }

      if (activeDeckId && decks.some((deck) => deck.id === activeDeckId)) {
        const timestamp = new Date().toISOString();
        await db.runAsync(
          `INSERT INTO app_meta (key, value, createdAt, updatedAt)
           VALUES (?, ?, ?, ?)
           ON CONFLICT(key) DO UPDATE SET
            value = excluded.value,
            updatedAt = excluded.updatedAt`,
          [ACTIVE_DECK_META_KEY, activeDeckId, timestamp, timestamp]
        );
      }
    });
  }
};
