import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { theme } from '../view/styles/theme';

export default function UnitCard({ unit, onPress, isSelected }) {
  return (
    <TouchableOpacity
      style={[
        styles.card,
        unit.isGuard() && styles.guard,
        unit.isPressure() && styles.pressure,
        isSelected && styles.selected,
      ]}
      onPress={onPress}
    >
      <Text style={styles.name}>{unit.name}</Text>
      <View style={styles.stats}>
        <Text style={styles.stat}>ATK {unit.currentPower}</Text>
        <Text style={styles.stat}>DEF {unit.currentDefense}</Text>
      </View>
      <Text style={styles.tags}>{unit.tags.join(' / ')}</Text>
      {!!unit.materials.length && <Text style={styles.materials}>Materiais {unit.materials.length}</Text>}
      {unit.summoningSickness && <Text style={styles.status}>Fadiga</Text>}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 128,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    borderRadius: 14,
    padding: 10,
  },
  guard: {
    borderLeftWidth: 4,
    borderLeftColor: theme.guard,
  },
  pressure: {
    borderRightWidth: 4,
    borderRightColor: theme.pressure,
  },
  selected: {
    transform: [{ translateY: -4 }],
    borderColor: theme.primary,
  },
  name: {
    color: theme.text,
    fontWeight: '800',
    fontSize: 12,
  },
  stats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stat: {
    color: theme.primary,
    fontWeight: '700',
    fontSize: 11,
  },
  tags: {
    color: theme.textDim,
    marginTop: 6,
    fontSize: 9,
  },
  materials: {
    color: theme.generator,
    marginTop: 4,
    fontSize: 10,
  },
  status: {
    color: theme.textDim,
    marginTop: 4,
    fontSize: 10,
  },
});
