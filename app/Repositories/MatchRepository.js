import { executeSql, getAll, getFirst, runTransaction, toJson } from "../DataBase";
import { MatchStateEntity } from "../Entities/MatchStateEntity";

function mapMatch(row) {
  if (!row) {
    return null;
  }

  return new MatchStateEntity({
    turn: row.turn,
    activePlayer: row.activePlayer,
    priorityPlayer: row.priorityPlayer,
    field: row.fieldJson,
    players: row.players,
    winner: row.winner,
    phase: row.phaseJson,
    id: row.id
  });
}

export const MatchRepository = {
  async saveSnapshot(matchId, matchState) {
    const timestamp = new Date().toISOString();
    await executeSql(
      `INSERT INTO matches (
        id, turn, activePlayer, priorityPlayer, fieldJson, players, winner,
        phaseJson, snapshotJson, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        turn = excluded.turn,
        activePlayer = excluded.activePlayer,
        priorityPlayer = excluded.priorityPlayer,
        fieldJson = excluded.fieldJson,
        players = excluded.players,
        winner = excluded.winner,
        phaseJson = excluded.phaseJson,
        snapshotJson = excluded.snapshotJson,
        updatedAt = excluded.updatedAt`,
      [
        matchId,
        matchState.turn,
        matchState.activePlayer,
        matchState.priorityPlayer,
        toJson(matchState.field, null),
        toJson(matchState.players, []),
        matchState.winner,
        toJson(matchState.phase, null),
        toJson(matchState, {}),
        timestamp,
        timestamp
      ]
    );
  },

  async getMatch(matchId) {
    return mapMatch(await getFirst("SELECT * FROM matches WHERE id = ?", [matchId]));
  },

  async addEvent(matchId, event) {
    await executeSql(
      `INSERT INTO match_events (id, matchId, type, source, target, payload, timestamp, createdAt)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        `${matchId}-${event.type}-${event.timestamp ?? Date.now()}`,
        matchId,
        event.type,
        event.source,
        event.target,
        toJson(event.payload, {}),
        event.timestamp ?? Date.now(),
        new Date().toISOString()
      ]
    );
  },

  async getEvents(matchId) {
    return getAll("SELECT * FROM match_events WHERE matchId = ? ORDER BY timestamp ASC", [matchId]);
  },

  async replaceZones(matchId, zones = []) {
    await runTransaction(async (db) => {
      await db.runAsync("DELETE FROM zones WHERE matchId = ?", [matchId]);
      const timestamp = new Date().toISOString();

      for (const zone of zones) {
        await db.runAsync(
          `INSERT INTO zones (id, matchId, type, owner, cards, visibility, capacity, createdAt, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            zone.id,
            matchId,
            zone.type,
            zone.owner,
            toJson(zone.cards, []),
            zone.visibility,
            zone.capacity,
            timestamp,
            timestamp
          ]
        );
      }
    });
  }
};
