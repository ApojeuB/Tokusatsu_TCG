import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../view/styles/theme';

export default function Card({ card, footer }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{card.name}</Text>
      <Text style={styles.meta}>{card.type.toUpperCase()} | Custo {card.cost}</Text>
      <Text style={styles.effect}>{card.effect}</Text>
      {footer}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.surface,
    borderColor: theme.surfaceBorder,
    borderWidth: 1,
    borderRadius: 14,
    padding: 10,
    width: 180,
  },
  name: {
    color: theme.primary,
    fontWeight: '800',
    fontSize: 13,
  },
  meta: {
    color: theme.textDim,
    fontSize: 11,
    marginTop: 4,
  },
  effect: {
    color: theme.text,
    fontSize: 11,
    marginTop: 6,
  },
});
