import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { initDatabase } from "../DataBase";
import { AppSettingsEntity } from "../Entities/AppSettingsEntity";
import { AppSettingsRepository } from "../Repositories/AppSettingsRepository";

const AppSettingsContext = createContext(null);

function clampVolume(value) {
  return Math.max(0, Math.min(100, Math.round(Number(value) || 0)));
}

export function AppSettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => new AppSettingsEntity());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function hydrateSettings() {
      try {
        await initDatabase();
        const nextSettings = await AppSettingsRepository.getSettings();

        if (!cancelled) {
          setSettings(nextSettings);
        }
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    }

    hydrateSettings();

    return () => {
      cancelled = true;
    };
  }, []);

  const persistSettings = async (nextSettings) => {
    setSettings(nextSettings);

    try {
      await AppSettingsRepository.saveSettings(nextSettings);
    } catch {
      // As preferencias continuam em memoria se o storage local falhar.
    }
  };

  const setMusicVolume = (value) => {
    const nextSettings = new AppSettingsEntity({
      ...settings,
      musicVolume: clampVolume(value),
      updatedAt: new Date().toISOString()
    });
    persistSettings(nextSettings);
  };

  const setEffectsVolume = (value) => {
    const nextSettings = new AppSettingsEntity({
      ...settings,
      effectsVolume: clampVolume(value),
      updatedAt: new Date().toISOString()
    });
    persistSettings(nextSettings);
  };

  const setTipsEnabled = (valueOrUpdater) => {
    const nextValue = typeof valueOrUpdater === "function"
      ? valueOrUpdater(settings.tipsEnabled)
      : valueOrUpdater;
    const nextSettings = new AppSettingsEntity({
      ...settings,
      tipsEnabled: Boolean(nextValue),
      updatedAt: new Date().toISOString()
    });
    persistSettings(nextSettings);
  };

  const setMenuMusicEnabled = (valueOrUpdater) => {
    const nextValue = typeof valueOrUpdater === "function"
      ? valueOrUpdater(settings.menuMusicEnabled)
      : valueOrUpdater;
    const nextSettings = new AppSettingsEntity({
      ...settings,
      menuMusicEnabled: Boolean(nextValue),
      updatedAt: new Date().toISOString()
    });
    persistSettings(nextSettings);
  };

  const value = useMemo(() => ({
    hydrated,
    settings,
    musicVolume: settings.musicVolume,
    setMusicVolume,
    effectsVolume: settings.effectsVolume,
    setEffectsVolume,
    tipsEnabled: settings.tipsEnabled,
    setTipsEnabled,
    menuMusicEnabled: settings.menuMusicEnabled,
    setMenuMusicEnabled
  }), [hydrated, settings]);

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);

  if (!context) {
    throw new Error("useAppSettings must be used inside AppSettingsProvider.");
  }

  return context;
}
