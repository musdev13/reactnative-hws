import { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import type { Todo } from "@/types";

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
        <View style={[styles.checkbox, todo.completed && styles.checkboxChecked]}>
          {todo.completed && <Text style={styles.checkmark}>✓</Text>}
        </View>
      </TouchableOpacity>

      {isEditing ? (
        <TextInput
          style={styles.editInput}
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
          <Text style={[styles.text, todo.completed && styles.completedText]}>
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
            <Text style={styles.actionIcon}>✏️</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(todo.id)}
          disabled={isUpdating}
          activeOpacity={0.7}
        >
          <Text style={styles.actionIcon}>🗑️</Text>
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
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  completedItem: {
    opacity: 0.7,
  },
  updatingItem: {
    opacity: 0.5,
  },
  checkboxContainer: {
    padding: 4,
    marginRight: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#9ca3af",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    borderColor: "#6366f1",
    backgroundColor: "#6366f1",
  },
  checkmark: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  textContainer: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    color: "#111827",
  },
  completedText: {
    textDecorationLine: "line-through",
    color: "#9ca3af",
  },
  editInput: {
    flex: 1,
    minHeight: 40,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#6366f1",
    borderRadius: 8,
    color: "#111827",
    fontSize: 16,
    backgroundColor: "#ffffff",
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
  actionIcon: {
    fontSize: 18,
  },
});
