import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  View,
} from "react-native";
import { campaignsApi } from "../../src/api/campaigns";
import StatusBadge from "../../src/components/StatusBadge";
import type { Campaign } from "../../src/types";

const statusFilter = ["all", "draft", "scheduled", "sent"] as const;

export default function CampaignsScreen() {
  const router = useRouter();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const fetch = useCallback(async () => {
    try {
      const params = filter === "all" ? undefined : { status: filter };
      const { data } = await campaignsApi.list(params);
      setCampaigns(data.data);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => { fetch(); }, [fetch]);

  const onRefresh = () => {
    setRefreshing(true);
    fetch();
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
      <View className="px-4 pt-14 pb-2">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-white text-2xl font-bold">Campaigns</Text>
          <Pressable
            className="bg-[#e94560] rounded-lg px-4 py-2"
            onPress={() => router.push("/campaign/create")}
          >
            <View className="flex-row items-center gap-1">
              <Ionicons name="add" size={18} color="white" />
              <Text className="text-white font-semibold text-sm">Add</Text>
            </View>
          </Pressable>
        </View>

        <View className="flex-row gap-2 mb-4">
          {statusFilter.map((s) => (
            <Pressable
              key={s}
              onPress={() => setFilter(s)}
              className={`px-3 py-2 rounded-full ${
                filter === s ? "bg-[#e94560]" : "bg-white/10"
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  filter === s ? "text-white" : "text-gray-400"
                }`}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={campaigns}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e94560" />
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-10">
            No campaigns found
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            className="bg-white/5 rounded-lg px-4 py-3 mb-2"
            onPress={() => router.push(`/campaign/${item.id}`)}
          >
            <View className="flex-row justify-between items-center">
              <Text className="text-white font-medium flex-1">{item.name}</Text>
              <StatusBadge status={item.status} />
            </View>
            <View className="flex-row mt-2 gap-4">
              <View className="flex-row items-center gap-1">
                <Ionicons name="people" size={14} color="#666" />
                <Text className="text-gray-400 text-sm">
                  {item.recipients_count}
                </Text>
              </View>
              {item.send_date && (
                <View className="flex-row items-center gap-1">
                  <Ionicons name="calendar" size={14} color="#666" />
                  <Text className="text-gray-400 text-sm">
                    {item.send_date}
                  </Text>
                </View>
              )}
            </View>
            {item.template && (
              <Text className="text-gray-500 text-xs mt-1">
                Template: {item.template.name}
              </Text>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}
