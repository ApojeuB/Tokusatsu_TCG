import { CardEntity } from "../Entities/CardEntity";

export class CardFactory {
  static create(config) {
    return new CardEntity(config);
  }

  static createAttack(config) {
    return new CardEntity({
      cardType: "Attack",
      ...config
    });
  }
}
