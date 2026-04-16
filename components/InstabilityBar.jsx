import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../view/styles/theme';

export default function InstabilityBar({ instability, maxInstability, label }) {
  const width = `${(instability / maxInstability) * 100}%`;
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label} | IS {instability}/{maxInstability}</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minWidth: 140,
  },
  label: {
    color: theme.textDim,
    fontSize: 10,
    marginBottom: 4,
  },
  track: {
    height: 10,
    backgroundColor: '#11111e',
    borderRadius: 999,
    overflow: 'hidden',
  },
  fill: {
    height: 10,
    backgroundColor: theme.secondary,
  },
});
