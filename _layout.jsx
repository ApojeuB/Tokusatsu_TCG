import React from 'react';
import { Stack } from 'expo-router';
import { theme } from './view/styles/theme';

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: theme.surface },
        headerTintColor: theme.primary,
        contentStyle: { backgroundColor: theme.background },
      }}
    />
  );
}
