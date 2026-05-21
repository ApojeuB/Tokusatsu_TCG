import { fromJson, getAll } from "../DataBase";
import { FormatEntity } from "../Entities/FormatEntity";
import { KeywordEntity } from "../Entities/KeywordEntity";

export const RulesRepository = {
  async getFormats() {
    const rows = await getAll("SELECT * FROM formats ORDER BY name COLLATE NOCASE ASC");
    return rows.map((row) => new FormatEntity({
      name: row.name,
      deckSize: row.deckSize,
      startingHealth: row.startingHealth,
      bannedCards: fromJson(row.bannedCards, []),
      restrictedCards: fromJson(row.restrictedCards, [])
    }));
  },

  async getKeywords() {
    const rows = await getAll("SELECT * FROM keywords ORDER BY name COLLATE NOCASE ASC");
    return rows.map((row) => new KeywordEntity({
      id: row.id,
      name: row.name,
      description: row.description,
      timing: row.timing,
      stackable: Boolean(row.stackable),
      ruleText: row.ruleText
    }));
  }
};
