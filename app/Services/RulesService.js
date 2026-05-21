import {
  CombatManager,
  EffectManager,
  StackManager,
  TriggerManager
} from "../Managers";
import {
  AttackValidator,
  BlockValidator,
  EffectValidator,
  PriorityValidator,
  TargetValidator
} from "../Validators";
import { RulesEngineEntity } from "../Entities/RulesEngineEntity";

export class RulesService {
  static createEngine() {
    return new RulesEngineEntity({
      validators: {
        attack: new AttackValidator(),
        block: new BlockValidator(),
        effect: new EffectValidator(),
        priority: new PriorityValidator(),
        target: new TargetValidator()
      },
      managers: {
        combat: new CombatManager(),
        effect: new EffectManager(),
        stack: new StackManager(),
        trigger: new TriggerManager()
      }
    });
  }
}
