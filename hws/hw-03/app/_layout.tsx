import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ThemeProvider, useTheme } from "@/context/ThemeContext";
import { TodoProvider } from "@/context/TodoContext";

function RootNavigator() {
    const { colors } = useTheme();

    return (
        <>
            <StatusBar style={colors.statusBarStyle} />

            <Stack
                screenOptions={{
                    headerShown: false,
                    contentStyle: {
                        backgroundColor: colors.bg,
                    },
                }}
            />
        </>
    );
}

export default function RootLayout() {
    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <TodoProvider>
                    <RootNavigator />
                </TodoProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}
