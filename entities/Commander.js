import { GAME_CONFIG } from '../constants/config';

export class Commander {
  constructor({
    id,
    name,
    identityName,
    identityEffect,
    finalizerName,
    finalizerCondition,
    maxInstability = GAME_CONFIG.startingInstability,
    startingImpulse = GAME_CONFIG.startingImpulse,
    instability = maxInstability,
    finalizerUsed = false,
  }) {
    this.id = id;
    this.name = name;
    this.identityName = identityName;
    this.identityEffect = identityEffect;
    this.finalizerName = finalizerName;
    this.finalizerCondition = finalizerCondition;
    this.maxInstability = maxInstability;
    this.startingImpulse = startingImpulse;
    this.instability = instability;
    this.finalizerUsed = finalizerUsed;
  }

  takeDamage(amount) {
    this.instability = Math.max(0, this.instability - amount);
  }

  isVulnerable() {
    return this.instability <= GAME_CONFIG.vulnerabilityThreshold;
  }

  toJSON() {
    return {
      id: this.id,
      name: this.name,
      identityName: this.identityName,
      identityEffect: this.identityEffect,
      finalizerName: this.finalizerName,
      finalizerCondition: this.finalizerCondition,
      maxInstability: this.maxInstability,
      startingImpulse: this.startingImpulse,
      instability: this.instability,
      finalizerUsed: this.finalizerUsed,
    };
  }
}
