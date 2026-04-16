import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../styles/theme';

export default function DeckBuilderScreen() {
  return (
    <View style={[globalStyles.screen, styles.container]}>
      <Text style={globalStyles.title}>Montar Deck</Text>
      <Text style={styles.text}>
        A base de validação de deck já está pronta no serviço. Esta tela ficou preparada como próxima etapa visual.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  text: {
    color: theme.textDim,
    marginTop: 12,
  },
});
