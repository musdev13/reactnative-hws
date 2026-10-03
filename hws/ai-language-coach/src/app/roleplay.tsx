import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import {
  useAudioRecorder,
  RecordingPresets,
  requestRecordingPermissionsAsync,
} from "expo-audio";
import { SCENARIOS } from "@/constants/scenarios";
import { buildRoleplaySystemPrompt } from "@/services/prompts";
import { sendRoleplayMessage, transcribeAudio } from "@/services/openrouter";
import { saveVocabularyItem } from "@/services/storage";
import { FeedbackCard } from "@/components/FeedbackCard";
import { LanguageLevel, RoleplayMessage } from "@/types";

export default function RoleplayScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    scenarioId: string;
    level: LanguageLevel;
  }>();

  const scenario =
    SCENARIOS.find((s) => s.id === params.scenarioId) || SCENARIOS[0];
  const level: LanguageLevel = (params.level as LanguageLevel) || "B1";

  const [messages, setMessages] = useState<RoleplayMessage[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);

  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    startRoleplay();

    return () => {
      Speech.stop();
    };
  }, []);

  const startRoleplay = async () => {
    setLoading(true);
    const systemPrompt = buildRoleplaySystemPrompt(scenario, level);

    try {
      const result = await sendRoleplayMessage({
        systemPrompt,
        history: [],
      });

      setMessages([
        {
          id: Date.now().toString(),
          role: "assistant",
          content: result.reply,
          timestamp: Date.now(),
        },
      ]);

      handleSpeak(result.reply);
    } catch (err: any) {
      Alert.alert("Помилка", err.message, [
        { text: "Назад", onPress: () => router.back() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!inputText.trim() || loading) return;

    const userText = inputText.trim();
    setInputText("");

    const userMsgId = Date.now().toString();
    const newUserMsg: RoleplayMessage = {
      id: userMsgId,
      role: "user",
      content: userText,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setLoading(true);

    const systemPrompt = buildRoleplaySystemPrompt(scenario, level);
    const history = messages.map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const result = await sendRoleplayMessage({
        systemPrompt,
        history,
        userMessage: userText,
      });

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === userMsgId ? { ...msg, feedback: result.feedback } : msg
        )
      );

      const assistantMsg: RoleplayMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: result.reply,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, assistantMsg]);

      handleSpeak(result.reply);
    } catch (err: any) {
      Alert.alert("Помилка зв'язку", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSpeak = (text: string) => {
    Speech.stop();
    Speech.speak(text, { language: "en-US", rate: 0.9 });
  };

  const handleSavePhrase = async (phrase: string) => {
    await saveVocabularyItem({ original: "", better: phrase });
    Alert.alert("Збережено", `Фразу "${phrase}" додано у ваш словничок!`);
  };

  const startVoiceRecording = async () => {
    try {
      Speech.stop();
      const perm = await requestRecordingPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(
          "Дозвіл на мікрофон",
          "Для голосової відповіді надайте застосунку дозвіл на використання мікрофона."
        );
        return;
      }

      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setIsRecording(true);
    } catch (err: any) {
      Alert.alert(
        "Помилка мікрофона",
        err.message || "Не вдалося розпочати запис аудіо."
      );
    }
  };

  const stopVoiceRecording = async () => {
    try {
      setIsRecording(false);
      setIsTranscribing(true);

      await audioRecorder.stop();
      const uri = audioRecorder.uri;

      if (uri) {
        const text = await transcribeAudio(uri);
        if (text && text.trim().length > 0) {
          setInputText((prev) =>
            prev.trim() ? `${prev.trim()} ${text.trim()}` : text.trim()
          );
        } else {
          Alert.alert(
            "Голос не розпізнано",
            "Спробуйте сказати фразу чіткіше або ближче до мікрофона англійською мовою."
          );
        }
      }
    } catch (err: any) {
      Alert.alert("Помилка розпізнавання Whisper", err.message);
    } finally {
      setIsTranscribing(false);
    }
  };

  const cancelVoiceRecording = async () => {
    try {
      await audioRecorder.stop();
    } catch {}
    setIsRecording(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-background-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <View className="flex-row items-center justify-between px-5 py-3.5 border-b border-slate-800 bg-background-card">
          <TouchableOpacity onPress={() => router.back()} className="py-1 pr-3">
            <Text className="text-primary-light font-bold text-sm">
              ✕ Вийти
            </Text>
          </TouchableOpacity>
          <View className="items-center flex-1">
            <Text className="text-sm font-bold text-white" numberOfLines={1}>
              {scenario.title}
            </Text>
            <Text className="text-[10px] text-teal-400 font-medium">
              {scenario.partnerRole} • Рівень {level}
            </Text>
          </View>
          <View className="w-12" />
        </View>

        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
          onContentSizeChange={() =>
            flatListRef.current?.scrollToEnd({ animated: true })
          }
          renderItem={({ item }) => {
            const isUser = item.role === "user";
            return (
              <View
                className={`mb-4 max-w-[88%] ${
                  isUser ? "self-end" : "self-start"
                }`}
              >
                <View
                  className={`rounded-2xl p-4 ${
                    isUser
                      ? "bg-primary border border-primary-light/40"
                      : "bg-background-card border border-slate-700"
                  }`}
                >
                  <View className="flex-row items-center justify-between mb-1">
                    <Text className="text-[10px] font-semibold text-slate-300">
                      {isUser ? "Ви (Student)" : scenario.partnerRole}
                    </Text>
                    {!isUser && (
                      <TouchableOpacity
                        onPress={() => handleSpeak(item.content)}
                        className="pl-2"
                      >
                        <Text className="text-xs">🔊</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                  <Text className="text-sm text-white leading-relaxed">
                    {item.content}
                  </Text>
                </View>

                {isUser && item.feedback && (
                  <FeedbackCard
                    feedback={item.feedback}
                    onSavePhrase={handleSavePhrase}
                  />
                )}
              </View>
            );
          }}
        />

        {loading && (
          <View className="flex-row items-center gap-2 px-5 py-2">
            <ActivityIndicator size="small" color="#818CF8" />
            <Text className="text-xs text-slate-400">
              {scenario.partnerRole} відповідає...
            </Text>
          </View>
        )}

        {isTranscribing && (
          <View className="flex-row items-center gap-2 px-5 py-2 bg-slate-900/90 border-t border-slate-800">
            <ActivityIndicator size="small" color="#14B8A6" />
            <Text className="text-xs text-teal-300 font-medium">
              Whisper AI розпізнає вашу вимову... 🎙️
            </Text>
          </View>
        )}

        {isRecording ? (
          <View className="flex-row items-center justify-between p-3 border-t border-rose-500/40 bg-slate-900">
            <View className="flex-row items-center gap-2 flex-1 pl-2">
              <View className="h-3 w-3 rounded-full bg-rose-500" />
              <Text className="text-xs font-semibold text-rose-300">
                Запис... Говоріть англійською
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={cancelVoiceRecording}
                activeOpacity={0.8}
                className="px-3 py-2 rounded-xl bg-slate-800 border border-slate-700"
              >
                <Text className="text-xs text-slate-300 font-semibold">✕</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={stopVoiceRecording}
                activeOpacity={0.8}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 flex-row items-center gap-1.5"
              >
                <Text className="text-xs font-bold text-slate-900">
                  ✓ Готово
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View className="flex-row items-center gap-2 p-3 border-t border-slate-800 bg-background-card">
            <TouchableOpacity
              onPress={startVoiceRecording}
              disabled={loading || isTranscribing}
              activeOpacity={0.8}
              className={`h-11 w-11 rounded-xl items-center justify-center border ${
                loading || isTranscribing
                  ? "bg-slate-800/40 border-slate-800 opacity-40"
                  : "bg-slate-900 border-teal-500/40 active:border-teal-400"
              }`}
            >
              <Text className="text-lg">🎙️</Text>
            </TouchableOpacity>

            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder="Напишіть або натисніть 🎙️ для голосу..."
              placeholderTextColor="#64748B"
              multiline
              autoCapitalize="sentences"
              className="flex-1 rounded-xl bg-slate-900 px-4 py-3 text-white text-xs max-h-24 border border-slate-700"
            />

            <TouchableOpacity
              onPress={handleSend}
              disabled={!inputText.trim() || loading || isTranscribing}
              activeOpacity={0.8}
              className={`h-11 w-11 rounded-xl items-center justify-center ${
                !inputText.trim() || loading || isTranscribing
                  ? "bg-slate-800 opacity-50"
                  : "bg-primary active:bg-primary-dark"
              }`}
            >
              <Text className="text-white font-bold text-sm">➤</Text>
            </TouchableOpacity>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}