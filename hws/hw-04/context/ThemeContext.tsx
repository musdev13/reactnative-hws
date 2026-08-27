import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeColors, ThemeContextValue } from "@/types";

const lightColors: ThemeColors = {
  primary: "#6366f1",
  background: "#f9fafb",
  bg: "#f3f4f6",
  surface: "#ffffff",
  text: "#111827",
  textSecondary: "#6b7280",
  textMuted: "#9ca3af",
  border: "#e5e7eb",
  error: "#ef4444",
  success: "#22c55e",
  danger: "#ef4444",
  statusBarStyle: "dark",
};

const darkColors: ThemeColors = {
  primary: "#818cf8",
  background: "#111827",
  bg: "#111827",
  surface: "#1f2937",
  text: "#f9fafb",
  textSecondary: "#9ca3af",
  textMuted: "#6b7280",
  border: "#374151",
  error: "#f87171",
  success: "#4ade80",
  danger: "#f87171",
  statusBarStyle: "light",
};

const THEME_STORAGE_KEY = "@theme_preference";

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((savedTheme) => {
      if (savedTheme === "light" || savedTheme === "dark") {
        setTheme(savedTheme);
      }
    });
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    AsyncStorage.setItem(THEME_STORAGE_KEY, nextTheme);
  };

  const isDark = theme === "dark";
  const colors = isDark ? darkColors : lightColors;

  return (
    <ThemeContext.Provider value={{ isDark, theme, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
