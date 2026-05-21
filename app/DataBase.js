import * as SQLite from "expo-sqlite";

const DATABASE_NAME = "tokusatsu_chronicle.db";
const SCHEMA_VERSION = 2;

let databasePromise = null;
let initializedPromise = null;

function nowIso() {
  return new Date().toISOString();
}

function getDatabase() {
  if (!databasePromise) {
    databasePromise = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databasePromise;
}

export function toJson(value, fallback = null) {
  if (value === undefined) {
    return JSON.stringify(fallback);
  }

  return JSON.stringify(value ?? fallback);
}

export function fromJson(value, fallback = null) {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

async function createSchema(db) {
  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS app_meta (
      key TEXT PRIMARY KEY,
      value TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT NOT NULL UNIQUE COLLATE NOCASE,
      password TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS app_settings (
      id TEXT PRIMARY KEY,
      musicVolume INTEGER NOT NULL DEFAULT 75,
      effectsVolume INTEGER NOT NULL DEFAULT 85,
      tipsEnabled INTEGER NOT NULL DEFAULT 1,
      menuMusicEnabled INTEGER NOT NULL DEFAULT 1,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      currentUserId TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (currentUserId) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS cards (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      series TEXT,
      cardType TEXT,
      subTypes TEXT,
      classRequirement TEXT,
      talentRequirement TEXT,
      cost INTEGER DEFAULT 0,
      pitchValue INTEGER DEFAULT 0,
      color TEXT,
      attack INTEGER DEFAULT 0,
      defense INTEGER DEFAULT 0,
      health INTEGER,
      text TEXT,
      effects TEXT,
      comboCondition TEXT,
      fusionCondition TEXT,
      goAgain INTEGER DEFAULT 0,
      dominate INTEGER DEFAULT 0,
      intimidate INTEGER DEFAULT 0,
      rarity TEXT,
      legality TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS keywords (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      description TEXT,
      timing TEXT,
      stackable INTEGER DEFAULT 0,
      ruleText TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS card_keywords (
      cardId TEXT NOT NULL,
      keywordId TEXT NOT NULL,
      PRIMARY KEY (cardId, keywordId),
      FOREIGN KEY (cardId) REFERENCES cards(id) ON DELETE CASCADE,
      FOREIGN KEY (keywordId) REFERENCES keywords(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS effects (
      id TEXT PRIMARY KEY,
      sourceId TEXT,
      type TEXT,
      triggerJson TEXT,
      resolutionJson TEXT,
      duration TEXT,
      targets TEXT,
      conditions TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS formats (
      name TEXT PRIMARY KEY,
      deckSize INTEGER NOT NULL,
      startingHealth INTEGER NOT NULL,
      bannedCards TEXT,
      restrictedCards TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS expansions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      releaseDate TEXT,
      cards TEXT,
      legalFormats TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS rarities (
      name TEXT PRIMARY KEY,
      dropRate REAL DEFAULT 0,
      craftingValue INTEGER DEFAULT 0,
      borderStyle TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS decks (
      id TEXT PRIMARY KEY,
      ownerUserId TEXT,
      name TEXT NOT NULL,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (ownerUserId) REFERENCES users(id) ON DELETE SET NULL
    );

    CREATE TABLE IF NOT EXISTS deck_cards (
      deckId TEXT NOT NULL,
      section TEXT NOT NULL,
      cardId TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      PRIMARY KEY (deckId, section, cardId),
      FOREIGN KEY (deckId) REFERENCES decks(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS personas (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      health INTEGER,
      intellect INTEGER,
      class TEXT,
      talents TEXT,
      passiveAbility TEXT,
      traits TEXT,
      keywords TEXT,
      startingForms TEXT,
      soulCapacity INTEGER DEFAULT 0,
      artwork TEXT,
      voice TEXT,
      introAnimation TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS forms (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      pitchValue INTEGER DEFAULT 0,
      color TEXT,
      attackBonus INTEGER DEFAULT 0,
      defenseBonus INTEGER DEFAULT 0,
      abilities TEXT,
      keywords TEXT,
      formType TEXT,
      transformationCost INTEGER DEFAULT 0,
      duration TEXT,
      canBeDestroyed INTEGER DEFAULT 1,
      stackEffects TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS campos (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      cost INTEGER DEFAULT 0,
      globalEffects TEXT,
      duration TEXT,
      weatherType TEXT,
      terrainType TEXT,
      artwork TEXT,
      soundtrack TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      turn INTEGER DEFAULT 1,
      activePlayer TEXT,
      priorityPlayer TEXT,
      fieldJson TEXT,
      players TEXT,
      winner TEXT,
      phaseJson TEXT,
      snapshotJson TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS match_events (
      id TEXT PRIMARY KEY,
      matchId TEXT,
      type TEXT NOT NULL,
      source TEXT,
      target TEXT,
      payload TEXT,
      timestamp INTEGER,
      createdAt TEXT NOT NULL,
      FOREIGN KEY (matchId) REFERENCES matches(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS zones (
      id TEXT PRIMARY KEY,
      matchId TEXT,
      type TEXT NOT NULL,
      owner TEXT,
      cards TEXT,
      visibility TEXT,
      capacity INTEGER,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (matchId) REFERENCES matches(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS combat_chains (
      id TEXT PRIMARY KEY,
      matchId TEXT,
      currentLink TEXT,
      isOpen INTEGER DEFAULT 0,
      attackHistory TEXT,
      reactionWindows TEXT,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (matchId) REFERENCES matches(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS combat_links (
      id TEXT PRIMARY KEY,
      chainId TEXT,
      attackCard TEXT,
      attacker TEXT,
      defender TEXT,
      attackValue INTEGER DEFAULT 0,
      defenseValue INTEGER DEFAULT 0,
      reactions TEXT,
      damageDealt INTEGER DEFAULT 0,
      resolved INTEGER DEFAULT 0,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (chainId) REFERENCES combat_chains(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS stack_items (
      id TEXT PRIMARY KEY,
      matchId TEXT,
      source TEXT,
      type TEXT,
      owner TEXT,
      targets TEXT,
      effect TEXT,
      timestamp INTEGER,
      createdAt TEXT NOT NULL,
      updatedAt TEXT NOT NULL,
      FOREIGN KEY (matchId) REFERENCES matches(id) ON DELETE CASCADE
    );
  `);
}

async function upsertMeta(db, key, value) {
  const timestamp = nowIso();
  await db.runAsync(
    `INSERT INTO app_meta (key, value, createdAt, updatedAt)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value, updatedAt = excluded.updatedAt`,
    [key, value, timestamp, timestamp]
  );
}

async function seedDefaults(db) {
  const timestamp = nowIso();

  await db.runAsync(
    `INSERT OR IGNORE INTO users (id, username, password, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?)`,
    ["seed-admin-user", "adm", "adm123", "2026-04-29T00:00:00.000Z", timestamp]
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO sessions (id, currentUserId, createdAt, updatedAt)
     VALUES (?, ?, ?, ?)`,
    ["default", null, timestamp, timestamp]
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO app_settings (
      id, musicVolume, effectsVolume, tipsEnabled, menuMusicEnabled, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ["default", 75, 85, 1, 1, timestamp, timestamp]
  );

  await db.runAsync(
    `INSERT OR IGNORE INTO cards (
      id, name, series, cardType, subTypes, cost, pitchValue, color,
      attack, defense, text, effects, goAgain, dominate, intimidate,
      rarity, legality, createdAt, updatedAt
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      "tc-001",
      "Henshin!",
      "Tokusatsu Chronicle",
      "Action",
      toJson(["Transform", "Support"], []),
      1,
      1,
      "red",
      0,
      0,
      "Choose 1 USER card you control. You may place 1 RIDER card from your hand on top of it.",
      toJson([{ id: "tc-001-transform", type: "activated", duration: "instant", targets: ["user-card"] }], []),
      1,
      0,
      0,
      "Real Card",
      toJson({ blitz: true, constructed: true }, {}),
      timestamp,
      timestamp
    ]
  );

  const keywords = [
    ["go-again", "Go Again", "After this action resolves, the player regains an action point.", "resolution", 0, "A resolved action with Go Again restores momentum for another action."],
    ["dominate", "Dominate", "The defender is limited while blocking this attack.", "attack", 0, "A dominated attack restricts defensive options during the block step."],
    ["fusion", "Fusion", "An additional condition unlocks a stronger effect.", "play", 0, "When the fusion condition is met, apply the fused effect text."],
    ["combo", "Combo", "Checks previous combat chain activity.", "play", 0, "If the combo condition matches attack history, apply the combo bonus."],
    ["blood-debt", "Blood Debt", "A lingering drawback checked at the end of turn.", "end", 1, "At end phase, unresolved Blood Debt effects may deal damage to their owner."],
    ["intimidate", "Intimidate", "Pressures the defender before blocks are declared.", "attack", 1, "When this triggers, temporarily remove a random eligible defending card."]
  ];

  for (const keyword of keywords) {
    await db.runAsync(
      `INSERT OR IGNORE INTO keywords (id, name, description, timing, stackable, ruleText, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [...keyword, timestamp, timestamp]
    );
  }

  await db.runAsync(
    "INSERT OR IGNORE INTO card_keywords (cardId, keywordId) VALUES (?, ?)",
    ["tc-001", "go-again"]
  );

  const formats = [
    ["Blitz", 40, 20, [], []],
    ["Constructed", 60, 40, [], []]
  ];

  for (const [name, deckSize, startingHealth, bannedCards, restrictedCards] of formats) {
    await db.runAsync(
      `INSERT OR IGNORE INTO formats (name, deckSize, startingHealth, bannedCards, restrictedCards, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, deckSize, startingHealth, toJson(bannedCards, []), toJson(restrictedCards, []), timestamp, timestamp]
    );
  }
}

async function migrate(db) {
  const row = await db.getFirstAsync("PRAGMA user_version");
  const currentVersion = row?.user_version ?? 0;

  if (currentVersion < 1) {
    await createSchema(db);
    await db.execAsync("PRAGMA user_version = 1");
    await upsertMeta(db, "schema_version", "1");
  } else {
    await db.execAsync("PRAGMA foreign_keys = ON");
  }

  if (currentVersion < 2) {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS app_settings (
        id TEXT PRIMARY KEY,
        musicVolume INTEGER NOT NULL DEFAULT 75,
        effectsVolume INTEGER NOT NULL DEFAULT 85,
        tipsEnabled INTEGER NOT NULL DEFAULT 1,
        menuMusicEnabled INTEGER NOT NULL DEFAULT 1,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL
      );
    `);
    await db.execAsync(`PRAGMA user_version = ${SCHEMA_VERSION}`);
    await upsertMeta(db, "schema_version", String(SCHEMA_VERSION));
  }

  await seedDefaults(db);
}

export async function initDatabase() {
  if (!initializedPromise) {
    initializedPromise = getDatabase().then(async (db) => {
      await migrate(db);
      return db;
    });
  }

  return initializedPromise;
}

export async function executeSql(sql, params = []) {
  const db = await initDatabase();
  return db.runAsync(sql, params);
}

export async function getAll(sql, params = []) {
  const db = await initDatabase();
  return db.getAllAsync(sql, params);
}

export async function getFirst(sql, params = []) {
  const db = await initDatabase();
  return db.getFirstAsync(sql, params);
}

export async function runTransaction(callback) {
  const db = await initDatabase();
  return db.withTransactionAsync(() => callback(db));
}
