import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { theme } from '../styles/theme';

export default function TutorialScreen() {
  return (
    <ScrollView style={globalStyles.screen} contentContainerStyle={styles.container}>
      <Text style={globalStyles.title}>Tutorial</Text>
      <Text style={styles.text}>1. Ganhe 1 Impulso na preparação e compre 1 carta.</Text>
      <Text style={styles.text}>2. Jogue cartas na fase principal respeitando custo e identidade.</Text>
      <Text style={styles.text}>3. Unidades GUARD devem ser atacadas primeiro.</Text>
      <Text style={styles.text}>4. Quando o comandante inimigo cair para IS 5 ou menos, procure seu finalizador.</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 10,
  },
  text: {
    color: theme.text,
  },
});
