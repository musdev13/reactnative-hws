import { StyleSheet, Text, View } from "react-native";

interface HeaderProps {
  totalCount: number;
  completedCount: number;
}

export function Header({ totalCount, completedCount }: HeaderProps) {
  return (
    <View style={styles.header}>
      <View style={styles.titleGroup}>
        <Text style={styles.icon}>📝</Text>
        <Text style={styles.title}>Мій Список Завдань</Text>
      </View>

      <Text style={styles.subtitle}>
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
    color: "#111827",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: "#6b7280",
  },
});
