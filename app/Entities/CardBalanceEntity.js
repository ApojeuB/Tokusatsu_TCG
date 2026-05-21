export class CardBalanceEntity {
  constructor({
    cardId,
    winRate = 0,
    playRate = 0,
    nerfs = [],
    buffs = []
  }) {
    this.cardId = cardId;
    this.winRate = winRate;
    this.playRate = playRate;
    this.nerfs = nerfs;
    this.buffs = buffs;
  }
}
