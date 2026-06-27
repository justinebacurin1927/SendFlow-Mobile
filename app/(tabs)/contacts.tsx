import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";
import { contactsApi } from "../../src/api/contacts";
import type { Contact } from "../../src/types";

export default function ContactsScreen() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const fetch = useCallback(async (q?: string) => {
    try {
      const { data } = await contactsApi.list({ search: q || undefined });
      setContacts(data.data);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetch(); }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetch(search);
  };

  const onSearch = (text: string) => {
    setSearch(text);
    fetch(text);
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
        <View className="flex-row justify-between items-center mb-3">
          <Text className="text-white text-2xl font-bold">Contacts</Text>
          <Pressable
            className="bg-[#e94560] rounded-lg px-4 py-2"
            onPress={() => router.push("/contact/create")}
          >
            <View className="flex-row items-center gap-1">
              <Ionicons name="add" size={18} color="white" />
              <Text className="text-white font-semibold text-sm">Add</Text>
            </View>
          </Pressable>
        </View>
        <View className="flex-row items-center bg-white/10 rounded-lg px-3">
          <Ionicons name="search" size={18} color="#666" />
          <TextInput
            className="flex-1 text-white px-3 py-3"
            placeholder="Search contacts..."
            placeholderTextColor="#666"
            value={search}
            onChangeText={onSearch}
          />
        </View>
      </View>

      <FlatList
        data={contacts}
        keyExtractor={(item) => String(item.id)}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e94560" />
        }
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
        ListEmptyComponent={
          <Text className="text-gray-400 text-center mt-10">
            No contacts found
          </Text>
        }
        renderItem={({ item }) => (
          <Pressable
            className="bg-white/5 rounded-lg px-4 py-3 mb-2"
            onPress={() => router.push(`/contact/${item.id}`)}
          >
            <View className="flex-row items-center">
              <View className="bg-white/10 rounded-full w-10 h-10 items-center justify-center mr-3">
                <Ionicons name="person" size={18} color="#e94560" />
              </View>
              <View className="flex-1">
                <Text className="text-white font-medium">
                  {item.full_name || item.email}
                </Text>
                <Text className="text-gray-400 text-sm">{item.email}</Text>
              </View>
              <Text
                className={`text-xs font-semibold px-2 py-1 rounded-full ${
                  item.subscribed
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-500/20 text-gray-400"
                }`}
              >
                {item.subscribed ? "Active" : "Inactive"}
              </Text>
            </View>
            {item.tags.length > 0 && (
              <View className="flex-row mt-2 gap-2">
                {item.tags.map((tag) => (
                  <Text
                    key={tag.id}
                    className="text-xs text-[#e94560] bg-[#e94560]/10 px-2 py-0.5 rounded-full"
                  >
                    {tag.name}
                  </Text>
                ))}
              </View>
            )}
          </Pressable>
        )}
      />
    </View>
  );
}
