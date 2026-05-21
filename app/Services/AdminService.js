import { CardBalanceEntity } from "../Entities/CardBalanceEntity";
import { CardScriptEntity } from "../Entities/CardScriptEntity";
import { ExpansionEntity } from "../Entities/ExpansionEntity";
import { AdminRepository } from "../Repositories/AdminRepository";

export class AdminService {
  static createCardScript(config) {
    return new CardScriptEntity(config);
  }

  static async saveCardScript(config) {
    const script = config instanceof CardScriptEntity ? config : new CardScriptEntity(config);
    await AdminRepository.saveCardScript(script);
    return script;
  }

  static createBalanceRecord(config) {
    return new CardBalanceEntity(config);
  }

  static createExpansion(config) {
    return new ExpansionEntity(config);
  }

  static async saveExpansion(config) {
    const expansion = config instanceof ExpansionEntity ? config : new ExpansionEntity(config);
    await AdminRepository.saveExpansion(expansion);
    return expansion;
  }
}
