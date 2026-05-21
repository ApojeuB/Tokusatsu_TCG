export class TurnPhaseEntity {
  constructor({
    currentPhase = "start",
    currentStep = "begin",
    priorityWindow = null
  } = {}) {
    this.currentPhase = currentPhase;
    this.currentStep = currentStep;
    this.priorityWindow = priorityWindow;
  }
}
