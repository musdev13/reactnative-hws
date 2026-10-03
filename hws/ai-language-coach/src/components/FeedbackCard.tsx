import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { FeedbackData } from "@/types";

interface FeedbackCardProps {
  feedback: FeedbackData;
  onSavePhrase?: (phrase: string) => void;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({
  feedback,
  onSavePhrase,
}) => {
  if (!feedback.hasCorrection && !feedback.betterPhrasing) {
    return null;
  }

  return (
    <View className="mt-2.5 rounded-xl bg-slate-900/90 p-3 border border-slate-700">
      <View className="flex-row items-center justify-between mb-1.5">
        <View className="flex-row items-center gap-1.5">
          <Text className="text-xs">
            {feedback.hasCorrection ? "🟡" : "🟢"}
          </Text>
          <Text
            className={`text-[11px] font-bold ${
              feedback.hasCorrection ? "text-amber-400" : "text-emerald-400"
            }`}
          >
            {feedback.hasCorrection
              ? "Граматична порада:"
              : "Чудова граматика! 👍"}
          </Text>
        </View>
        {feedback.betterPhrasing && onSavePhrase && (
          <TouchableOpacity
            onPress={() => onSavePhrase(feedback.betterPhrasing)}
            className="px-2 py-0.5 rounded-md bg-primary/20 border border-primary/40"
          >
            <Text className="text-[10px] font-semibold text-primary-light">
              + У словник
            </Text>
          </TouchableOpacity>
        )}
      </View>

      {feedback.hasCorrection && feedback.correction ? (
        <Text className="text-xs text-slate-200 leading-snug mb-1.5">
          {feedback.correction}
        </Text>
      ) : null}

      {feedback.betterPhrasing ? (
        <View className="pt-1.5 border-t border-slate-800">
          <Text className="text-[10px] text-slate-400 mb-0.5">
            Як каже Native Speaker:
          </Text>
          <Text className="text-xs font-semibold text-teal-300 italic">
            "{feedback.betterPhrasing}"
          </Text>
        </View>
      ) : null}
    </View>
  );
};