import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Header } from "@/components/Header";
import { TodoForm } from "@/components/TodoForm";
import { TodoList } from "@/components/TodoList";
import type { Todo } from "@/types";
import {
  addTodo,
  deleteTodo,
  getTodos,
  toggleTodo,
  updateTodoText,
} from "@/services/api";

export default function Index() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTodos = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError(null);

      const data = await getTodos();
      setTodos(data);
    } catch (err) {
      setError(
        "Не вдалося з'єднатися з json-server. Переконайтеся, що сервер запущено на порту 3000.",
      );
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (text: string) => {
    try {
      const newTodo = await addTodo(text);
      setTodos((prev) => [...prev, newTodo]);
    } catch (err) {
      Alert.alert(
        "Помилка",
        "Не вдалося додати завдання. Перевірте з'єднання з сервером.",
      );
      console.error(err);
    }
  };

  const handleToggle = async (id: string, completed: boolean) => {
    try {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, completed } : t)),
      );

      await toggleTodo(id, completed);
    } catch (err) {
      setTodos((prev) =>
        prev.map((t) =>
          t.id === id ? { ...t, completed: !completed } : t,
        ),
      );

      Alert.alert("Помилка", "Не вдалося оновити статус завдання.");
      console.error(err);
    }
  };

  const handleEdit = async (id: string, text: string) => {
    try {
      setTodos((prev) =>
        prev.map((t) => (t.id === id ? { ...t, text } : t)),
      );

      await updateTodoText(id, text);
    } catch (err) {
      await fetchTodos();
      Alert.alert("Помилка", "Не вдалося оновити текст завдання.");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      setTodos((prev) => prev.filter((t) => t.id !== id));

      await deleteTodo(id);
    } catch (err) {
      await fetchTodos();
      Alert.alert("Помилка", "Не вдалося видалити завдання.");
      console.error(err);
    }
  };

  const completedCount = useMemo(
    () => todos.filter((t) => t.completed).length,
    [todos],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Header
            totalCount={todos.length}
            completedCount={completedCount}
          />

          {error && (
            <View style={styles.errorBanner}>
              <View style={styles.errorContent}>
                <Text style={styles.errorTitle}>
                  {"⚠️ Помилка з'єднання"}
                </Text>

                <Text style={styles.errorText}>{error}</Text>

                <Text style={styles.serverTip}>
                  cd server && npm start
                </Text>
              </View>

              <TouchableOpacity
                style={styles.retryButton}
                onPress={() => fetchTodos()}
              >
                <Text style={styles.retryButtonText}>Повторити</Text>
              </TouchableOpacity>
            </View>
          )}

          <TodoForm onAdd={handleAdd} loading={loading} />

          {loading && !refreshing && todos.length === 0 ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#6366f1" />

              <Text style={styles.loadingText}>
                Завантаження завдань...
              </Text>
            </View>
          ) : (
            <View style={styles.listWrapper}>
              <TodoList
                todos={todos}
                refreshing={refreshing}
                onRefresh={() => fetchTodos(true)}
                onToggle={handleToggle}
                onDelete={handleDelete}
                onEdit={handleEdit}
              />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  container: {
    flex: 1,
  },
  card: {
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 8,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
  },
  errorContent: {
    flex: 1,
    marginRight: 10,
  },
  errorTitle: {
    marginBottom: 4,
    fontSize: 14,
    fontWeight: "700",
    color: "#991b1b",
  },
  errorText: {
    fontSize: 13,
    lineHeight: 19,
    color: "#7f1d1d",
  },
  serverTip: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    color: "#7f1d1d",
  },
  retryButton: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: 8,
    backgroundColor: "#6366f1",
  },
  retryButtonText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "600",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: "#6b7280",
  },
  listWrapper: {
    flex: 1,
  },
});
