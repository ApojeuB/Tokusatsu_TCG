import AsyncStorage from "@react-native-async-storage/async-storage";
import { fromJson, getFirst, executeSql } from "../DataBase";
import { DeckEntity, cloneDeckSections, createDeckEntity } from "../Entities/DeckEntity";
import { UserEntity } from "../Entities/UserEntity";
import { DeckRepository } from "./DeckRepository";
import { UserRepository } from "./UserRepository";

const USER_STORAGE_KEY = "tokusatsu-chronicle.user-session";
const DECK_STORAGE_KEY = "tokusatsu-chronicle.deckbuilder";
const LEGACY_DECK_STORAGE_KEY = "tokusatsu-chronicle.deckbuilder.legacy";
const IMPORT_FLAG = "legacy_asyncstorage_imported";
const DEFAULT_DECK_NAME = "Deck inicial";

let importPromise = null;

function sanitizeUser(user) {
  if (!user?.username || !user?.password) {
    return null;
  }

  const timestamp = new Date().toISOString();
  return new UserEntity({
    id: user.id || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    username: user.username.trim(),
    password: user.password,
    createdAt: user.createdAt || timestamp,
    updatedAt: user.updatedAt || timestamp
  });
}

function sanitizeDeck(deck, fallbackIndex = 0) {
  if (!deck) {
    return null;
  }

  const timestamp = new Date().toISOString();
  return new DeckEntity({
    id: deck.id || `${Date.now()}-${fallbackIndex}`,
    ownerUserId: deck.ownerUserId ?? null,
    name: deck.name?.trim() || `${DEFAULT_DECK_NAME} ${fallbackIndex + 1}`,
    createdAt: deck.createdAt || timestamp,
    updatedAt: deck.updatedAt || timestamp,
    deck: cloneDeckSections(deck.deck)
  });
}

function deckFromLegacyPayload(parsed) {
  const legacyDeck = parsed?.currentDeck || parsed?.savedDeck;

  if (!legacyDeck) {
    return null;
  }

  const timestamp = new Date().toISOString();
  return new DeckEntity({
    id: "starter-deck",
    ownerUserId: null,
    name: DEFAULT_DECK_NAME,
    createdAt: timestamp,
    updatedAt: timestamp,
    deck: cloneDeckSections(legacyDeck)
  });
}

async function markImported() {
  const timestamp = new Date().toISOString();
  await executeSql(
    `INSERT INTO app_meta (key, value, createdAt, updatedAt)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`,
    [IMPORT_FLAG, "true", timestamp, timestamp]
  );
}

async function runLegacyImport() {
  const imported = await getFirst("SELECT value FROM app_meta WHERE key = ?", [IMPORT_FLAG]);

  if (imported?.value === "true") {
    return false;
  }

  const userRaw = await AsyncStorage.getItem(USER_STORAGE_KEY);
  const userParsed = fromJson(userRaw, null);
  const users = Array.isArray(userParsed?.users)
    ? userParsed.users.map(sanitizeUser).filter(Boolean)
    : [];

  if (users.length) {
    await UserRepository.importUsers(users, userParsed?.currentUserId ?? null);
  }

  const deckRaw = await AsyncStorage.getItem(DECK_STORAGE_KEY);
  const deckParsed = fromJson(deckRaw, null);
  const storedDecks = Array.isArray(deckParsed?.decks)
    ? deckParsed.decks.map(sanitizeDeck).filter(Boolean)
    : [];

  if (storedDecks.length) {
    await DeckRepository.importDecks(storedDecks, deckParsed?.activeDeckId ?? null);
  } else {
    const legacyRaw = await AsyncStorage.getItem(LEGACY_DECK_STORAGE_KEY) || deckRaw;
    const legacyDeck = deckFromLegacyPayload(fromJson(legacyRaw, null));

    if (legacyDeck) {
      await DeckRepository.importDecks([legacyDeck], legacyDeck.id);
    }
  }

  await markImported();
  return true;
}

export async function importLegacyPersistence() {
  if (!importPromise) {
    importPromise = runLegacyImport();
  }

  return importPromise;
}

export async function ensureDefaultDeck() {
  const decks = await DeckRepository.getDecks();

  if (decks.length) {
    return decks;
  }

  const deck = createDeckEntity({
    ownerUserId: null,
    name: DEFAULT_DECK_NAME
  });
  await DeckRepository.createDeck(deck);
  await DeckRepository.setActiveDeckId(deck.id);
  return [deck];
}
