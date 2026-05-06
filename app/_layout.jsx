import { useEffect } from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AppSettingsProvider } from "./Context/AppSettingsContext";
import { UserProvider } from "./Context/UserContext";
import { DeckBuilderProvider } from "./Context/DeckBuilderContext";
import { runMigrationOnce } from "./Service/MigrationService";

export default function Layout() {
  // Executar migração uma única vez ao iniciar o app
  useEffect(() => {
    async function initialize() {
      try {
        await runMigrationOnce();
      } catch (error) {
        console.error("Erro durante migração:", error);
      }
    }

    initialize();
  }, []);

  return (
    <AppSettingsProvider>
      <UserProvider>
        <DeckBuilderProvider>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false, animation: "fade" }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="home" />
            <Stack.Screen name="play" />
            <Stack.Screen name="settings" />
            <Stack.Screen name="deckbuilder" />
          </Stack>
        </DeckBuilderProvider>
      </UserProvider>
    </AppSettingsProvider>
  );
}
