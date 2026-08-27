import {
  StyleSheet,
  View,
  Text,
  Switch,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";

export default function SettingsScreen() {
  const { isDark, toggleTheme, colors } = useTheme();
  const clearCompleted = useMutation(api.todos.clearCompleted);
  const clearAll = useMutation(api.todos.clearAll);

  const handleClearCompleted = () => {
    Alert.alert(
      "Видалення виконаних",
      "Ви впевнені, що хочете видалити всі виконані завдання?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            try {
              await clearCompleted();
            } catch {
              Alert.alert("Помилка", "Не вдалося видалити виконані завдання");
            }
          },
        },
      ],
    );
  };

  const handleClearAll = () => {
    Alert.alert(
      "Видалення всіх завдань",
      "Ви впевнені, що хочете повністю очистити список завдань? Цю дію неможливо скасувати.",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити все",
          style: "destructive",
          onPress: async () => {
            try {
              await clearAll();
            } catch {
              Alert.alert("Помилка", "Не вдалося очистити завдання");
            }
          },
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Налаштування" />
      <View style={styles.content}>
        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Зовнішній вигляд
          </Text>
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.text }]}>
              Темна тема
            </Text>
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: "#767577", true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View
          style={[
            styles.section,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Управління даними
          </Text>
          <TouchableOpacity
            style={[styles.button, { borderColor: colors.border }]}
            onPress={handleClearCompleted}
            activeOpacity={0.7}
          >
            <Text style={[styles.buttonText, { color: colors.text }]}>
              Видалити виконані завдання
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.dangerButton,
              { borderColor: colors.error || "#FF3B30" },
            ]}
            onPress={handleClearAll}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.buttonText,
                { color: colors.error || "#FF3B30", fontWeight: "600" },
              ]}
            >
              Видалити всі завдання
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    gap: 16,
  },
  section: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLabel: {
    fontSize: 16,
  },
  button: {
    height: 44,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dangerButton: {
    marginTop: 4,
  },
  buttonText: {
    fontSize: 15,
  },
});
