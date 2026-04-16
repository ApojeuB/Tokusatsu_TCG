export class GameState {
  constructor({
    player,
    opponent,
    turn = 'player',
    phase = 'preparation',
    turnNumber = 1,
    winner = null,
    activeTerrain = null,
    log = [],
  }) {
    this.player = player;
    this.opponent = opponent;
    this.turn = turn;
    this.phase = phase;
    this.turnNumber = turnNumber;
    this.winner = winner;
    this.activeTerrain = activeTerrain;
    this.log = log;
  }

  currentPlayer() {
    return this.turn === 'player' ? this.player : this.opponent;
  }

  opponentPlayer() {
    return this.turn === 'player' ? this.opponent : this.player;
  }

  addLog(message) {
    this.log = [{ id: `${Date.now()}_${Math.random()}`, message }, ...this.log].slice(0, 40);
  }
}
