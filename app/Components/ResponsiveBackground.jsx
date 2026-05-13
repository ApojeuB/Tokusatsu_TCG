import { useWindowDimensions, ImageBackground, StyleSheet, View } from "react-native";
import { useMemo } from "react";

const cardBack = require("../../assets/card-back.png");
const homeHero = require("../../assets/home-hero.png");

/**
 * Componente ResponsiveBackground
 * 
 * Seleciona automaticamente o background correto baseado na plataforma/dimensões:
 * - Android/Mobile (largura < 600): card-back.png
 * - Web/Desktop (largura >= 600): home-hero.png
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - Conteúdo dentro do background
 * @param {number} props.opacity - Opacidade da imagem (0-1)
 * @param {string} props.overlayColor - Cor do overlay
 */
export function ResponsiveBackground({ children, opacity = 0.34, overlayColor = "rgba(1, 3, 9, 0.76)" }) {
  const { width } = useWindowDimensions();
  
  // Determina se é mobile ou desktop baseado na largura
  const isMobile = useMemo(() => width < 600, [width]);
  
  // Seleciona o background apropriado
  const backgroundSource = useMemo(() => {
    return isMobile ? cardBack : homeHero;
  }, [isMobile]);

  return (
    <ImageBackground 
      source={backgroundSource} 
      style={styles.background} 
      imageStyle={[styles.backgroundImage, { opacity }]}
    >
      <View style={[styles.overlay, { backgroundColor: overlayColor }]} />
      {children}
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: "#02050a"
  },
  backgroundImage: {
    opacity: 0.34
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(1, 3, 9, 0.76)"
  }
});
