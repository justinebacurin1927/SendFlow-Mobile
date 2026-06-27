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
import { inboxApi } from "../../src/api/inbox";
import type { Message } from "../../src/types";

export default function InboxScreen() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>("inbox");

  const fetch = useCallback(async () => {
    try {
      const params = filter === "inbox" ? undefined : { status: filter };
      const { data } = await inboxApi.list(params);
      setMessages(data);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleMarkRead = async (id: number) => {
    try {
      await inboxApi.markRead(id);
      fetch();
    } catch {}
  };

  const handleTrash = (id: number) => {
    Alert.alert("Trash Message", "Move to trash?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Trash",
        onPress: async () => {
          try {
            await inboxApi.trash(id);
            fetch();
          } catch {}
        },
      },
    ]);
  };

  const filters = ["inbox", "done", "trash"];

  if (loading) {
    return (
      <View className="flex-1 bg-[#1a1a2e] justify-center items-center">
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#1a1a2e]">
      <View className="px-4 pt-14 pb-4">
        <View className="flex-row justify-between items-center mb-4">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </Pressable>
          <Text className="text-white text-xl font-bold">Inbox</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="flex-row gap-2">
          {filters.map((f) => (
            <Pressable
              key={f}
              className={`px-3 py-2 rounded-full ${filter === f ? "bg-[#e94560]" : "bg-white/10"}`}
              onPress={() => setFilter(f)}
            >
              <Text className={`text-sm font-semibold ${filter === f ? "text-white" : "text-gray-400"}`}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetch} tintColor="#e94560" />
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-10">No messages found</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            className={`rounded-lg px-4 py-3 mb-2 ${item.is_read ? "bg-white/5" : "bg-white/10"}`}
            onPress={() => {
              if (!item.is_read) handleMarkRead(item.id);
            }}
            onLongPress={() => handleTrash(item.id)}
          >
            <View className="flex-row items-center">
              <View className="flex-1">
                <View className="flex-row items-center gap-2">
                  {!item.is_read && <View className="w-2 h-2 rounded-full bg-[#e94560]" />}
                  <Text className={`text-white font-medium flex-1 ${!item.is_read ? "font-bold" : ""}`}>
                    {item.sender_name || item.sender_email || "Unknown"}
                  </Text>
                </View>
                <Text className="text-gray-400 text-sm mt-0.5" numberOfLines={1}>
                  {item.subject || "(no subject)"}
                </Text>
              </View>
              <Text className="text-gray-500 text-xs">
                {new Date(item.created_at).toLocaleDateString()}
              </Text>
            </View>
            <Text className="text-gray-500 text-xs mt-1" numberOfLines={2}>
              {item.body?.replace(/<[^>]*>/g, "").substring(0, 120)}
            </Text>
            <View className="flex-row items-center gap-2 mt-2">
              <Text className="text-xs text-[#533483] bg-[#533483]/10 px-2 py-0.5 rounded-full">
                {item.source_type}
              </Text>
              {item.is_trashed && (
                <Text className="text-xs text-orange-400 bg-orange-500/10 px-2 py-0.5 rounded-full">
                  Trashed
                </Text>
              )}
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}
