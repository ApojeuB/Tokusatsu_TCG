import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { theme } from '../view/styles/theme';

export default function HandArea({ hand, onPlayCard }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
      {hand.map((card) => (
        <TouchableOpacity key={card.id} style={styles.card} onPress={() => onPlayCard(card)}>
          <Text style={styles.name}>{card.name}</Text>
          <Text style={styles.cost}>Custo {card.cost}</Text>
          <Text style={styles.type}>{card.type}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    gap: 8,
    paddingVertical: 8,
  },
  card: {
    width: 140,
    backgroundColor: theme.surfaceAlt,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    borderRadius: 12,
    padding: 10,
  },
  name: {
    color: theme.text,
    fontWeight: '700',
  },
  cost: {
    color: theme.primary,
    marginTop: 4,
  },
  type: {
    color: theme.textDim,
    marginTop: 4,
    textTransform: 'uppercase',
    fontSize: 10,
  },
});
