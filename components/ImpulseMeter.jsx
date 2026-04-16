import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../view/styles/theme';

export default function ImpulseMeter({ impulse, maxImpulse }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>IMPULSO</Text>
      <Text style={styles.value}>{impulse} / {maxImpulse}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
  },
  label: {
    color: theme.textDim,
    fontSize: 10,
  },
  value: {
    color: theme.primary,
    fontWeight: '800',
    fontSize: 18,
  },
});
