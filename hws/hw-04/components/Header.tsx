import { StyleSheet, View, Text } from "react-native";
import { useTheme } from "@/context/ThemeContext";
import { HeaderProps } from "@/types";

export const Header = ({ title }: HeaderProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface }]}>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
});
