import { useMemo } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/context/ThemeContext";
import { useTodos } from "@/context/TodoContext";

interface StatCardProps {
    title: string;
    value: string;
    icon: keyof typeof Ionicons.glyphMap;
    color: string;
}

function StatCard({
    title,
    value,
    icon,
    color,
}: StatCardProps) {
    const { colors } = useTheme();

    return (
        <View
            style={[
                styles.card,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                },
            ]}
        >
            <View
                style={[
                    styles.iconContainer,
                    {
                        backgroundColor: `${color}20`,
                    },
                ]}
            >
                <Ionicons name={icon} size={24} color={color} />
            </View>

            <Text
                style={[
                    styles.value,
                    {
                        color: colors.text,
                    },
                ]}
            >
                {value}
            </Text>

            <Text
                style={[
                    styles.title,
                    {
                        color: colors.textMuted,
                    },
                ]}
            >
                {title}
            </Text>
        </View>
    );
}

export default function StatsScreen() {
    const { colors } = useTheme();
    const { todos } = useTodos();

    const stats = useMemo(() => {
        const total = todos.length;
        const completed = todos.filter(
            (todo) => todo.completed,
        ).length;
        const active = total - completed;

        const progress =
            total === 0
                ? 0
                : Math.round((completed / total) * 100);

        return {
            total,
            active,
            completed,
            progress,
        };
    }, [todos]);

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
            <ScrollView
                contentContainerStyle={styles.content}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.header}>
                    <Text
                        style={[
                            styles.heading,
                            {
                                color: colors.text,
                            },
                        ]}
                    >
                        Статистика
                    </Text>

                    <Text
                        style={[
                            styles.subtitle,
                            {
                                color: colors.textMuted,
                            },
                        ]}
                    >
                        Ваш прогрес у виконанні завдань
                    </Text>
                </View>

                <View style={styles.grid}>
                    <StatCard
                        title="Всього завдань"
                        value={String(stats.total)}
                        icon="list-outline"
                        color={colors.primary}
                    />

                    <StatCard
                        title="Активні"
                        value={String(stats.active)}
                        icon="time-outline"
                        color="#f59e0b"
                    />

                    <StatCard
                        title="Виконані"
                        value={String(stats.completed)}
                        icon="checkmark-circle-outline"
                        color={colors.success}
                    />

                    <StatCard
                        title="Прогрес"
                        value={`${stats.progress}%`}
                        icon="trending-up-outline"
                        color="#8b5cf6"
                    />
                </View>

                <View
                    style={[
                        styles.progressCard,
                        {
                            backgroundColor: colors.surface,
                            borderColor: colors.border,
                        },
                    ]}
                >
                    <View style={styles.progressHeader}>
                        <Text
                            style={[
                                styles.progressTitle,
                                {
                                    color: colors.text,
                                },
                            ]}
                        >
                            Загальний прогрес
                        </Text>

                        <Text
                            style={[
                                styles.progressValue,
                                {
                                    color: colors.primary,
                                },
                            ]}
                        >
                            {stats.progress}%
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.progressTrack,
                            {
                                backgroundColor: colors.border,
                            },
                        ]}
                    >
                        <View
                            style={[
                                styles.progressFill,
                                {
                                    width: `${stats.progress}%`,
                                    backgroundColor: colors.primary,
                                },
                            ]}
                        />
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
    },
    content: {
        padding: 20,
        paddingBottom: 32,
    },
    header: {
        marginBottom: 20,
    },
    heading: {
        fontSize: 30,
        fontWeight: "800",
    },
    subtitle: {
        marginTop: 5,
        fontSize: 15,
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 12,
    },
    card: {
        width: "48%",
        flexGrow: 1,
        minHeight: 150,
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
    },
    iconContainer: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 14,
    },
    value: {
        fontSize: 30,
        fontWeight: "800",
    },
    title: {
        marginTop: 4,
        fontSize: 14,
    },
    progressCard: {
        marginTop: 12,
        padding: 18,
        borderRadius: 16,
        borderWidth: 1,
    },
    progressHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    progressTitle: {
        fontSize: 16,
        fontWeight: "700",
    },
    progressValue: {
        fontSize: 18,
        fontWeight: "800",
    },
    progressTrack: {
        height: 10,
        borderRadius: 999,
        overflow: "hidden",
    },
    progressFill: {
        height: "100%",
        borderRadius: 999,
    },
});
