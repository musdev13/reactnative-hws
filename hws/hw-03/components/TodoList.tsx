import {
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    View,
} from "react-native";
import type { Todo } from "@/types";
import { useTheme } from "@/context/ThemeContext";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
    todos: Todo[];
    refreshing: boolean;
    onRefresh: () => Promise<void>;
    onToggle: (id: string, completed: boolean) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoList({
    todos,
    refreshing,
    onRefresh,
    onToggle,
    onDelete,
    onEdit,
}: TodoListProps) {
    const { colors } = useTheme();

    if (todos.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text
                    style={[
                        styles.emptyText,
                        {
                            color: colors.textMuted,
                        },
                    ]}
                >
                    Список завдань порожній. Додайте нове завдання вище!
                </Text>
            </View>
        );
    }

    return (
        <FlatList
            data={todos}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <TodoItem
                    todo={item}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    onEdit={onEdit}
                />
            )}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    colors={[colors.primary]}
                    tintColor={colors.primary}
                />
            }
        />
    );
}

const styles = StyleSheet.create({
    listContent: {
        paddingTop: 4,
        paddingBottom: 20,
    },
    emptyContainer: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 30,
    },
    emptyText: {
        textAlign: "center",
        fontSize: 16,
        lineHeight: 24,
    },
});
