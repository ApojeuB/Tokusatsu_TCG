import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppSettingsProvider } from "./Context/AppSettingsContext";
import { MenuMusicPlayer } from "./Components/MenuMusicPlayer";
import { DeckBuilderProvider } from "./Context/DeckBuilderContext";
import { UserProvider } from "./Context/UserContext";

export default function Layout() {
  return (
      <AppSettingsProvider>
        <MenuMusicPlayer />
        <DeckBuilderProvider>
          <UserProvider>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="home" />
              <Stack.Screen name="play" />
              <Stack.Screen name="settings" />
              <Stack.Screen name="deckbuilder" />
            </Stack>
          </UserProvider>
        </DeckBuilderProvider>
      </AppSettingsProvider>
  );
}
