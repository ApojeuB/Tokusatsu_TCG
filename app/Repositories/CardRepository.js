import { CardEntity } from "../Entities/CardEntity";
import { fromJson, getAll, getFirst } from "../DataBase";

function mapCard(row) {
  if (!row) {
    return null;
  }

  return new CardEntity({
    id: row.id,
    name: row.name,
    series: row.series,
    cardType: row.cardType,
    subTypes: fromJson(row.subTypes, []),
    classRequirement: row.classRequirement,
    talentRequirement: row.talentRequirement,
    cost: row.cost,
    pitchValue: row.pitchValue,
    color: row.color,
    attack: row.attack,
    defense: row.defense,
    health: row.health,
    text: row.text,
    tags: fromJson(row.tags, []),
    borderTag: row.borderTag,
    effects: fromJson(row.effects, []),
    comboCondition: row.comboCondition,
    fusionCondition: row.fusionCondition,
    goAgain: Boolean(row.goAgain),
    dominate: Boolean(row.dominate),
    intimidate: Boolean(row.intimidate),
    rarity: row.rarity,
    legality: fromJson(row.legality, {})
  });
}

export const CardRepository = {
  async getCards() {
    const rows = await getAll("SELECT * FROM cards ORDER BY name COLLATE NOCASE ASC");
    return rows.map(mapCard);
  },

  async getCardById(cardId) {
    return mapCard(await getFirst("SELECT * FROM cards WHERE id = ?", [cardId]));
  },

  async getKeywords() {
    return getAll("SELECT * FROM keywords ORDER BY name COLLATE NOCASE ASC");
  }
};
