export class CardScriptEntity {
  constructor({ cardId, script, version = 1, validated = false }) {
    this.cardId = cardId;
    this.script = script;
    this.version = version;
    this.validated = validated;
  }
}
