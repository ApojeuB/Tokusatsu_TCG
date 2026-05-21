import { useMemo } from "react";
import { Image, StyleSheet, View, useWindowDimensions } from "react-native";

const logoImage = require("../../assets/Logo.png");

export function Logo({ maxWidth = "80%", maxHeight = 200 }) {
  const { width } = useWindowDimensions();

  const logoSize = useMemo(() => {
    const maxW = typeof maxWidth === "string"
      ? (parseInt(maxWidth, 10) / 100) * width
      : maxWidth;
    const finalWidth = Math.min(maxW, width * 0.95);
    const finalHeight = Math.min(maxHeight, finalWidth);

    return {
      width: finalWidth,
      height: finalHeight
    };
  }, [width, maxWidth, maxHeight]);

  return (
    <View style={styles.container}>
      <Image source={logoImage} style={[styles.logo, logoSize]} resizeMode="contain" />
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
    alignSelf: "center"
  }
});
