export class ArsenalEntity {
  constructor({ storedCard = null, facedown = true, locked = false } = {}) {
    this.storedCard = storedCard;
    this.facedown = facedown;
    this.locked = locked;
  }
}
