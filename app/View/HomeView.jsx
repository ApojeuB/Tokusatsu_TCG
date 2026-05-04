import { router } from "expo-router";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { NeonButton } from "../Components/NeonButton";
import { ScreenShell } from "../Components/ScreenShell";
import { useUser } from "../Context/UserContext";

const hero = require("../../assets/home-hero.png");


export function HomeView() {
  
  const { currentUser, logoutUser } = useUser();

  const handleLogout = () => {
    logoutUser();          
    router.replace("/"); 
  };

  return (
    <ScreenShell title="Tokusatsu Chronicle" subtitle={
      <View style={styles.userRow}>
        <Text style={styles.subtitleText}>
          Gem Comp | Bem-Vindo:
        </Text>

        <Text style={styles.username}>
          {currentUser?.username ?? "Visitante"}
        </Text>
          <View style={styles.statusDot} />
      </View>
      }padded={false}>
      <ImageBackground 
        source={hero} 
        style={styles.background} 
        resizeMode="cover"
        accessibilityLabel="Herói do Tokusatsu Chronicle em destaque"
      >
        <View style={styles.overlay}>
          
          <View style={styles.actions}>
            <Text style={styles.caption}>Escolha seu próximo passo</Text>
            
            <View style={styles.buttons}>
              <NeonButton 
                label="Jogar" 
                subtitle="Entrar em uma partida temática" 
                onPress={() => router.push("/play")} 
              />
              <NeonButton 
                label="Configuração" 
                subtitle="Ajustar áudio, tema e preferências" 
                onPress={() => router.push("/settings")} 
              />
              <NeonButton 
                label="Deckbuilder" 
                subtitle="Montar, revisar e testar seu deck" 
                onPress={() => router.push("/deckbuilder")} 
              />
              <NeonButton 
                label="Sair" 
                subtitle="Sair da conta atual" 
                onPress={handleLogout} 
              />
            </View>
          </View>

        </View>
      </ImageBackground>
    </ScreenShell>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.45)", 
    justifyContent: "flex-end", 
    paddingHorizontal: 18,
    paddingBottom: 48, 
  },
  actions: {
    width: "100%",
  },
  caption: {
    color: "#d4dde7",
    fontSize: 14,
    marginBottom: 20,
    textAlign: "center",
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(4, 8, 16, 0.8)",
    borderWidth: 1,
    borderColor: "rgba(246, 217, 79, 0.6)",
    overflow: "hidden",
    // Adicionando um leve brilho no texto da legenda também
    textShadowColor: "rgba(246, 217, 79, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  userRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexWrap: "wrap",
    gap: 4
  },

  subtitleText: {
    color: "#d4dde7"
  },

  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6
  },

  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 999,
    backgroundColor: "#00ff88" // 🟢 verde online
  },

  username: {
    color: "#00ff88",
    fontWeight: "bold"
  },
  buttons: {
    gap: 16, 
  }
});
