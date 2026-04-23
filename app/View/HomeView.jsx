import { router } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import { NeonButton } from "../Components/NeonButton";
import { ScreenShell } from "../Components/ScreenShell";

const hero = require("../../assets/home-hero.png");

export function HomeView() {
  return (
    <ScreenShell title="Tokusatsu Chronicle" subtitle="Gem Comp" padded={false}>
      <View style={styles.container}>
        <View style={styles.heroWrap}>
          <Image source={hero} style={styles.hero} resizeMode="contain" />
        </View>

        <View style={styles.actions}>
          <Text style={styles.caption}>Escolha seu proximo passo</Text>
          <View style={styles.buttons}>
            <NeonButton label="Jogar" subtitle="Entrar em uma partida tematica" onPress={() => router.push("/play")} />
            <NeonButton label="Configuracao" subtitle="Ajustar audio, tema e preferencias" onPress={() => router.push("/settings")} />
            <NeonButton label="Deckbuilder" subtitle="Montar, revisar e testar seu deck" onPress={() => router.push("/deckbuilder")} />
          </View>
        </View>
      </View>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 24
  },
  heroWrap: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 8
  },
  hero: {
    width: "100%",
    height: "72%",
    alignSelf: "center"
  },
  actions: {
    marginTop: -24,
    paddingBottom: 4
  },
  caption: {
    color: "#d4dde7",
    fontSize: 14,
    marginBottom: 14,
    textAlign: "center",
    alignSelf: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(4, 8, 16, 0.72)",
    borderWidth: 1,
    borderColor: "rgba(246, 217, 79, 0.34)",
    overflow: "hidden"
  },
  buttons: {
    gap: 12
  }
});
