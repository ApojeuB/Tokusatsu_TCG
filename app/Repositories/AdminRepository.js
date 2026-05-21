import { executeSql, toJson } from "../DataBase";

export const AdminRepository = {
  async saveCardScript(script) {
    const timestamp = new Date().toISOString();
    await executeSql(
      `INSERT INTO effects (id, sourceId, type, resolutionJson, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
        resolutionJson = excluded.resolutionJson,
        updatedAt = excluded.updatedAt`,
      [
        `${script.cardId}-script-v${script.version}`,
        script.cardId,
        "script",
        toJson(script, {}),
        timestamp,
        timestamp
      ]
    );
  },

  async saveExpansion(expansion) {
    const timestamp = new Date().toISOString();
    await executeSql(
      `INSERT INTO expansions (id, name, releaseDate, cards, legalFormats, createdAt, updatedAt)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(id) DO UPDATE SET
        name = excluded.name,
        releaseDate = excluded.releaseDate,
        cards = excluded.cards,
        legalFormats = excluded.legalFormats,
        updatedAt = excluded.updatedAt`,
      [
        expansion.id,
        expansion.name,
        expansion.releaseDate,
        toJson(expansion.cards, []),
        toJson(expansion.legalFormats, []),
        timestamp,
        timestamp
      ]
    );
  }
};
