import { useState } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface TodoFormProps {
  onAdd: (text: string) => Promise<void>;
  loading: boolean;
}

export function TodoForm({ onAdd, loading }: TodoFormProps) {
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const trimmed = text.trim();

    if (!trimmed || isSubmitting) return;

    try {
      setIsSubmitting(true);
      Keyboard.dismiss();
      await onAdd(trimmed);
      setText("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const disabled = !text.trim() || loading || isSubmitting;

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Що потрібно зробити?"
        placeholderTextColor="#9ca3af"
        value={text}
        onChangeText={setText}
        editable={!loading && !isSubmitting}
        maxLength={120}
        onSubmitEditing={handleSubmit}
        returnKeyType="done"
      />

      <TouchableOpacity
        style={[styles.addButton, disabled && styles.addButtonDisabled]}
        onPress={handleSubmit}
        disabled={disabled}
        activeOpacity={0.7}
      >
        <Text style={styles.addButtonText}>
          {isSubmitting ? "Додаємо..." : "Додати"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 12,
    gap: 10,
  },
  input: {
    flex: 1,
    height: 48,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 10,
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: 16,
  },
  addButton: {
    height: 48,
    paddingHorizontal: 18,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: "#6366f1",
  },
  addButtonDisabled: {
    opacity: 0.5,
  },
  addButtonText: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "600",
  },
});
