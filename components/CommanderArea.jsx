import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import InstabilityBar from './InstabilityBar';
import { theme } from '../view/styles/theme';

export default function CommanderArea({ commander, label }) {
  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text style={styles.name}>{commander.name}</Text>
        <Text style={styles.effect}>{commander.identityEffect}</Text>
      </View>
      <InstabilityBar instability={commander.instability} maxInstability={commander.maxInstability} label={label} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
  },
  info: {
    flex: 1,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    borderRadius: 14,
    padding: 10,
  },
  name: {
    color: theme.primary,
    fontSize: 13,
    fontWeight: '800',
  },
  effect: {
    color: theme.textDim,
    fontSize: 10,
    marginTop: 4,
  },
});
