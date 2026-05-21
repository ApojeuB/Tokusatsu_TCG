export class CombatChainEntity {
  constructor({
    id = `chain-${Date.now()}`,
    links = [],
    currentLink = null,
    isOpen = false,
    attackHistory = [],
    reactionWindows = []
  } = {}) {
    this.id = id;
    this.links = links;
    this.currentLink = currentLink;
    this.isOpen = isOpen;
    this.attackHistory = attackHistory;
    this.reactionWindows = reactionWindows;
  }
}
