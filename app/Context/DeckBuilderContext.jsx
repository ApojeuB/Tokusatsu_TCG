import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { DeckBuilderController } from "../Controllers/DeckBuilderController";
import { initDatabase } from "../DataBase";
import { DeckEntity, cloneDeckSections, createDeckEntity, createEmptyDeckSections } from "../Entities/DeckEntity";
import { DeckRepository } from "../Repositories/DeckRepository";
import { ensureDefaultDeck, importLegacyPersistence } from "../Repositories/LegacyStorageImporter";

const DeckBuilderContext = createContext(null);
const DEFAULT_DECK_NAME = "Deck inicial";

function getSectionCount(sectionEntries = []) {
  return sectionEntries.reduce((total, entry) => total + entry.quantity, 0);
}

function createDefaultDeck() {
  return createDeckEntity({
    ownerUserId: null,
    name: DEFAULT_DECK_NAME
  });
}

function withUpdatedAt(deck, nextDeckSections = deck.deck) {
  return new DeckEntity({
    ...deck,
    updatedAt: new Date().toISOString(),
    deck: cloneDeckSections(nextDeckSections)
  });
}

export function DeckBuilderProvider({ children }) {
  const catalog = useMemo(() => DeckBuilderController.getCatalog(), []);
  const cardMap = useMemo(() => new Map(catalog.map((card) => [card.id, card])), [catalog]);

  const [decks, setDecks] = useState([]);
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  const reloadDecks = async () => {
    const storedDecks = await ensureDefaultDeck();
    const storedActiveDeckId = await DeckRepository.getActiveDeckId();
    const nextActiveDeckId = storedDecks.some((deck) => deck.id === storedActiveDeckId)
      ? storedActiveDeckId
      : storedDecks[0]?.id ?? null;

    if (nextActiveDeckId && nextActiveDeckId !== storedActiveDeckId) {
      await DeckRepository.setActiveDeckId(nextActiveDeckId);
    }

    setDecks(storedDecks);
    setActiveDeckId(nextActiveDeckId);
    return { decks: storedDecks, activeDeckId: nextActiveDeckId };
  };

  useEffect(() => {
    let cancelled = false;

    async function hydrateDecks() {
      try {
        await initDatabase();
        await importLegacyPersistence();

        if (!cancelled) {
          await reloadDecks();
        }
      } catch {
        const fallbackDeck = createDefaultDeck();

        if (!cancelled) {
          setDecks([fallbackDeck]);
          setActiveDeckId(fallbackDeck.id);
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    }

    hydrateDecks();

    return () => {
      cancelled = true;
    };
  }, []);

  const activeDeck = useMemo(() => {
    return decks.find((deck) => deck.id === activeDeckId) ?? decks[0] ?? null;
  }, [activeDeckId, decks]);

  const currentDeck = activeDeck?.deck ?? createEmptyDeckSections();

  const totals = useMemo(() => {
    return {
      main: getSectionCount(currentDeck.main),
      field: getSectionCount(currentDeck.field),
      commander: getSectionCount(currentDeck.commander)
    };
  }, [currentDeck]);

  const expandedSections = useMemo(() => {
    const expand = (sectionEntries) => {
      return sectionEntries.flatMap((entry) => {
        const card = cardMap.get(entry.cardId);

        if (!card) {
          return [];
        }

        return Array.from({ length: entry.quantity }, () => card);
      });
    };

    return {
      main: expand(currentDeck.main),
      field: expand(currentDeck.field),
      commander: expand(currentDeck.commander)
    };
  }, [cardMap, currentDeck]);

  const replaceDeckInState = (deck) => {
    setDecks((current) => current.map((item) => (item.id === deck.id ? deck : item)));
  };

  const createDeck = async (name) => {
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return null;
    }

    const nextDeck = createDeckEntity({
      ownerUserId: null,
      name: trimmedName
    });

    await DeckRepository.createDeck(nextDeck);
    await DeckRepository.setActiveDeckId(nextDeck.id);
    setDecks((current) => [nextDeck, ...current]);
    setActiveDeckId(nextDeck.id);
    return nextDeck.id;
  };

  const openDeck = async (deckId) => {
    const deckExists = decks.some((deck) => deck.id === deckId) || Boolean(await DeckRepository.getDeckById(deckId));

    if (!deckExists) {
      return false;
    }

    await DeckRepository.setActiveDeckId(deckId);
    setActiveDeckId(deckId);
    return true;
  };

  const deleteDeck = async (deckId) => {
    await DeckRepository.deleteDeck(deckId);
    const nextDecks = decks.filter((deck) => deck.id !== deckId);

    if (!nextDecks.length) {
      const defaultDeck = createDefaultDeck();
      await DeckRepository.createDeck(defaultDeck);
      await DeckRepository.setActiveDeckId(defaultDeck.id);
      setDecks([defaultDeck]);
      setActiveDeckId(defaultDeck.id);
      return true;
    }

    if (activeDeckId === deckId) {
      await DeckRepository.setActiveDeckId(nextDecks[0].id);
      setActiveDeckId(nextDecks[0].id);
    }

    setDecks(nextDecks);
    return true;
  };

  const renameDeck = async (deckId, name) => {
    const trimmedName = name?.trim();

    if (!trimmedName) {
      return false;
    }

    const deck = decks.find((item) => item.id === deckId) ?? await DeckRepository.getDeckById(deckId);

    if (!deck) {
      return false;
    }

    const updatedDeck = withUpdatedAt(new DeckEntity({ ...deck, name: trimmedName }));
    await DeckRepository.saveDeck(updatedDeck);
    replaceDeckInState(updatedDeck);
    return true;
  };

  const updateActiveDeckSections = async (updater) => {
    if (!activeDeck) {
      return false;
    }

    const nextSections = updater(cloneDeckSections(activeDeck.deck));
    const updatedDeck = withUpdatedAt(activeDeck, nextSections);
    await DeckRepository.saveDeck(updatedDeck);
    replaceDeckInState(updatedDeck);
    return true;
  };

  const addCardToSection = async (section, cardId) => {
    const entries = currentDeck[section];

    if (!entries) {
      return false;
    }

    if (section === "main" && getSectionCount(entries) >= 60) {
      return false;
    }

    return updateActiveDeckSections((deck) => {
      const nextEntries = deck[section];
      const nextExisting = nextEntries.find((entry) => entry.cardId === cardId);

      if (nextExisting) {
        nextExisting.quantity += 1;
      } else {
        nextEntries.push({ cardId, quantity: 1 });
      }

      return deck;
    });
  };

  const removeCardFromSection = async (section, cardId) => {
    const entries = currentDeck[section];

    if (!entries || !entries.some((entry) => entry.cardId === cardId)) {
      return false;
    }

    return updateActiveDeckSections((deck) => {
      const nextEntries = deck[section];
      const existing = nextEntries.find((entry) => entry.cardId === cardId);

      if (!existing) {
        return deck;
      }

      existing.quantity -= 1;

      if (existing.quantity <= 0) {
        deck[section] = nextEntries.filter((entry) => entry.cardId !== cardId);
      }

      return deck;
    });
  };

  const resetDeck = async () => {
    return updateActiveDeckSections(() => createEmptyDeckSections());
  };

  const saveDeck = async () => {
    if (!activeDeck) {
      return false;
    }

    await DeckRepository.saveDeck(activeDeck);
    return true;
  };

  const loadDeck = async () => {
    await reloadDecks();
    return true;
  };

  return (
    <DeckBuilderContext.Provider
      value={{
        activeDeck,
        activeDeckId,
        addCardToSection,
        catalog,
        createDeck,
        currentDeck,
        decks,
        deleteDeck,
        expandedSections,
        hasActiveDeck: Boolean(activeDeck),
        hasSavedDeck: Boolean(activeDeck),
        hydrated,
        isMainDeckReady: totals.main === 60,
        loadDeck,
        openDeck,
        removeCardFromSection,
        renameDeck,
        resetDeck,
        saveDeck,
        totals
      }}
    >
      {children}
    </DeckBuilderContext.Provider>
  );
}

export function useDeckBuilder() {
  const context = useContext(DeckBuilderContext);

  if (!context) {
    throw new Error("useDeckBuilder must be used inside DeckBuilderProvider.");
  }

  return context;
}
