import React, { useState, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "expo-router";
import * as Speech from "expo-speech";
import {
  getSavedVocabulary,
  deleteVocabularyItem,
  SavedVocabularyItem,
} from "@/services/storage";

export default function VocabularyScreen() {
  const [items, setItems] = useState<SavedVocabularyItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadVocab();
    }, [])
  );

  const loadVocab = async () => {
    const list = await getSavedVocabulary();
    setItems(list);
  };

  const handleSpeak = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: "en-US", rate: 0.85 });
  };

  const handleDelete = (item: SavedVocabularyItem, index: number) => {
    Alert.alert("Видалити вираз", `Видалити "${item.better}" зі словничка?`, [
      { text: "Скасувати", style: "cancel" },
      {
        text: "Видалити",
        style: "destructive",
        onPress: async () => {
          await deleteVocabularyItem(item.id || index);
          await loadVocab();
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark p-5">
      <View className="mb-4">
        <Text className="text-2xl font-bold text-white mb-1">
          Мій словничок 📖
        </Text>
        <Text className="text-xs text-slate-400">
          Корисні вирази та формулювання від Native Speaker, збережені під час
          діалогів.
        </Text>
      </View>

      {items.length === 0 ? (
        <View className="flex-1 items-center justify-center p-6">
          <Text className="text-4xl mb-3">💡</Text>
          <Text className="text-base font-bold text-white mb-1">
            Словник поки порожній
          </Text>
          <Text className="text-xs text-slate-400 text-center leading-relaxed">
            Під час рольової гри натискайте кнопку «+ У словник» на картках
            корисних порад AI.
          </Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item, index) => item.id || index.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item, index }) => (
            <View className="mb-3 rounded-2xl bg-background-card p-4 border border-slate-700">
              <View className="flex-row items-center justify-between mb-1.5">
                <View className="flex-1 pr-2">
                  <Text className="text-sm font-semibold text-teal-300 italic">
                    "{item.better}"
                  </Text>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <TouchableOpacity
                    onPress={() => handleSpeak(item.better)}
                    className="h-8 w-8 rounded-lg bg-primary/20 items-center justify-center border border-primary/30"
                  >
                    <Text className="text-xs">🔊</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleDelete(item, index)}
                    className="h-8 w-8 rounded-lg bg-rose-500/10 items-center justify-center border border-rose-500/30"
                  >
                    <Text className="text-xs">🗑️</Text>
                  </TouchableOpacity>
                </View>
              </View>
              {item.original ? (
                <Text className="text-xs text-slate-400 mt-1">
                  Початковий варіант:{" "}
                  <Text className="text-slate-300">{item.original}</Text>
                </Text>
              ) : null}
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}