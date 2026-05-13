import { useWindowDimensions, Image, StyleSheet, View } from "react-native";
import { useMemo } from "react";

const logoImage = require("../../assets/home-hero.png");

/**
 * Componente Logo
 * 
 * Exibe a logo do Tokusatsu Chronicle centralizada e responsiva.
 * O tamanho da logo se adapta ao tamanho da tela.
 * 
 * @param {Object} props
 * @param {number} props.maxWidth - Largura máxima da logo (padrão: 80% da tela)
 * @param {number} props.maxHeight - Altura máxima da logo (padrão: 200px)
 */
export function Logo({ maxWidth = "80%", maxHeight = 200 }) {
  const { width, height } = useWindowDimensions();
  
  // Calcula o tamanho responsivo da logo
  const logoSize = useMemo(() => {
    // Converte porcentagem para pixels se necessário
    const maxW = typeof maxWidth === "string" 
      ? (parseInt(maxWidth) / 100) * width 
      : maxWidth;
    
    // Usa proporção 16:9 do home-hero (1672 x 941)
    const aspectRatio = 1672 / 941;
    
    // Determina o tamanho final
    const finalWidth = Math.min(maxW, width * 0.95);
    const finalHeight = Math.min(maxHeight, finalWidth / aspectRatio);
    
    return {
      width: finalWidth,
      height: finalHeight
    };
  }, [width, height, maxWidth, maxHeight]);

  return (
    <View style={styles.container}>
      <Image
        source={logoImage}
        style={[styles.logo, logoSize]}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%"
  },
  logo: {
    // Estilos base, dimensões são aplicadas dinamicamente
  }
});
