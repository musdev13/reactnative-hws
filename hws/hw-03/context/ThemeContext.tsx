import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import type { ReactNode } from "react";
import type { ThemeColors } from "@/types";

const THEME_STORAGE_KEY = "@todo_theme_mode";

export const lightColors: ThemeColors = {
    bg: "#f3f4f6",
    surface: "#ffffff",
    text: "#111827",
    textMuted: "#6b7280",
    border: "#e5e7eb",
    primary: "#6366f1",
    success: "#22c55e",
    danger: "#ef4444",
    statusBarStyle: "dark",
};

export const darkColors: ThemeColors = {
    bg: "#111827",
    surface: "#1f2937",
    text: "#f9fafb",
    textMuted: "#9ca3af",
    border: "#374151",
    primary: "#818cf8",
    success: "#4ade80",
    danger: "#f87171",
    statusBarStyle: "light",
};

interface ThemeContextValue {
    isDarkMode: boolean;
    colors: ThemeColors;
    toggleTheme: () => Promise<void>;
}

const ThemeContext = createContext<ThemeContextValue | undefined>(
    undefined,
);

interface ThemeProviderProps {
    children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const storedTheme = await AsyncStorage.getItem(
                    THEME_STORAGE_KEY,
                );

                if (storedTheme === "dark") {
                    setIsDarkMode(true);
                }
            } catch (error) {
                console.error("Не вдалося завантажити тему:", error);
            }
        };

        loadTheme();
    }, []);

    const toggleTheme = useCallback(async () => {
        const newValue = !isDarkMode;

        setIsDarkMode(newValue);

        try {
            await AsyncStorage.setItem(
                THEME_STORAGE_KEY,
                newValue ? "dark" : "light",
            );
        } catch (error) {
            console.error("Не вдалося зберегти тему:", error);
        }
    }, [isDarkMode]);

    const colors = isDarkMode ? darkColors : lightColors;

    const value = useMemo(
        () => ({
            isDarkMode,
            colors,
            toggleTheme,
        }),
        [isDarkMode, colors, toggleTheme],
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme має використовуватися всередині ThemeProvider");
    }

    return context;
}
