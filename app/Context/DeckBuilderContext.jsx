import { useEffect, useMemo, useState } from "react";
import { createContext, useContext } from "react";
import { DeckBuilderController } from "../Controllers/DeckBuilderController";
import { DeckService } from "../Service/DeckService";
import { DeckEntity, createEmptyDeckSections } from "../Entities/DeckEntity";

const DeckBuilderContext = createContext(null);

function cloneDeck(deck) {
  return {
    main: deck.main.map((entry) => ({ ...entry })),
    field: deck.field.map((entry) => ({ ...entry })),
    commander: deck.commander.map((entry) => ({ ...entry }))
  };
}

function getSectionCount(sectionEntries) {
  return sectionEntries.reduce((total, entry) => total + entry.quantity, 0);
}

export function DeckBuilderProvider({ children }) {
  const catalog = useMemo(() => DeckBuilderController.getCatalog(), []);
  const cardMap = useMemo(() => {
    return new Map(catalog.map((card) => [card.id, card]));
  }, [catalog]);

  const [decks, setDecks] = useState([]);
  const [activeDeckId, setActiveDeckId] = useState(null);
  const [hydrated, setHydrated] = useState(false);

  // Carregar decks do banco de dados
  useEffect(() => {
    async function load() {
      try {
        const stored = await DeckService.getAll();
        
        if (stored.length > 0) {
          setDecks(stored);
          setActiveDeckId(stored[0].id);
        } else {
          // Criar deck padrão se não houver nenhum
          const defaultDeck = new DeckEntity({
            id: `deck-${Date.now()}`,
            ownerUserId: null,
            name: "Deck Inicial",
            deck: createEmptyDeckSections(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          await DeckService.create(defaultDeck);
          setDecks([defaultDeck]);
          setActiveDeckId(defaultDeck.id);
        }
      } catch (error) {
        console.error("Erro ao carregar decks:", error);
      } finally {
        setHydrated(true);
      }
    }

    load();
  }, []);

  const currentDeck = useMemo(() => {
    return decks.find((d) => d.id === activeDeckId) || null;
  }, [decks, activeDeckId]);

  const totals = useMemo(() => {
    if (!currentDeck) {
      return { main: 0, field: 0, commander: 0 };
    }

    return {
      main: getSectionCount(currentDeck.deck.main),
      field: getSectionCount(currentDeck.deck.field),
      commander: getSectionCount(currentDeck.deck.commander)
    };
  }, [currentDeck]);

  const expandedSections = useMemo(() => {
    if (!currentDeck) {
      return { main: [], field: [], commander: [] };
    }

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
      main: expand(currentDeck.deck.main),
      field: expand(currentDeck.deck.field),
      commander: expand(currentDeck.deck.commander)
    };
  }, [cardMap, currentDeck]);

  const addCardToSection = (section, cardId) => {
    if (!currentDeck) return false;

    let added = false;

    setDecks((prevDecks) => {
      return prevDecks.map((deck) => {
        if (deck.id !== activeDeckId) return deck;

        const nextDeck = { ...deck, deck: cloneDeck(deck.deck) };
        const entries = nextDeck.deck[section];

        if (!entries) return deck;

        if (section === "main" && getSectionCount(entries) >= 60) {
          return deck;
        }

        const existing = entries.find((entry) => entry.cardId === cardId);

        if (existing) {
          existing.quantity += 1;
        } else {
          entries.push({ cardId, quantity: 1 });
        }

        nextDeck.updatedAt = new Date().toISOString();
        added = true;
        return nextDeck;
      });
    });

    // Persistir no banco de dados
    if (added && currentDeck) {
      const updated = decks.find((d) => d.id === activeDeckId);
      if (updated) {
        DeckService.update(activeDeckId, {
          name: updated.name,
          deck: updated.deck,
          updatedAt: updated.updatedAt
        }).catch(console.error);
      }
    }

    return added;
  };

  const removeCardFromSection = (section, cardId) => {
    if (!currentDeck) return false;

    let removed = false;

    setDecks((prevDecks) => {
      return prevDecks.map((deck) => {
        if (deck.id !== activeDeckId) return deck;

        const nextDeck = { ...deck, deck: cloneDeck(deck.deck) };
        const entries = nextDeck.deck[section];

        if (!entries) return deck;

        const existing = entries.find((entry) => entry.cardId === cardId);

        if (!existing) return deck;

        existing.quantity -= 1;

        if (existing.quantity <= 0) {
          nextDeck.deck[section] = entries.filter((entry) => entry.cardId !== cardId);
        }

        nextDeck.updatedAt = new Date().toISOString();
        removed = true;
        return nextDeck;
      });
    });

    // Persistir no banco de dados
    if (removed && currentDeck) {
      const updated = decks.find((d) => d.id === activeDeckId);
      if (updated) {
        DeckService.update(activeDeckId, {
          name: updated.name,
          deck: updated.deck,
          updatedAt: updated.updatedAt
        }).catch(console.error);
      }
    }

    return removed;
  };

  const resetDeck = () => {
    if (!currentDeck) return;

    setDecks((prevDecks) => {
      return prevDecks.map((deck) => {
        if (deck.id !== activeDeckId) return deck;

        return {
          ...deck,
          deck: createEmptyDeckSections(),
          updatedAt: new Date().toISOString()
        };
      });
    });

    // Persistir no banco
    DeckService.update(activeDeckId, {
      name: currentDeck.name,
      deck: createEmptyDeckSections(),
      updatedAt: new Date().toISOString()
    }).catch(console.error);
  };

  const createDeck = async (name) => {
    try {
      const newDeck = new DeckEntity({
        id: `deck-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        ownerUserId: null,
        name,
        deck: createEmptyDeckSections(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });

      await DeckService.create(newDeck);
      setDecks((prev) => [...prev, newDeck]);
      setActiveDeckId(newDeck.id);

      return newDeck.id;
    } catch (error) {
      console.error("Erro ao criar deck:", error);
      return null;
    }
  };

  const deleteDeck = async (deckId) => {
    try {
      await DeckService.delete(deckId);
      setDecks((prev) => prev.filter((d) => d.id !== deckId));

      // Se deletou o deck ativo, mudar para outro
      if (activeDeckId === deckId && decks.length > 1) {
        const remaining = decks.filter((d) => d.id !== deckId);
        setActiveDeckId(remaining[0].id);
      }
    } catch (error) {
      console.error("Erro ao deletar deck:", error);
    }
  };

  const switchDeck = (deckId) => {
    if (decks.some((d) => d.id === deckId)) {
      setActiveDeckId(deckId);
    }
  };

  const saveDeck = async () => {
    if (!currentDeck) return false;

    try {
      await DeckService.update(activeDeckId, {
        name: currentDeck.name,
        deck: currentDeck.deck,
        updatedAt: new Date().toISOString()
      });
      return true;
    } catch (error) {
      console.error("Erro ao salvar deck:", error);
      return false;
    }
  };

  return (
    <DeckBuilderContext.Provider
      value={{
        catalog,
        currentDeck,
        decks,
        activeDeckId,
        expandedSections,
        totals,
        hasSavedDeck: Boolean(currentDeck),
        isMainDeckReady: totals.main === 60,
        hydrated,
        addCardToSection,
        removeCardFromSection,
        resetDeck,
        createDeck,
        deleteDeck,
        switchDeck,
        saveDeck
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
