import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { SCENARIOS } from "@/constants/scenarios";
import { ScenarioCard } from "@/components/ScenarioCard";
import { LanguageLevel, RoleplayScenario } from "@/types";

export default function HomeScreen() {
  const router = useRouter();
  const [selectedLevel, setSelectedLevel] = useState<LanguageLevel>("B1");

  const levels: Array<{ id: LanguageLevel; label: string; desc: string }> = [
    { id: "A2", label: "A2 Elementary", desc: "Прості речення" },
    { id: "B1", label: "B1 Intermediate", desc: "Робоча мова" },
    { id: "B2", label: "B2 Upper-Int", desc: "Вільний діалог" },
  ];

  const handleStartScenario = (scenario: RoleplayScenario) => {
    router.push({
      pathname: "/roleplay",
      params: {
        scenarioId: scenario.id,
        level: selectedLevel,
      },
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text className="text-2xl font-bold text-white mb-1">
            AI Language Coach 🗣️
          </Text>
          <Text className="text-xs text-slate-400">
            Обирайте рольову ситуацію та вдосконалюйте розмовну англійську в
            реальному часі.
          </Text>
        </View>

        <Text className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2.5">
          Ваш рівень англійської (CEFR):
        </Text>
        <View className="flex-row gap-2 mb-6">
          {levels.map((lvl) => {
            const active = selectedLevel === lvl.id;
            return (
              <TouchableOpacity
                key={lvl.id}
                onPress={() => setSelectedLevel(lvl.id)}
                activeOpacity={0.8}
                className={`flex-1 rounded-xl p-3 border ${
                  active
                    ? "bg-primary/20 border-primary"
                    : "bg-background-card border-slate-700"
                }`}
              >
                <Text
                  className={`text-xs font-bold ${
                    active ? "text-primary-light" : "text-white"
                  }`}
                >
                  {lvl.label}
                </Text>
                <Text className="text-[10px] text-slate-400 mt-0.5">
                  {lvl.desc}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text className="text-xs font-semibold text-slate-300 uppercase tracking-wider mb-3">
          Доступні рольові сценарії:
        </Text>
        {SCENARIOS.map((scenario) => (
          <ScenarioCard
            key={scenario.id}
            scenario={scenario}
            onPress={() => handleStartScenario(scenario)}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}