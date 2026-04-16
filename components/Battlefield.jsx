import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import UnitCard from './UnitCard';

export default function Battlefield({ units, onUnitPress, selectedUnitId }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <View style={styles.row}>
        {units.map((unit) => (
          <UnitCard
            key={unit.id}
            unit={unit}
            onPress={() => onUnitPress(unit)}
            isSelected={selectedUnitId === unit.id}
          />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 8,
  },
});
