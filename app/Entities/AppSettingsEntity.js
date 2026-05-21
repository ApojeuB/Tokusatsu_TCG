export class AppSettingsEntity {
  constructor({
    id = "default",
    musicVolume = 75,
    effectsVolume = 85,
    tipsEnabled = true,
    menuMusicEnabled = true,
    createdAt = new Date().toISOString(),
    updatedAt = new Date().toISOString()
  } = {}) {
    this.id = id;
    this.musicVolume = Math.max(0, Math.min(100, Number(musicVolume) || 0));
    this.effectsVolume = Math.max(0, Math.min(100, Number(effectsVolume) || 0));
    this.tipsEnabled = Boolean(tipsEnabled);
    this.menuMusicEnabled = Boolean(menuMusicEnabled);
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
