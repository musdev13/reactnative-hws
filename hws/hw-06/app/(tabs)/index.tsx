import { StyleSheet, View, ActivityIndicator, Text } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/Header";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import { useTheme } from "@/context/ThemeContext";

export default function HomeScreen() {
  const { colors } = useTheme();
  const user = useQuery(api.users.currentUser);
  const todos = useQuery(api.todos.getTodos);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Мої завдання" />

      <View style={styles.content}>
        {user && (
          <Text style={[styles.greeting, { color: colors.text }]}>
            Привіт, {user.name || user.email || "користувач"}!
          </Text>
        )}

        <TodoForm />

        {todos === undefined ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Завантаження завдань...
            </Text>
          </View>
        ) : (
          <TodoList todos={todos} />
        )}
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
  },
  greeting: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
});
