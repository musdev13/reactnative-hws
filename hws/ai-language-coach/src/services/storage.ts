import * as SecureStore from "expo-secure-store";

const API_KEY_STORAGE = "user_openrouter_key";
const MODEL_STORAGE = "user_selected_model";
const VOCABULARY_STORAGE = "user_saved_vocabulary";

export async function saveApiKey(key: string): Promise<void> {
  await SecureStore.setItemAsync(API_KEY_STORAGE, key.trim());
}

export async function getApiKey(): Promise<string | null> {
  try {
    const key = await SecureStore.getItemAsync(API_KEY_STORAGE);
    if (key && key.trim().length > 0) return key.trim();
  } catch {}

  const envKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
  if (envKey && envKey.trim().length > 0) return envKey.trim();

  return null;
}

export async function getCustomApiKey(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(API_KEY_STORAGE);
  } catch {
    return null;
  }
}

export function getEnvApiKey(): string | null {
  const envKey = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY;
  return envKey && envKey.trim().length > 0 ? envKey.trim() : null;
}

export async function deleteApiKey(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(API_KEY_STORAGE);
  } catch {}
}

export async function saveSelectedModel(model: string): Promise<void> {
  await SecureStore.setItemAsync(MODEL_STORAGE, model);
}

export async function getSelectedModel(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(MODEL_STORAGE);
  } catch {
    return null;
  }
}

// ==========================================
// Словничок збережених фраз (Vocabulary)
// ==========================================

export interface SavedVocabularyItem {
  id?: string;
  original: string;
  better: string;
  tip?: string;
  timestamp?: number;
}

export async function saveVocabularyItem(
  item: SavedVocabularyItem
): Promise<void> {
  try {
    const current = await getSavedVocabulary();
    const exists = current.some(
      (v) =>
        v.better.toLowerCase().trim() === item.better.toLowerCase().trim()
    );
    if (exists) return;

    const newItem: SavedVocabularyItem = {
      ...item,
      id: item.id || Date.now().toString(),
      timestamp: item.timestamp || Date.now(),
    };

    const updated = [newItem, ...current];
    await SecureStore.setItemAsync(
      VOCABULARY_STORAGE,
      JSON.stringify(updated)
    );
  } catch {}
}

export async function getSavedVocabulary(): Promise<SavedVocabularyItem[]> {
  try {
    const data = await SecureStore.getItemAsync(VOCABULARY_STORAGE);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export async function deleteVocabularyItem(
  idOrIndex: string | number
): Promise<void> {
  try {
    const current = await getSavedVocabulary();
    const updated = current.filter((item, index) => {
      if (typeof idOrIndex === "number") return index !== idOrIndex;
      return item.id !== idOrIndex;
    });
    await SecureStore.setItemAsync(
      VOCABULARY_STORAGE,
      JSON.stringify(updated)
    );
  } catch {}
}