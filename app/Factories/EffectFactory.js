import { ContinuousEffectEntity } from "../Entities/ContinuousEffectEntity";
import { EffectEntity } from "../Entities/EffectEntity";
import { TriggerEntity } from "../Entities/TriggerEntity";

export class EffectFactory {
  static create(config) {
    return new EffectEntity(config);
  }

  static createContinuous(config) {
    return new ContinuousEffectEntity(config);
  }

  static createTrigger(config) {
    return new TriggerEntity(config);
  }
}
