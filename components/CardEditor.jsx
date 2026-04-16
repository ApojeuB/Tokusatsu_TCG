import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { theme } from '../view/styles/theme';

export default function CardEditor({ card, setCard }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nome</Text>
      <TextInput style={styles.input} value={card.name} onChangeText={(name) => setCard({ ...card, name })} />
      <Text style={styles.label}>Efeito</Text>
      <TextInput
        multiline
        style={[styles.input, styles.textarea]}
        value={card.effect}
        onChangeText={(effect) => setCard({ ...card, effect })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    color: theme.primary,
    fontWeight: '700',
  },
  input: {
    backgroundColor: theme.surfaceAlt,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    borderRadius: 10,
    padding: 10,
  },
  textarea: {
    minHeight: 90,
    textAlignVertical: 'top',
  },
});
