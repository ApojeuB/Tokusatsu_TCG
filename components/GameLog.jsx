import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { theme } from '../view/styles/theme';

export default function GameLog({ messages }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log</Text>
      <ScrollView style={styles.scroll}>
        {messages.map((entry) => (
          <Text key={entry.id} style={styles.message}>
            {entry.message}
          </Text>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    padding: 10,
    minHeight: 120,
  },
  title: {
    color: theme.primary,
    fontWeight: '800',
    marginBottom: 6,
  },
  scroll: {
    maxHeight: 120,
  },
  message: {
    color: theme.textDim,
    fontSize: 11,
    marginBottom: 4,
  },
});
