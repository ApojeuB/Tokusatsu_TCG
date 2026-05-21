import { PitchStackEntity } from "../Entities/PitchStackEntity";

export class PitchManager {
  createPitchStack() {
    return new PitchStackEntity();
  }

  pitchCard(pitchStack, card) {
    pitchStack.cards.push(card);
    pitchStack.generatedResources += card?.pitchValue ?? 0;
    return pitchStack.generatedResources;
  }

  clearPitch(pitchStack) {
    const pitchedCards = [...pitchStack.cards];
    pitchStack.cards = [];
    pitchStack.generatedResources = 0;
    return pitchedCards;
  }
}
