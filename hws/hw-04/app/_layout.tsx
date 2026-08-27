import { Stack } from "expo-router";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ThemeProvider } from "@/context/ThemeContext";

const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error("Змінна оточення EXPO_PUBLIC_CONVEX_URL не задана.");
}

const convex = new ConvexReactClient(convexUrl, {
  unsavedChangesWarning: false,
});

export default function RootLayout() {
  return (
    <ConvexProvider client={convex}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
        </Stack>
      </ThemeProvider>
    </ConvexProvider>
  );
}
