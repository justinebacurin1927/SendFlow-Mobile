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

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      await register(name, email, password);
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e.response?.data?.message || "Registration failed");
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
        <Text className="text-white text-4xl font-bold">Join SendFlow</Text>
        <Text className="text-gray-400 text-lg mt-2">
          Create your account
        </Text>
      </View>

      {error ? (
        <Text className="text-[#e94560] mb-4 text-sm">{error}</Text>
      ) : null}

      <TextInput
        className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
        placeholder="Full Name"
        placeholderTextColor="#666"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

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
        placeholder="Password (min 8 characters)"
        placeholderTextColor="#666"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <Pressable
        className="bg-[#e94560] py-3 rounded-lg items-center"
        onPress={handleRegister}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold text-base">
            Create Account
          </Text>
        )}
      </Pressable>

      <Pressable
        className="mt-6 items-center"
        onPress={() => router.replace("/login")}
      >
        <Text className="text-gray-400">
          Already have an account?{" "}
          <Text className="text-[#e94560] font-semibold">Sign In</Text>
        </Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
