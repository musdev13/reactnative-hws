import AsyncStorage from '@react-native-async-storage/async-storage';
import { TravelPlace } from '../types/travel';

// Ключ сховища містить префікс @ та версію схеми (_v1)
const STORAGE_KEY = '@travel_wishlist_places_v1';

/**
 * Завантажує збережені локації з AsyncStorage.
 */
export const loadPlacesFromStorage = async (): Promise<TravelPlace[]> => {
  try {
    const rawData = await AsyncStorage.getItem(STORAGE_KEY);
    if (!rawData) {
      return [];
    }
    return JSON.parse(rawData) as TravelPlace[];
  } catch (error) {
    console.error('Помилка під час читання з AsyncStorage:', error);
    return [];
  }
};

/**
 * Зберігає оновлений масив локацій у сховище.
 */
export const savePlacesToStorage = async (places: TravelPlace[]): Promise<boolean> => {
  try {
    const jsonString = JSON.stringify(places);
    await AsyncStorage.setItem(STORAGE_KEY, jsonString);
    return true;
  } catch (error) {
    console.error('Помилка під час запису в AsyncStorage:', error);
    return false;
  }
};
