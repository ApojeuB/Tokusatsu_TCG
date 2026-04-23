import { useEffect, useMemo, useState } from "react";
import { createContext, useContext } from "react";
import { DeckBuilderController } from "../Controllers/DeckBuilderController";

const DeckBuilderContext = createContext(null);
const STORAGE_KEY = "tokusatsu-chronicle.deckbuilder";

function createEmptyDeck() {
  return {
    main: [],
    field: [],
    commander: []
  };
}

function cloneDeck(deck) {
  return {
    main: deck.main.map((entry) => ({ ...entry })),
    field: deck.field.map((entry) => ({ ...entry })),
    commander: deck.commander.map((entry) => ({ ...entry }))
  };
}

function getStorage() {
  if (typeof globalThis === "undefined" || !globalThis.localStorage) {
    return null;
  }

  return globalThis.localStorage;
}

function getSectionCount(sectionEntries) {
  return sectionEntries.reduce((total, entry) => total + entry.quantity, 0);
}

export function DeckBuilderProvider({ children }) {
  const catalog = useMemo(() => DeckBuilderController.getCatalog(), []);
  const cardMap = useMemo(() => {
    return new Map(catalog.map((card) => [card.id, card]));
  }, [catalog]);

  const [currentDeck, setCurrentDeck] = useState(createEmptyDeck);
  const [savedDeck, setSavedDeck] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const storage = getStorage();

    if (!storage) {
      setHydrated(true);
      return;
    }

    try {
      const raw = storage.getItem(STORAGE_KEY);

      if (raw) {
        const parsed = JSON.parse(raw);

        if (parsed.currentDeck) {
          setCurrentDeck(cloneDeck(parsed.currentDeck));
        }

        if (parsed.savedDeck) {
          setSavedDeck(cloneDeck(parsed.savedDeck));
        }
      }
    } catch {
      setCurrentDeck(createEmptyDeck());
      setSavedDeck(null);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    const storage = getStorage();

    if (!storage) {
      return;
    }

    storage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        currentDeck,
        savedDeck
      })
    );
  }, [currentDeck, hydrated, savedDeck]);

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

  const addCardToSection = (section, cardId) => {
    let added = false;

    setCurrentDeck((current) => {
      const nextDeck = cloneDeck(current);
      const entries = nextDeck[section];

      if (!entries) {
        return current;
      }

      if (section === "main" && getSectionCount(entries) >= 60) {
        return current;
      }

      const existing = entries.find((entry) => entry.cardId === cardId);

      if (existing) {
        existing.quantity += 1;
      } else {
        entries.push({ cardId, quantity: 1 });
      }

      added = true;
      return nextDeck;
    });

    return added;
  };

  const removeCardFromSection = (section, cardId) => {
    let removed = false;

    setCurrentDeck((current) => {
      const nextDeck = cloneDeck(current);
      const entries = nextDeck[section];

      if (!entries) {
        return current;
      }

      const existing = entries.find((entry) => entry.cardId === cardId);

      if (!existing) {
        return current;
      }

      existing.quantity -= 1;

      if (existing.quantity <= 0) {
        nextDeck[section] = entries.filter((entry) => entry.cardId !== cardId);
      }

      removed = true;
      return nextDeck;
    });

    return removed;
  };

  const resetDeck = () => {
    setCurrentDeck(createEmptyDeck());
  };

  const saveDeck = () => {
    setSavedDeck(cloneDeck(currentDeck));
  };

  const loadDeck = () => {
    if (!savedDeck) {
      return false;
    }

    setCurrentDeck(cloneDeck(savedDeck));
    return true;
  };

  return (
    <DeckBuilderContext.Provider
      value={{
        catalog,
        currentDeck,
        expandedSections,
        totals,
        hasSavedDeck: Boolean(savedDeck),
        isMainDeckReady: totals.main === 60,
        addCardToSection,
        removeCardFromSection,
        resetDeck,
        saveDeck,
        loadDeck
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
