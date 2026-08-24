import { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Todo } from "@/types";
import { useTheme } from "@/context/ThemeContext";

interface TodoItemProps {
    todo: Todo;
    onToggle: (id: string, completed: boolean) => Promise<void>;
    onDelete: (id: string) => Promise<void>;
    onEdit: (id: string, text: string) => Promise<void>;
}

export function TodoItem({
    todo,
    onToggle,
    onDelete,
    onEdit,
}: TodoItemProps) {
    const { colors } = useTheme();

    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(todo.text);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleSave = async () => {
        const trimmed = editText.trim();

        if (!trimmed) {
            setEditText(todo.text);
            setIsEditing(false);
            return;
        }

        if (trimmed !== todo.text) {
            try {
                setIsUpdating(true);
                await onEdit(todo.id, trimmed);
            } finally {
                setIsUpdating(false);
                setIsEditing(false);
            }
        } else {
            setIsEditing(false);
        }
    };

    const handleCancel = () => {
        setEditText(todo.text);
        setIsEditing(false);
    };

    const startEditing = () => {
        if (!isUpdating) {
            setEditText(todo.text);
            setIsEditing(true);
        }
    };

    return (
        <View
            style={[
                styles.item,
                {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                },
                todo.completed && styles.completedItem,
                isUpdating && styles.updatingItem,
            ]}
        >
            <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => onToggle(todo.id, !todo.completed)}
                disabled={isUpdating}
                activeOpacity={0.7}
            >
                <Ionicons
                    name={
                        todo.completed
                            ? "checkmark-circle"
                            : "ellipse-outline"
                    }
                    size={27}
                    color={
                        todo.completed
                            ? colors.success
                            : colors.textMuted
                    }
                />
            </TouchableOpacity>

            {isEditing ? (
                <TextInput
                    style={[
                        styles.editInput,
                        {
                            borderColor: colors.primary,
                            backgroundColor: colors.surface,
                            color: colors.text,
                        },
                    ]}
                    value={editText}
                    onChangeText={setEditText}
                    onBlur={handleSave}
                    onSubmitEditing={handleSave}
                    onKeyPress={({ nativeEvent }) => {
                        if (nativeEvent.key === "Escape") {
                            handleCancel();
                        }
                    }}
                    autoFocus
                    maxLength={120}
                    editable={!isUpdating}
                    returnKeyType="done"
                />
            ) : (
                <TouchableOpacity
                    style={styles.textContainer}
                    onPress={startEditing}
                    activeOpacity={0.7}
                >
                    <Text
                        style={[
                            styles.text,
                            {
                                color: colors.text,
                            },
                            todo.completed && [
                                styles.completedText,
                                {
                                    color: colors.textMuted,
                                },
                            ],
                        ]}
                    >
                        {todo.text}
                    </Text>
                </TouchableOpacity>
            )}

            <View style={styles.actions}>
                {!isEditing && (
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={startEditing}
                        disabled={isUpdating}
                        activeOpacity={0.7}
                    >
                        <Ionicons
                            name="create-outline"
                            size={21}
                            color={colors.textMuted}
                        />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => onDelete(todo.id)}
                    disabled={isUpdating}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="trash-outline"
                        size={21}
                        color={colors.danger}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 64,
        marginHorizontal: 20,
        marginBottom: 10,
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 12,
        borderWidth: 1,
    },
    completedItem: {
        opacity: 0.75,
    },
    updatingItem: {
        opacity: 0.5,
    },
    checkboxContainer: {
        padding: 4,
        marginRight: 10,
    },
    textContainer: {
        flex: 1,
    },
    text: {
        fontSize: 16,
    },
    completedText: {
        textDecorationLine: "line-through",
    },
    editInput: {
        flex: 1,
        minHeight: 40,
        paddingHorizontal: 10,
        borderWidth: 1,
        borderRadius: 8,
        fontSize: 16,
    },
    actions: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 8,
    },
    actionButton: {
        width: 40,
        height: 40,
        alignItems: "center",
        justifyContent: "center",
    },
});
