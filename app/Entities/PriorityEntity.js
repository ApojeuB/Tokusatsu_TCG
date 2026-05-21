export class PriorityEntity {
  constructor({
    currentPlayer = null,
    passedPlayers = [],
    phase = "start",
    canRespond = false
  } = {}) {
    this.currentPlayer = currentPlayer;
    this.passedPlayers = passedPlayers;
    this.phase = phase;
    this.canRespond = canRespond;
  }
}
