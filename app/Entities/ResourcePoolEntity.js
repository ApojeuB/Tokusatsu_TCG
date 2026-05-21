export class ResourcePoolEntity {
  constructor({ current = 0, temporary = 0, floating = 0 } = {}) {
    this.current = current;
    this.temporary = temporary;
    this.floating = floating;
  }
}
