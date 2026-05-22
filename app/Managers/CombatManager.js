import { CombatLinkEntity } from "../Entities/CombatLinkEntity";
import { DamageEntity } from "../Entities/DamageEntity";
import { GameEventEntity } from "../Entities/GameEventEntity";
import { ReactionWindowEntity } from "../Entities/ReactionWindowEntity";
import { GAME_EVENTS } from "../Rules/GameRules";
import { TagService } from "../Services/TagService";

function cardHasResolvedTag(card, tagId) {
  return TagService.getCardBindings(card).some((binding) => binding.tagId === tagId);
}

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
    ["dominate", "overpower", "combo"].forEach((tagId) => {
      if (cardHasResolvedTag(attackCard, tagId)) {
        TagService.resolve(tagId, matchState, attackCard, {
          type: GAME_EVENTS.onAttack,
          source: attackCard,
          target: defender,
          payload: { combatLink: link, attacker, defender }
        });
      }
    });
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
    currentLink.reactions.push({
      type: "block",
      card: defenseCard,
      sourceZone: defenseCard?.sourceZone ?? "hand",
      cardType: defenseCard?.cardType ?? defenseCard?.type
    });
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
    matchState.events = matchState.events ?? [];
    matchState.events.push(new GameEventEntity({
      type: GAME_EVENTS.onChainLinkResolved,
      source: link.attackCard,
      target: link.defender,
      payload: {
        combatLink: link,
        damageDealt: link.damageDealt,
        attacker: link.attacker,
        defender: link.defender
      }
    }));

    if (link.damageDealt > 0) {
      matchState.events.push(new GameEventEntity({
        type: GAME_EVENTS.onHit,
        source: link.attackCard,
        target: link.defender,
        payload: {
          combatLink: link,
          damageDealt: link.damageDealt,
          attacker: link.attacker,
          defender: link.defender
        }
      }));
      if (cardHasResolvedTag(link.attackCard, "on-hit")) {
        TagService.resolve("on-hit", matchState, link.attackCard, {
          type: GAME_EVENTS.onHit,
          source: link.attackCard,
          target: link.defender,
          payload: {
            combatLink: link,
            damageDealt: link.damageDealt,
            attacker: link.attacker,
            defender: link.defender
          }
        });
      }
    }

    if (cardHasResolvedTag(link.attackCard, "go-again")) {
      TagService.resolve("go-again", matchState, link.attackCard, {
        type: GAME_EVENTS.onChainLinkResolved,
        source: link.attackCard,
        target: link.defender,
        payload: {
          combatLink: link,
          damageDealt: link.damageDealt,
          attacker: link.attacker,
          defender: link.defender
        }
      });
    }

    matchState.combatChain.reactionWindows.forEach((window) => {
      window.closed = true;
    });

    return matchState;
  }
}
