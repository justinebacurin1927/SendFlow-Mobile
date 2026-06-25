import { Ionicons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "../../src/stores/auth";

export default function SettingsScreen() {
  const { user, logout } = useAuthStore();

  return (
    <View className="flex-1 bg-[#1a1a2e]">
      <View className="px-4 pt-14 pb-6">
        <Text className="text-white text-2xl font-bold">Settings</Text>
      </View>

      <View className="px-4">
        <View className="bg-white/5 rounded-lg px-4 py-4 mb-6">
          <View className="flex-row items-center">
            <View className="bg-white/10 rounded-full w-14 h-14 items-center justify-center mr-4">
              <Ionicons name="person" size={28} color="#e94560" />
            </View>
            <View>
              <Text className="text-white text-lg font-semibold">
                {user?.name}
              </Text>
              <Text className="text-gray-400">{user?.email}</Text>
            </View>
          </View>
        </View>

        <Pressable className="flex-row items-center bg-white/5 rounded-lg px-4 py-4 mb-2">
          <Ionicons name="server" size={20} color="#e94560" />
          <View className="ml-3 flex-1">
            <Text className="text-white font-medium">API Server</Text>
            <Text className="text-gray-400 text-sm">
              {process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api"}
            </Text>
          </View>
        </Pressable>

        <Pressable className="flex-row items-center bg-white/5 rounded-lg px-4 py-4 mb-2">
          <Ionicons name="information-circle" size={20} color="#e94560" />
          <View className="ml-3 flex-1">
            <Text className="text-white font-medium">Version</Text>
            <Text className="text-gray-400 text-sm">1.0.0</Text>
          </View>
        </Pressable>

        <Pressable
          className="flex-row items-center bg-white/5 rounded-lg px-4 py-4 mt-6"
          onPress={logout}
        >
          <Ionicons name="log-out" size={20} color="#e94560" />
          <Text className="text-[#e94560] font-semibold ml-3">Sign Out</Text>
        </Pressable>
      </View>
    </View>
  );
}
