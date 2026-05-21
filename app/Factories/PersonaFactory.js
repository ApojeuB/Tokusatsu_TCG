import { PersonaEntity } from "../Entities/PersonaEntity";

export class PersonaFactory {
  static create(config) {
    return new PersonaEntity(config);
  }
}
