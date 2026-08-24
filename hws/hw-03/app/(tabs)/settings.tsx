import { Alert, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useTodos } from "@/context/TodoContext";

export default function SettingsScreen() {
    const { colors, isDarkMode, toggleTheme } = useTheme();

    const {
        todos,
        clearCompleted,
        clearAll,
    } = useTodos();

    const completedCount = todos.filter(
        (todo) => todo.completed,
    ).length;

    const handleClearCompleted = () => {
        if (completedCount === 0) {
            Alert.alert(
                "Немає виконаних завдань",
                "Наразі немає завдань, які можна очистити.",
            );
            return;
        }

        Alert.alert(
            "Очистити виконані?",
            `Буде видалено ${completedCount} виконаних завдань.`,
            [
                {
                    text: "Скасувати",
                    style: "cancel",
                },
                {
                    text: "Очистити",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await clearCompleted();
                        } catch (error) {
                            Alert.alert(
                                "Помилка",
                                "Не вдалося очистити виконані завдання.",
                            );
                            console.error(error);
                        }
                    },
                },
            ],
        );
    };

    const handleClearAll = () => {
        if (todos.length === 0) {
            Alert.alert(
                "Список порожній",
                "Немає завдань для видалення.",
            );
            return;
        }

        Alert.alert(
            "Видалити всі завдання?",
            `Буде видалено всі ${todos.length} завдань. Цю дію не можна скасувати.`,
            [
                {
                    text: "Скасувати",
                    style: "cancel",
                },
                {
                    text: "Видалити все",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await clearAll();
                        } catch (error) {
                            Alert.alert(
                                "Помилка",
                                "Не вдалося видалити всі завдання.",
                            );
                            console.error(error);
                        }
                    },
                },
            ],
        );
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
            <View style={styles.container}>
                <Text
                    style={[
                        styles.heading,
                        {
                            color: colors.text,
                        },
                    ]}
                >
                    Налаштування
                </Text>

                <View
                    style={[
                        styles.section,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.sectionTitle,
                            {
                                color: colors.textMuted,
                            },
                        ]}
                    >
                        Оформлення
                    </Text>

                    <View style={styles.row}>
                        <View style={styles.rowLeft}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    {
                                        backgroundColor: `${colors.primary}20`,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name={isDarkMode ? "moon" : "sunny"}
                                    size={22}
                                    color={colors.primary}
                                />
                            </View>

                            <View>
                                <Text
                                    style={[
                                        styles.rowTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ]}
                                >
                                    {isDarkMode
                                        ? "Темна тема"
                                        : "Світла тема"}
                                </Text>

                                <Text
                                    style={[
                                        styles.rowSubtitle,
                                        {
                                            color: colors.textMuted,
                                        },
                                    ]}
                                >
                                    Змінити оформлення додатку
                                </Text>
                            </View>
                        </View>

                        <Switch
                            value={isDarkMode}
                            onValueChange={toggleTheme}
                            trackColor={{
                                false: colors.border,
                                true: colors.primary,
                            }}
                            thumbColor="#ffffff"
                        />
                    </View>
                </View>

                <View
                    style={[
                        styles.section,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.sectionTitle,
                            {
                                color: colors.textMuted,
                            },
                        ]}
                    >
                        Керування завданнями
                    </Text>

                    <TouchableOpacity
                        style={[
                            styles.actionRow,
                            {
                                borderBottomColor: colors.border,
                            },
                        ]}
                        onPress={handleClearCompleted}
                        activeOpacity={0.7}
                    >
                        <View style={styles.rowLeft}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    {
                                        backgroundColor: `${colors.success}20`,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="checkmark-done-outline"
                                    size={22}
                                    color={colors.success}
                                />
                            </View>

                            <View>
                                <Text
                                    style={[
                                        styles.rowTitle,
                                        {
                                            color: colors.text,
                                        },
                                    ]}
                                >
                                    Очистити виконані
                                </Text>

                                <Text
                                    style={[
                                        styles.rowSubtitle,
                                        {
                                            color: colors.textMuted,
                                        },
                                    ]}
                                >
                                    Виконаних: {completedCount}
                                </Text>
                            </View>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={colors.textMuted}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionRow}
                        onPress={handleClearAll}
                        activeOpacity={0.7}
                    >
                        <View style={styles.rowLeft}>
                            <View
                                style={[
                                    styles.iconContainer,
                                    {
                                        backgroundColor: `${colors.danger}20`,
                                    },
                                ]}
                            >
                                <Ionicons
                                    name="trash-outline"
                                    size={22}
                                    color={colors.danger}
                                />
                            </View>

                            <View>
                                <Text
                                    style={[
                                        styles.rowTitle,
                                        {
                                            color: colors.danger,
                                        },
                                    ]}
                                >
                                    Видалити всі завдання
                                </Text>

                                <Text
                                    style={[
                                        styles.rowSubtitle,
                                        {
                                            color: colors.textMuted,
                                        },
                                    ]}
                                >
                                    Всього: {todos.length}
                                </Text>
                            </View>
                        </View>

                        <Ionicons
                            name="chevron-forward"
                            size={20}
                            color={colors.textMuted}
                        />
                    </TouchableOpacity>
                </View>

                <View
                    style={[
                        styles.section,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <Text
                        style={[
                            styles.sectionTitle,
                            {
                                color: colors.textMuted,
                            },
                        ]}
                    >
                        Про додаток
                    </Text>

                    <View style={styles.aboutRow}>
                        <Ionicons
                            name="checkbox-outline"
                            size={24}
                            color={colors.primary}
                        />

                        <View style={styles.aboutText}>
                            <Text
                                style={[
                                    styles.rowTitle,
                                    {
                                        color: colors.text,
                                    },
                                ]}
                            >
                                rn-todo
                            </Text>

                            <Text
                                style={[
                                    styles.rowSubtitle,
                                    {
                                        color: colors.textMuted,
                                    },
                                ]}
                            >
                                Todo App 2.0 • v2.0.0
                            </Text>
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    container: {
        flex: 1,
        padding: 20,
    },
    heading: {
        fontSize: 30,
        fontWeight: "800",
        marginBottom: 20,
    },
    section: {
        marginBottom: 14,
        borderRadius: 16,
        borderWidth: 1,
        overflow: "hidden",
    },
    sectionTitle: {
        paddingHorizontal: 18,
        paddingTop: 16,
        paddingBottom: 10,
        fontSize: 13,
        fontWeight: "700",
        textTransform: "uppercase",
        letterSpacing: 0.5,
    },
    row: {
        minHeight: 76,
        paddingHorizontal: 18,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    actionRow: {
        minHeight: 76,
        paddingHorizontal: 18,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
    rowLeft: {
        flexDirection: "row",
        alignItems: "center",
        flex: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: "600",
    },
    rowSubtitle: {
        marginTop: 3,
        fontSize: 13,
    },
    aboutRow: {
        minHeight: 76,
        paddingHorizontal: 18,
        paddingBottom: 16,
        flexDirection: "row",
        alignItems: "center",
    },
    aboutText: {
        marginLeft: 12,
    },
});
