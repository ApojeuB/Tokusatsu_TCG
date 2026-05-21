import { CombatLinkEntity } from "../Entities/CombatLinkEntity";
import { DamageEntity } from "../Entities/DamageEntity";
import { ReactionWindowEntity } from "../Entities/ReactionWindowEntity";

export class CombatManager {
  openChain(matchState) {
    matchState.combatChain.isOpen = true;
    return matchState.combatChain;
  }

  startAttack(matchState, { attackCard, attacker, defender }) {
    this.openChain(matchState);

    const link = new CombatLinkEntity({
      id: `link-${matchState.combatChain.links.length + 1}-${Date.now()}`,
      attackCard,
      attacker,
      defender
    });

    matchState.combatChain.links.push(link);
    matchState.combatChain.currentLink = link;
    matchState.combatChain.attackHistory.push(attackCard?.id ?? attackCard);
    matchState.combatChain.reactionWindows.push(
      new ReactionWindowEntity({
        type: "attack",
        attackerCanRespond: true,
        defenderCanRespond: true
      })
    );

    return link;
  }

  addDefense(currentLink, defenseCard) {
    currentLink.defenseValue += defenseCard?.defense ?? 0;
    currentLink.reactions.push({ type: "block", card: defenseCard });
    return currentLink;
  }

  resolveCombat(matchState) {
    const link = matchState.combatChain.currentLink;

    if (!link || link.resolved) {
      return matchState;
    }

    const amount = Math.max(0, link.attackValue - link.defenseValue);
    const damage = new DamageEntity({
      source: link.attackCard,
      target: link.defender,
      amount,
      type: "combat"
    });

    link.damageDealt = damage.finalAmount;
    link.resolved = true;
    matchState.combatChain.reactionWindows.forEach((window) => {
      window.closed = true;
    });

    return matchState;
  }
}
