import React from "react";
import { Tabs } from "expo-router";
import { Text } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#1E293B",
          borderTopColor: "#334155",
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: "#818CF8",
        tabBarInactiveTintColor: "#64748B",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Сценарії",
          tabBarIcon: ({ focused }) => (
            <Text className="text-lg">{focused ? "🎭" : "🎬"}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="vocabulary"
        options={{
          title: "Словничок",
          tabBarIcon: ({ focused }) => (
            <Text className="text-lg">{focused ? "📖" : "📕"}</Text>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Налаштування",
          tabBarIcon: ({ focused }) => (
            <Text className="text-lg">{focused ? "⚙️" : "🔧"}</Text>
          ),
        }}
      />
    </Tabs>
  );
}