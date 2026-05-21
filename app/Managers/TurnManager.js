import { TurnPhaseEntity } from "../Entities/TurnPhaseEntity";
import { TURN_PHASES } from "../Rules/GameRules";

export class TurnManager {
  startTurn(matchState, playerId) {
    matchState.turn += 1;
    matchState.activePlayer = playerId;
    matchState.priorityPlayer = playerId;
    matchState.phase = new TurnPhaseEntity({ currentPhase: TURN_PHASES[0], currentStep: "begin" });
    return matchState;
  }

  advancePhase(matchState) {
    const index = TURN_PHASES.indexOf(matchState.phase.currentPhase);
    const nextPhase = TURN_PHASES[(index + 1) % TURN_PHASES.length];
    matchState.phase.currentPhase = nextPhase;
    matchState.phase.currentStep = nextPhase === "start" ? "begin" : "main";
    return matchState.phase;
  }
}
