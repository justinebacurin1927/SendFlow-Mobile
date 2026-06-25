import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { useAuthStore } from "../src/stores/auth";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#1a1a2e] justify-center px-6"
    >
      <View className="mb-10">
        <Text className="text-white text-4xl font-bold">SendFlow</Text>
        <Text className="text-gray-400 text-lg mt-2">
          Email marketing on the go
        </Text>
      </View>

      {error ? (
        <Text className="text-[#e94560] mb-4 text-sm">{error}</Text>
      ) : null}

      <TextInput
        className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        className="bg-white/10 text-white px-4 py-3 rounded-lg mb-6 text-base"
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        className="bg-[#e94560] py-3 rounded-lg items-center"
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">Sign In</Text>
        )}
      </Pressable>

      <Pressable
        className="mt-6 items-center"
        onPress={() => router.replace("/register")}
      >
        <Text className="text-gray-400">
          Don't have an account?{" "}
          <Text className="text-[#e94560] font-semibold">Sign Up</Text>
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
