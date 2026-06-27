import "../global.css";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { useAuthStore } from "../src/stores/auth";

export default function RootLayout() {
  const { isLoading, loadUser, token } = useAuthStore();

  useEffect(() => {
    if (token) loadUser();
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#1a1a2e" }}>
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="login" />
        <Stack.Screen name="register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="contact/create" />
        <Stack.Screen name="contact/[id]" />
        <Stack.Screen name="campaign/create" />
        <Stack.Screen name="campaign/[id]/index" />
        <Stack.Screen name="campaign/[id]/preview" />
        <Stack.Screen name="templates/index" />
        <Stack.Screen name="templates/create" />
        <Stack.Screen name="templates/[id]/edit" />
        <Stack.Screen name="tags/index" />
        <Stack.Screen name="inbox/index" />
        <Stack.Screen name="sources/index" />
        <Stack.Screen name="labels/index" />
        <Stack.Screen name="automations/index" />
        <Stack.Screen name="profile/index" />
      </Stack>
    </>
  );
}
