import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { RoleplayScenario } from "@/types";

interface ScenarioCardProps {
  scenario: RoleplayScenario;
  onPress: () => void;
}

export const ScenarioCard: React.FC<ScenarioCardProps> = ({
  scenario,
  onPress,
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      className="mb-4 rounded-2xl bg-background-card p-5 border border-slate-700 shadow-lg active:border-primary"
    >
      <View className="flex-row items-center justify-between mb-2">
        <View className="flex-row items-center gap-3">
          <View className="h-12 w-12 rounded-xl bg-primary/20 items-center justify-center border border-primary/30">
            <Text className="text-2xl">{scenario.icon}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-white">
              {scenario.title}
            </Text>
            <Text className="text-xs text-primary-light font-medium">
              {scenario.subtitle}
            </Text>
          </View>
        </View>
      </View>
      <Text
        className="text-xs text-slate-300 mt-2 leading-relaxed"
        numberOfLines={2}
      >
        {scenario.description}
      </Text>
      <View className="mt-3 flex-row items-center gap-2 pt-3 border-t border-slate-800">
        <Text className="text-[11px] text-slate-400">Співрозмовник:</Text>
        <Text className="text-[11px] font-semibold text-slate-200">
          {scenario.partnerRole}
        </Text>
      </View>
    </TouchableOpacity>
  );
};