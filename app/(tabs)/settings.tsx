import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "../../src/stores/auth";

export default function SettingsScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const menuItems = [
    { icon: "person-circle" as const, label: "Profile", route: "/profile/index" },
    { icon: "document-text" as const, label: "Templates", route: "/templates/index" },
    { icon: "pricetags" as const, label: "Tags", route: "/tags/index" },
    { icon: "mail" as const, label: "Inbox", route: "/inbox/index" },
    { icon: "git-network" as const, label: "Automations", route: "/automations/index" },
    { icon: "link" as const, label: "Sources", route: "/sources/index" },
    { icon: "bookmark" as const, label: "Labels", route: "/labels/index" },
  ];

  return (
    <View className="flex-1 bg-[#1a1a2e]">
      <View className="px-4 pt-14 pb-6">
        <Text className="text-white text-2xl font-bold">Settings</Text>
      </View>

      <View className="px-4">
        <Pressable
          className="bg-white/5 rounded-lg px-4 py-4 mb-6"
          onPress={() => router.push("/profile/index")}
        >
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
        </Pressable>

        {menuItems.map((item) => (
          <Pressable
            key={item.route}
            className="flex-row items-center bg-white/5 rounded-lg px-4 py-4 mb-2"
            onPress={() => router.push(item.route)}
          >
            <Ionicons name={item.icon} size={20} color="#e94560" />
            <Text className="text-white font-medium ml-3">{item.label}</Text>
            <View className="flex-1" />
            <Ionicons name="chevron-forward" size={18} color="#666" />
          </Pressable>
        ))}

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
