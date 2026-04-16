import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../styles/theme';

const buttons = [
  { label: 'NOVA BATALHA', route: 'Game' },
  { label: 'MONTAR DECK', route: 'DeckBuilder' },
  { label: 'MESTRE DE CARTAS', route: 'CardMaster' },
  { label: 'TUTORIAL', route: 'Tutorial' },
];

export default function MainMenuScreen({ navigation }) {
  return (
    <View style={[globalStyles.screen, styles.container]}>
      <Text style={styles.logo}>TOKUSATSU CARD GAME</Text>
      <Text style={styles.caption}>Finalizador, Impulso e duelos temáticos em clima de clímax.</Text>
      <View style={styles.actions}>
        {buttons.map((button) => (
          <TouchableOpacity
            key={button.route}
            style={styles.button}
            onPress={() => navigation.navigate(button.route)}
          >
            <Text style={styles.buttonText}>{button.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    color: theme.primary,
    fontSize: 34,
    fontWeight: '900',
    textAlign: 'center',
  },
  caption: {
    color: theme.textDim,
    fontSize: 15,
    textAlign: 'center',
    marginTop: 12,
    maxWidth: 620,
  },
  actions: {
    marginTop: 28,
    width: '100%',
    maxWidth: 360,
    gap: 12,
  },
  button: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: theme.text,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
});
