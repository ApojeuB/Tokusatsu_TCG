import React from "react";
import { TouchableOpacity, Text, View, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export function NeonButton({ label, subtitle, onPress, glowColor = "#fff", icon }) {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.touchable}>
      <View style={[styles.glowWrapper, { shadowColor: glowColor, borderColor: glowColor }]}>
        <LinearGradient
          colors={["#2a2d34", "#141518", "#08090a"]}
          style={styles.buttonContent}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
              name={icon} 
              size={32} 
              color={glowColor} 
              style={{ textShadowColor: glowColor, textShadowRadius: 12, textShadowOffset: { width: 0, height: 0 } }} 
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={[styles.label, { textShadowColor: glowColor }]}>{label}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
        </LinearGradient>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    width: "100%",
  },
  glowWrapper: {
    borderRadius: 12,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 10, 
    backgroundColor: "#000",
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10, 
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: "center",
    alignItems: "center",
    width: 44,
  },
  textContainer: {
    flex: 1,
    justifyContent: "center",
  },
  label: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  subtitle: {
    color: "#9ba4b5",
    fontSize: 12,
    marginTop: 4,
    fontWeight: "500",
  }
});
