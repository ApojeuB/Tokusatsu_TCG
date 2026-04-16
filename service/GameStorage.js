import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants/config';

export class GameStorage {
  static async saveState(serializedState) {
    await AsyncStorage.setItem(STORAGE_KEYS.GAME_STATE, JSON.stringify(serializedState));
  }

  static async loadState() {
    const raw = await AsyncStorage.getItem(STORAGE_KEYS.GAME_STATE);
    return raw ? JSON.parse(raw) : null;
  }
}
