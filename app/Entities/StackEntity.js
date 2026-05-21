export class StackEntity {
  constructor({ id = `stack-${Date.now()}`, items = [], resolving = false } = {}) {
    this.id = id;
    this.items = items;
    this.resolving = resolving;
  }
}
