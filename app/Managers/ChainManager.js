import { CombatChainEntity } from "../Entities/CombatChainEntity";

export class ChainManager {
  createChain() {
    return new CombatChainEntity({ isOpen: true });
  }

  closeChain(matchState) {
    matchState.combatChain.isOpen = false;
    matchState.combatChain.currentLink = null;
    matchState.combatChain.reactionWindows = [];
    return matchState.combatChain;
  }

  getCurrentLink(matchState) {
    return matchState.combatChain.currentLink;
  }
}
