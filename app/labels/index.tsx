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
import { labelsApi } from "../../src/api/labels";
import type { Label } from "../../src/types";

export default function LabelsScreen() {
  const router = useRouter();
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [newLabelName, setNewLabelName] = useState("");

  const fetch = useCallback(async () => {
    try {
      const { data } = await labelsApi.list();
      setLabels(data);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetch(); }, []);

  const handleCreate = async () => {
    if (!newLabelName.trim()) return;
    try {
      await labelsApi.create(newLabelName.trim());
      setNewLabelName("");
      fetch();
    } catch {}
  };

  const handleDelete = (id: number, name: string) => {
    Alert.alert("Delete Label", `Delete "${name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await labelsApi.delete(id);
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
        <Text className="text-white text-xl font-bold">Labels</Text>
        <View style={{ width: 24 }} />
      </View>

      <View className="px-4 mb-4">
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 bg-white/10 text-white px-4 py-3 rounded-lg text-base"
            placeholder="New label name"
            placeholderTextColor="#666"
            value={newLabelName}
            onChangeText={setNewLabelName}
            onSubmitEditing={handleCreate}
          />
          <Pressable className="bg-[#e94560] rounded-lg px-4 py-3" onPress={handleCreate}>
            <Ionicons name="add" size={20} color="white" />
          </Pressable>
        </View>
      </View>

      <FlatList
        data={labels}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetch} tintColor="#e94560" />
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-10">No labels found</Text>
        }
        renderItem={({ item }) => (
          <View className="bg-white/5 rounded-lg px-4 py-3 mb-2 flex-row items-center">
            <View className="flex-1">
              <Text className="text-white font-medium">{item.name}</Text>
            </View>
            <Pressable
              className="bg-white/10 rounded-full w-8 h-8 items-center justify-center"
              onPress={() => handleDelete(item.id, item.name)}
            >
              <Ionicons name="close" size={16} color="#e94560" />
            </Pressable>
          </View>
        )}
      />
    </View>
  );
}
