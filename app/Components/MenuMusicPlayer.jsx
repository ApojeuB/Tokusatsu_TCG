import { Audio } from "expo-av";
import { usePathname } from "expo-router";
import { useEffect, useRef } from "react";
import { useAppSettings } from "../Context/AppSettingsContext";

const menuTheme = require("../../assets/menu-theme.m4a");

function isBattleRoute(pathname) {
  return pathname === "/play" || pathname?.startsWith("/play/");
}

export function MenuMusicPlayer() {
  const pathname = usePathname();
  const { hydrated, menuMusicEnabled, musicVolume } = useAppSettings();
  const soundRef = useRef(null);
  const shouldPlay = hydrated && menuMusicEnabled && musicVolume > 0 && !isBattleRoute(pathname);

  useEffect(() => {
    let cancelled = false;

    async function ensureSound() {
      if (soundRef.current) {
        return soundRef.current;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DUCK_OTHERS,
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

      if (cancelled) {
        await sound.unloadAsync();
        return null;
      }

      soundRef.current = sound;
      return sound;
    }

    async function syncPlayback() {
      try {
        const sound = await ensureSound();

        if (!sound) {
          return;
        }

        await sound.setVolumeAsync(musicVolume / 100);

        if (shouldPlay) {
          await sound.playAsync();
        } else {
          await sound.pauseAsync();
        }
      } catch {
        // Autoplay pode ser bloqueado no web; mobile volta a tocar quando permitido.
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
