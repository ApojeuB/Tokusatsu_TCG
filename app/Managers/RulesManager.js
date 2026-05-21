import { RulesEngineEntity } from "../Entities/RulesEngineEntity";

export class RulesManager {
  constructor({ validators = {}, managers = {} } = {}) {
    this.engine = new RulesEngineEntity({ validators, managers });
  }

  getEngine() {
    return this.engine;
  }
}
