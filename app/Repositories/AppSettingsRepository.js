import { AppSettingsEntity } from "../Entities/AppSettingsEntity";
import { executeSql, getFirst } from "../DataBase";

function mapSettings(row) {
  if (!row) {
    return new AppSettingsEntity();
  }

  return new AppSettingsEntity({
    id: row.id,
    musicVolume: row.musicVolume,
    effectsVolume: row.effectsVolume,
    tipsEnabled: Boolean(row.tipsEnabled),
    menuMusicEnabled: Boolean(row.menuMusicEnabled),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt
  });
}

export const AppSettingsRepository = {
  async getSettings() {
    return mapSettings(await getFirst("SELECT * FROM app_settings WHERE id = ?", ["default"]));
  },

  async saveSettings(settings) {
    const entity = settings instanceof AppSettingsEntity
      ? settings
      : new AppSettingsEntity(settings);
    const timestamp = new Date().toISOString();

    await executeSql(
      `INSERT INTO app_settings (
        id, musicVolume, effectsVolume, tipsEnabled, menuMusicEnabled, createdAt, updatedAt
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        musicVolume = excluded.musicVolume,
        effectsVolume = excluded.effectsVolume,
        tipsEnabled = excluded.tipsEnabled,
        menuMusicEnabled = excluded.menuMusicEnabled,
        updatedAt = excluded.updatedAt`,
      [
        entity.id,
        entity.musicVolume,
        entity.effectsVolume,
        entity.tipsEnabled ? 1 : 0,
        entity.menuMusicEnabled ? 1 : 0,
        entity.createdAt ?? timestamp,
        timestamp
      ]
    );

    return new AppSettingsEntity({
      ...entity,
      updatedAt: timestamp
    });
  }
};
