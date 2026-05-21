import { CardEntity } from "../Entities/CardEntity";

const henshinCard = require("../../assets/henshin-card.png");

const cards = [
  new CardEntity({
    id: "tc-001",
    name: "Henshin!",
    series: "Tokusatsu Chronicle",
    cardType: "Action",
    subTypes: ["Transform", "Support"],
    cost: 1,
    pitchValue: 1,
    color: "red",
    attack: 0,
    defense: 0,
    rarity: "Real Card",
    artwork: henshinCard,
    keywords: ["Go Again"],
    effects: [
      {
        id: "tc-001-transform",
        type: "activated",
        duration: "instant",
        targets: ["user-card"]
      }
    ],
    goAgain: true,
    text: "Choose 1 USER card you control. You may place 1 RIDER card from your hand on top of it.",
    rules: [
      "Escolha 1 carta USER que voce controla.",
      "Voce pode colocar 1 carta RIDER da sua mao sobre ela.",
      "Enquanto estiverem empilhadas, trate-as como uma unica unidade."
    ],
    flavorText: "Hen...shin!"
  })
];

export const CardService = {
  getCards() {
    return cards;
  },
  getStarterDeck() {
    return [cards[0]];
  },
  getKeywords() {
    return cards.flatMap((card) => card.keywords ?? []);
  }
};
