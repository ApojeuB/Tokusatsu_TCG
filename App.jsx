import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import MainMenuScreen from './view/screens/MainMenuScreen';
import GameScreen from './view/screens/GameScreen';
import DeckBuilderScreen from './view/screens/DeckBuilderScreen';
import CardMasterScreen from './view/screens/CardMasterScreen';
import CardEditorScreen from './view/screens/CardEditorScreen';
import TutorialScreen from './view/screens/TutorialScreen';
import { theme } from './view/styles/theme';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: theme.background,
    card: theme.surface,
    text: theme.text,
    primary: theme.primary,
    border: theme.surfaceBorder,
  },
};

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" />
          <Stack.Navigator
            initialRouteName="MainMenu"
            screenOptions={{
              headerStyle: { backgroundColor: theme.surface },
              headerTintColor: theme.primary,
              headerTitleStyle: { fontWeight: '800' },
              contentStyle: { backgroundColor: theme.background },
            }}
          >
            <Stack.Screen
              name="MainMenu"
              component={MainMenuScreen}
              options={{ title: 'TOKUSATSU TCG', headerShown: false }}
            />
            <Stack.Screen
              name="Game"
              component={GameScreen}
              options={{ title: 'Batalha', headerShown: false }}
            />
            <Stack.Screen
              name="DeckBuilder"
              component={DeckBuilderScreen}
              options={{ title: 'Montar Deck' }}
            />
            <Stack.Screen
              name="CardMaster"
              component={CardMasterScreen}
              options={{ title: 'Mestre de Cartas' }}
            />
            <Stack.Screen
              name="CardEditor"
              component={CardEditorScreen}
              options={{ title: 'Editor de Carta' }}
            />
            <Stack.Screen
              name="Tutorial"
              component={TutorialScreen}
              options={{ title: 'Tutorial' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
