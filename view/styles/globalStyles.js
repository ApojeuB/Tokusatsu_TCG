import { StyleSheet } from 'react-native';
import { theme } from './theme';

export const globalStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.background,
  },
  panel: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.surfaceBorder,
    padding: 12,
  },
  title: {
    color: theme.primary,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: theme.textDim,
    fontSize: 14,
  },
  text: {
    color: theme.text,
  },
});
