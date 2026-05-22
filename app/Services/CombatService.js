import { CombatManager } from "../Managers/CombatManager";
import { AttackValidator } from "../Validators/AttackValidator";
import { BlockValidator } from "../Validators/BlockValidator";

const combatManager = new CombatManager();
const attackValidator = new AttackValidator();
const blockValidator = new BlockValidator();

export class CombatService {
  static declareAttack(matchState, attack) {
    const validation = attackValidator.validate(attack, matchState);
    if (!validation.ok) {
      return { validation, link: null };
    }

    const link = combatManager.startAttack(matchState, {
      attackCard: attack.card,
      attacker: attack.attacker,
      defender: attack.defender
    });

    return { validation, link };
  }

  static declareBlock(matchState, blockCard, options = {}) {
    const combatLink = matchState.combatChain.currentLink;
    const validation = blockValidator.validate({
      blockCard,
      combatLink,
      sourceZone: options.sourceZone ?? blockCard?.sourceZone ?? "hand"
    });

    if (!validation.ok) {
      return { validation, combatLink };
    }

    combatManager.addDefense(combatLink, {
      ...blockCard,
      sourceZone: options.sourceZone ?? blockCard?.sourceZone ?? "hand"
    });
    return { validation, combatLink };
  }

  static resolve(matchState) {
    return combatManager.resolveCombat(matchState);
  }
}
