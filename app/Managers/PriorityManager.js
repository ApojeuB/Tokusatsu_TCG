import { PriorityEntity } from "../Entities/PriorityEntity";

export class PriorityManager {
  createWindow(currentPlayer, phase, canRespond = true) {
    return new PriorityEntity({
      currentPlayer,
      phase,
      canRespond
    });
  }

  passPriority(priority, playerId, players = []) {
    if (!priority.passedPlayers.includes(playerId)) {
      priority.passedPlayers.push(playerId);
    }

    const allPassed = players.length > 0 && players.every((player) => priority.passedPlayers.includes(player.id ?? player));
    priority.canRespond = !allPassed;
    return priority;
  }

  setPriority(matchState, playerId) {
    matchState.priorityPlayer = playerId;
    return matchState;
  }
}
