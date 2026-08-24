import { StyleSheet, Text, View } from "react-native";
import { useTheme } from "@/context/ThemeContext";

interface HeaderProps {
    totalCount: number;
    completedCount: number;
}

export function Header({
    totalCount,
    completedCount,
}: HeaderProps) {
    const { colors } = useTheme();

    return (
        <View style={styles.header}>
            <View style={styles.titleGroup}>
                <Text style={styles.icon}>📝</Text>

                <Text
                    style={[
                        styles.title,
                        {
                            color: colors.text,
                        },
                    ]}
                >
                    Мій Список Завдань
                </Text>
            </View>

            <Text
                style={[
                    styles.subtitle,
                    {
                        color: colors.textMuted,
                    },
                ]}
            >
                {totalCount > 0
                    ? `Виконано ${completedCount} з ${totalCount} завдань`
                    : "Додайте своє перше завдання"}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 16,
    },
    titleGroup: {
        flexDirection: "row",
        alignItems: "center",
    },
    icon: {
        fontSize: 28,
        marginRight: 10,
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
    },
    subtitle: {
        marginTop: 6,
        fontSize: 14,
    },
});
