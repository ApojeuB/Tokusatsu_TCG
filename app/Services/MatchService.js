import { MatchStateEntity } from "../Entities/MatchStateEntity";
import { ZoneEntity } from "../Entities/ZoneEntity";
import { MatchRepository } from "../Repositories/MatchRepository";
import { ZONE_TYPES } from "../Rules/GameRules";

export class MatchService {
  static createMatch(players = []) {
    const zones = players.flatMap((player) => {
      const owner = player.id ?? player;
      return Object.values(ZONE_TYPES).map((type) => new ZoneEntity({
        id: `${owner}-${type}`,
        type,
        owner,
        cards: [],
        visibility: type === ZONE_TYPES.hand ? "owner" : "public",
        capacity: type === ZONE_TYPES.arsenal ? 1 : null
      }));
    });

    return new MatchStateEntity({
      activePlayer: players[0]?.id ?? players[0] ?? null,
      priorityPlayer: players[0]?.id ?? players[0] ?? null,
      players,
      zones
    });
  }

  static async persistMatch(matchId, matchState) {
    await MatchRepository.saveSnapshot(matchId, matchState);
    await MatchRepository.replaceZones(matchId, matchState.zones ?? []);
    return matchState;
  }

  static addEvent(matchId, event) {
    return MatchRepository.addEvent(matchId, event);
  }
}
