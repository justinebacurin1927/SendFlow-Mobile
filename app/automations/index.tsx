import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { automationsApi } from "../../src/api/automations";
import StatusBadge from "../../src/components/StatusBadge";
import type { Automation } from "../../src/types";

export default function AutomationsScreen() {
  const router = useRouter();
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const { data } = await automationsApi.list();
      setAutomations(data);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetch(); }, []);

  const handleToggle = async (id: number) => {
    try {
      await automationsApi.toggle(id);
      fetch();
    } catch {}
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert("Delete Automation", `Delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await automationsApi.delete(id);
            fetch();
          } catch {}
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View className="flex-1 bg-[#1a1a2e] justify-center items-center">
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#1a1a2e]">
      <View className="px-4 pt-14 pb-4 flex-row justify-between items-center">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-xl font-bold">Automations</Text>
        <View style={{ width: 24 }} />
      </View>

      <FlatList
        data={automations}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetch} tintColor="#e94560" />
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-10">No automations found</Text>
        }
        renderItem={({ item }) => (
          <View className="bg-white/5 rounded-lg px-4 py-4 mb-3">
            <View className="flex-row justify-between items-start">
              <View className="flex-1">
                <Text className="text-white font-semibold text-lg">{item.name}</Text>
                <StatusBadge status={item.status} />
              </View>
              <Pressable
                className="bg-white/10 rounded-full w-8 h-8 items-center justify-center"
                onPress={() => handleDelete(item.id, item.name)}
              >
                <Ionicons name="trash" size={16} color="#e94560" />
              </Pressable>
            </View>

            {item.description && (
              <Text className="text-gray-400 text-sm mt-2">{item.description}</Text>
            )}

            <View className="flex-row items-center gap-2 mt-3">
              <View className="bg-[#533483]/20 rounded-full px-2 py-0.5">
                <Text className="text-[#533483] text-xs font-semibold">
                  Trigger: {item.trigger_type.replace("_", " ")}
                </Text>
              </View>
              <Pressable
                className={`rounded-full px-3 py-1 ${item.status === "active" ? "bg-green-500/20" : "bg-orange-500/20"}`}
                onPress={() => handleToggle(item.id)}
              >
                <Text className={`text-xs font-semibold ${item.status === "active" ? "text-green-400" : "text-orange-400"}`}>
                  {item.status === "active" ? "Pause" : "Activate"}
                </Text>
              </Pressable>
            </View>

            {item.steps && item.steps.length > 0 && (
              <View className="mt-3 pt-3 border-t border-white/5">
                <Text className="text-gray-400 text-xs mb-1">
                  {item.steps.length} step{item.steps.length > 1 ? "s" : ""}
                </Text>
                {item.steps.map((step) => (
                  <View key={step.id} className="flex-row items-center gap-2 py-1">
                    <Ionicons name="arrow-forward" size={12} color="#666" />
                    <Text className="text-gray-300 text-xs capitalize">
                      {step.action_type.replace("_", " ")}
                    </Text>
                    {step.delay_days > 0 && (
                      <Text className="text-gray-500 text-xs">
                        (after {step.delay_days}d)
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
