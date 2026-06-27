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
  TextInput,
  View,
} from "react-native";
import { sourcesApi } from "../../src/api/sources";
import type { Source } from "../../src/types";

export default function SourcesScreen() {
  const router = useRouter();
  const [sources, setSources] = useState<Source[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newEmail, setNewEmail] = useState("");

  const fetch = useCallback(async () => {
    try {
      const { data } = await sourcesApi.list();
      setSources(data);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetch(); }, []);

  const handleCreate = async () => {
    if (!newEmail.trim()) return;
    try {
      await sourcesApi.create(newEmail.trim());
      setNewEmail("");
      fetch();
    } catch {}
  };

  const handleDelete = (id: number, email: string) => {
    Alert.alert("Delete Source", `Delete "${email}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await sourcesApi.delete(id);
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
        <Text className="text-white text-xl font-bold">Sources</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="px-4 mb-4">
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 bg-white/10 text-white px-4 py-3 rounded-lg text-base"
            placeholder="email@example.com"
            placeholderTextColor="#666"
            value={newEmail}
            onChangeText={setNewEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            onSubmitEditing={handleCreate}
          />
          <Pressable className="bg-[#e94560] rounded-lg px-4 py-3" onPress={handleCreate}>
            <Ionicons name="add" size={20} color="white" />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={sources}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetch} tintColor="#e94560" />
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-10">No sources found</Text>
        }
        renderItem={({ item }) => (
          <View className="bg-white/5 rounded-lg px-4 py-3 mb-2 flex-row items-center">
            <Ionicons name="mail" size={18} color="#e94560" className="mr-3" />
            <View className="flex-1">
              <Text className="text-white font-medium">{item.email}</Text>
            </View>
            <Pressable
              className="bg-white/10 rounded-full w-8 h-8 items-center justify-center"
              onPress={() => handleDelete(item.id, item.email)}
            >
              <Ionicons name="close" size={16} color="#e94560" />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
