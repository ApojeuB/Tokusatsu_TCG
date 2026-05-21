import { ZoneEntity } from "../Entities/ZoneEntity";

export class ZoneManager {
  createZone(config) {
    return new ZoneEntity(config);
  }

  findZone(matchState, type, owner = null) {
    return matchState.zones.find((zone) => zone.type === type && (owner === null || zone.owner === owner)) ?? null;
  }

  moveCard(card, fromZone, toZone) {
    fromZone.cards = fromZone.cards.filter((item) => item !== card && item?.id !== card?.id);

    if (toZone.capacity !== null && toZone.cards.length >= toZone.capacity) {
      return false;
    }

    toZone.cards.push(card);
    return true;
  }
}
