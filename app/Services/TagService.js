import {
  createKeywordEntities,
  createTagEffects,
  createTagTriggers,
  findTagDefinition,
  getCardTagBindings,
  resolveTagEffect,
  TAG_DEFINITIONS
} from "../Rules/TagRules";

export class TagService {
  static getDefinitions() {
    return TAG_DEFINITIONS;
  }

  static getKeywords() {
    return createKeywordEntities();
  }

  static findDefinition(value) {
    return findTagDefinition(value);
  }

  static getCardBindings(card) {
    return getCardTagBindings(card);
  }

  static createEffects(card) {
    return createTagEffects(card);
  }

  static createTriggers(card) {
    return createTagTriggers(card);
  }

  static resolve(tagId, matchState, sourceCard, event) {
    return resolveTagEffect(tagId, matchState, sourceCard, event);
  }
}
