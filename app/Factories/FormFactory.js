import { FormEntity } from "../Entities/FormEntity";

export class FormFactory {
  static create(config) {
    return new FormEntity(config);
  }
}
