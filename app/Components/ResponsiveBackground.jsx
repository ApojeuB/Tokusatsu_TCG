import { useMemo } from "react";
import { ImageBackground, StyleSheet, View, useWindowDimensions } from "react-native";

const androidBackground = require("../../assets/background_Android.png");
const desktopBackground = require("../../assets/background_Pc.png");

export function ResponsiveBackground({
  children,
  opacity = 0.34,
  overlayColor = "rgba(1, 3, 9, 0.76)"
}) {
  const { width } = useWindowDimensions();
  const isMobile = useMemo(() => width < 600, [width]);
  const backgroundSource = isMobile ? androidBackground : desktopBackground;

  return (
    <ImageBackground
      source={backgroundSource}
      style={styles.background}
      imageStyle={[styles.backgroundImage, { opacity }]}
      resizeMode="cover"
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
