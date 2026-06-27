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
import { templatesApi } from "../../src/api/templates";
import type { MessageTemplate } from "../../src/types";

export default function TemplatesScreen() {
  const router = useRouter();
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const { data } = await templatesApi.list();
      setTemplates(data);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetch(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetch();
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert("Delete Template", `Delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await templatesApi.delete(id);
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
        <Text className="text-white text-xl font-bold">Templates</Text>
        <Pressable onPress={() => router.push("/templates/create")}>
          <Ionicons name="add" size={24} color="#e94560" />
        </Pressable>
      </View>

      <FlatList
        data={templates}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e94560" />
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-10">No templates found</Text>
        }
        renderItem={({ item }) => (
          <Pressable
            className="bg-white/5 rounded-lg px-4 py-3 mb-2"
            onPress={() => router.push(`/templates/${item.id}/edit`)}
            onLongPress={() => handleDelete(item.id, item.name)}
          >
            <Text className="text-white font-medium">{item.name}</Text>
            <Text className="text-gray-400 text-sm mt-1">{item.subject}</Text>
            <Text className="text-gray-500 text-xs mt-1" numberOfLines={2}>
              {item.body?.replace(/<[^>]*>/g, "").substring(0, 100)}
            </Text>
          </Pressable>
        )}
      />
    </View>
  );
}
