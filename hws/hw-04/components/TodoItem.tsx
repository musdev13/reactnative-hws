import { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from "react-native";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useTheme } from "@/context/ThemeContext";
import { Todo } from "@/types";

interface TodoItemProps {
  todo: Todo;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  const { colors } = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const toggleTodo = useMutation(api.todos.toggleTodo);
  const updateTodo = useMutation(api.todos.updateTodo);
  const deleteTodo = useMutation(api.todos.deleteTodo);

  const handleToggle = async () => {
    try {
      await toggleTodo({ id: todo._id });
    } catch {
      Alert.alert("Помилка", "Не вдалося змінити статус завдання");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteTodo({ id: todo._id });
    } catch {
      Alert.alert("Помилка", "Не вдалося видалити завдання");
    }
  };

  const handleUpdate = async () => {
    const trimmedText = editText.trim();
    if (!trimmedText) {
      Alert.alert("Помилка", "Текст завдання не може бути порожнім");
      setEditText(todo.text);
      setIsEditing(false);
      return;
    }

    try {
      await updateTodo({ id: todo._id, text: trimmedText });
      setIsEditing(false);
    } catch {
      Alert.alert("Помилка", "Не вдалося оновити завдання");
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.checkbox,
          { borderColor: colors.primary },
          todo.isCompleted && { backgroundColor: colors.primary },
        ]}
        onPress={handleToggle}
        activeOpacity={0.7}
      >
        {todo.isCompleted && <Text style={styles.checkmark}>✓</Text>}
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={[
            styles.editInput,
            {
              color: colors.text,
              borderColor: colors.border,
              backgroundColor: colors.background,
            },
          ]}
          value={editText}
          onChangeText={setEditText}
          onBlur={handleUpdate}
          onSubmitEditing={handleUpdate}
          autoFocus
        />
      ) : (
        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => setIsEditing(true)}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.text,
              { color: colors.text },
              todo.isCompleted && [
                styles.completedText,
                { color: colors.textSecondary },
              ],
            ]}
          >
            {todo.text}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        activeOpacity={0.7}
      >
        <Text style={[styles.deleteText, { color: colors.error || "#FF3B30" }]}>
          ✕
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default TodoItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
    gap: 12,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "bold",
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
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    fontSize: 16,
  },
  deleteButton: {
    padding: 4,
  },
  deleteText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
