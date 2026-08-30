import { StyleSheet, View, Text, ActivityIndicator } from "react-native";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Header } from "@/components/Header";
import { useTheme } from "@/context/ThemeContext";

export default function StatsScreen() {
  const { colors } = useTheme();
  const stats = useQuery(api.todos.getStats);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Header title="Статистика" />
      <View style={styles.content}>
        {stats === undefined ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
              Завантаження статистики...
            </Text>
          </View>
        ) : (
          <View style={styles.statsGrid}>
            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.cardValue, { color: colors.primary }]}>
                {stats.total}
              </Text>
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
                Усього завдань
              </Text>
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.cardValue, { color: colors.primary }]}>
                {stats.completed}
              </Text>
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
                Виконано
              </Text>
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.cardValue, { color: colors.primary }]}>
                {stats.active}
              </Text>
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
                У процесі
              </Text>
            </View>

            <View
              style={[
                styles.card,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <Text style={[styles.cardValue, { color: colors.primary }]}>
                {stats.percentage}%
              </Text>
              <Text style={[styles.cardLabel, { color: colors.textSecondary }]}>
                Прогрес
              </Text>
            </View>
          </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  card: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardValue: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 14,
  },
});
