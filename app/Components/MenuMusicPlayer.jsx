import { Audio } from "expo-av";
import { usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { useAppSettings } from "../Context/AppSettingsContext";

const menuTheme = require("../../assets/menu-theme.m4a");

function isBattleRoute(pathname) {
  return pathname === "/play" || pathname?.startsWith("/play/");
}


const soundRef = {
  current: null
};

export async function ensureSound(musicVolume = 75) {
  if (soundRef.current) {
    return soundRef.current;
  }

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: false,
    playsInSilentModeIOS: true,
    shouldDuckAndroid: true,
    playThroughEarpieceAndroid: false,
    staysActiveInBackground: false
  });

  const { sound } = await Audio.Sound.createAsync(
    menuTheme,
    {
      isLooping: true,
      shouldPlay: false,
      volume: musicVolume / 100
    }
  );

  soundRef.current = sound;

  return sound;
}

export function MenuMusicPlayer() {
  const pathname = usePathname();
  const { hydrated, menuMusicEnabled, musicVolume } = useAppSettings();
  const shouldPlay = hydrated && menuMusicEnabled && musicVolume > 0 && !isBattleRoute(pathname);

  useEffect(() => {
    let cancelled = false;

    async function syncPlayback() {
      try {
        const sound = await ensureSound();

        if (!sound) {
          return;
        }

        await sound.setVolumeAsync(musicVolume / 100);

        if (shouldPlay && globalThis.audioUnlocked) {
            await sound.playAsync();
        } else {
          await sound.pauseAsync();
        }
      } catch (error) {
        console.log("Erro audio:", error);
      }
    }

    syncPlayback();

    return () => {
      cancelled = true;
    };
  }, [musicVolume, shouldPlay]);

  useEffect(() => {
    return () => {
      const sound = soundRef.current;
      soundRef.current = null;
      sound?.unloadAsync?.();
    };
  }, []);

  return null;
}
