import { CombatChainEntity } from "./CombatChainEntity";
import { StackEntity } from "./StackEntity";
import { TurnPhaseEntity } from "./TurnPhaseEntity";

export class MatchStateEntity {
  constructor({
    turn = 1,
    activePlayer = null,
    priorityPlayer = null,
    combatChain = new CombatChainEntity(),
    stack = new StackEntity(),
    field = null,
    zones = [],
    players = [],
    winner = null,
    phase = new TurnPhaseEntity(),
    events = [],
    continuousEffects = []
  } = {}) {
    this.turn = turn;
    this.activePlayer = activePlayer;
    this.priorityPlayer = priorityPlayer;
    this.combatChain = combatChain;
    this.stack = stack;
    this.field = field;
    this.zones = zones;
    this.players = players;
    this.winner = winner;
    this.phase = phase;
    this.events = events;
    this.continuousEffects = continuousEffects;
  }
}
