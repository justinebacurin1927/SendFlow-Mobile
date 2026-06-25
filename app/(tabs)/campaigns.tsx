import { Ionicons } from "@expo/vector-icons";
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
import type { Campaign } from "../../src/types";

const statusFilter = ["all", "draft", "scheduled", "sent"] as const;

export default function CampaignsScreen() {
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
      // noop
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => { fetch(); }, []);

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
        <Text className="text-white text-2xl font-bold mb-4">Campaigns</Text>

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
          <View className="bg-white/5 rounded-lg px-4 py-3 mb-2">
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
          </View>
        )}
      />
    </View>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    sent: "bg-green-500/20 text-green-400",
    draft: "bg-yellow-500/20 text-yellow-400",
    scheduled: "bg-blue-500/20 text-blue-400",
  };
  return (
    <Text
      className={`text-xs font-semibold px-2 py-1 rounded-full ${
        colors[status] || "bg-gray-500/20 text-gray-400"
      }`}
    >
      {status}
    </Text>
  );
}
