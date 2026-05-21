export class ReactionWindowEntity {
  constructor({
    type,
    attackerCanRespond = false,
    defenderCanRespond = false,
    closed = false
  }) {
    this.type = type;
    this.attackerCanRespond = attackerCanRespond;
    this.defenderCanRespond = defenderCanRespond;
    this.closed = closed;
  }
}
