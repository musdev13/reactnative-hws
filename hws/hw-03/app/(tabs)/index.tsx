import { useMemo } from "react";
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
import { useTheme } from "@/context/ThemeContext";
import { useTodos } from "@/context/TodoContext";

export default function TasksScreen() {
    const { colors } = useTheme();

    const {
        todos,
        loading,
        refreshing,
        error,
        refreshTodos,
        addTodo,
        toggleTodo,
        updateTodo,
        deleteTodo,
    } = useTodos();

    const completedCount = useMemo(
        () => todos.filter((todo) => todo.completed).length,
        [todos],
    );

    const handleAdd = async (text: string) => {
        try {
            await addTodo(text);
        } catch (error) {
            Alert.alert(
                "Помилка",
                "Не вдалося додати завдання. Перевірте з'єднання з сервером.",
            );
            console.error(error);
        }
    };

    const handleToggle = async (id: string, completed: boolean) => {
        try {
            await toggleTodo(id, completed);
        } catch (error) {
            Alert.alert("Помилка", "Не вдалося оновити статус завдання.");
            console.error(error);
        }
    };

    const handleEdit = async (id: string, text: string) => {
        try {
            await updateTodo(id, text);
        } catch (error) {
            Alert.alert("Помилка", "Не вдалося оновити текст завдання.");
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            await deleteTodo(id);
        } catch (error) {
            Alert.alert("Помилка", "Не вдалося видалити завдання.");
            console.error(error);
        }
    };

    return (
        <SafeAreaView
            edges={["top", "left", "right"]}
            style={[
                styles.safeArea,
                {
                    backgroundColor: colors.bg,
                },
            ]}
        >
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <View
                    style={[
                        styles.card,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <Header
                        totalCount={todos.length}
                        completedCount={completedCount}
                    />

                    {error && (
                        <View
                            style={[
                                styles.errorBanner,
                                {
                                    backgroundColor: colors.surface,
                                    borderColor: colors.danger,
                                },
                            ]}
                        >
                            <View style={styles.errorContent}>
                                <Text
                                    style={[
                                        styles.errorTitle,
                                        {
                                            color: colors.danger,
                                        },
                                    ]}
                                >
                                    ⚠️ Помилка з'єднання
                                </Text>

                                <Text
                                    style={[
                                        styles.errorText,
                                        {
                                            color: colors.textMuted,
                                        },
                                    ]}
                                >
                                    {error}
                                </Text>

                                <Text
                                    style={[
                                        styles.serverTip,
                                        {
                                            color: colors.textMuted,
                                        },
                                    ]}
                                >
                                    cd server && npm start
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[
                                    styles.retryButton,
                                    {
                                        backgroundColor: colors.primary,
                                    },
                                ]}
                                onPress={refreshTodos}
                            >
                                <Text style={styles.retryButtonText}>Повторити</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <TodoForm onAdd={handleAdd} loading={loading} />

                    {loading && !refreshing && todos.length === 0 ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator
                                size="large"
                                color={colors.primary}
                            />

                            <Text
                                style={[
                                    styles.loadingText,
                                    {
                                        color: colors.textMuted,
                                    },
                                ]}
                            >
                                Завантаження завдань...
                            </Text>
                        </View>
                    ) : (
                        <View style={styles.listWrapper}>
                            <TodoList
                                todos={todos}
                                refreshing={refreshing}
                                onRefresh={refreshTodos}
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
    },
    container: {
        flex: 1,
    },
    card: {
        flex: 1,
        marginHorizontal: 12,
        marginVertical: 8,
        borderRadius: 16,
        borderWidth: 1,
        overflow: "hidden",
    },
    errorBanner: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 20,
        marginBottom: 12,
        padding: 14,
        borderRadius: 10,
        borderWidth: 1,
    },
    errorContent: {
        flex: 1,
        marginRight: 10,
    },
    errorTitle: {
        marginBottom: 4,
        fontSize: 14,
        fontWeight: "700",
    },
    errorText: {
        fontSize: 13,
        lineHeight: 19,
    },
    serverTip: {
        marginTop: 8,
        fontSize: 12,
        fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace",
    },
    retryButton: {
        paddingHorizontal: 12,
        paddingVertical: 9,
        borderRadius: 8,
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
    },
    listWrapper: {
        flex: 1,
    },
});
