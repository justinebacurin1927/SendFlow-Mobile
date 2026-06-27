import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { contactsApi } from "../../src/api/contacts";
import type { Contact } from "../../src/types";

export default function ContactDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const { data } = await contactsApi.show(Number(id));
      setContact(data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleDelete = () => {
    Alert.alert("Delete Contact", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await contactsApi.delete(Number(id));
            router.back();
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

  if (!contact) {
    return (
      <View className="flex-1 bg-[#1a1a2e] justify-center items-center">
        <Text className="text-gray-400">Contact not found</Text>
      </View>
    );
  }

  const rows: { label: string; value: string | null }[] = [
    { label: "Email", value: contact.email },
    { label: "First Name", value: contact.first_name },
    { label: "Last Name", value: contact.last_name },
    { label: "Company", value: contact.company },
    { label: "Phone", value: contact.phone },
    { label: "Birthday", value: contact.birthday },
    { label: "Street", value: contact.street },
    { label: "Address 2", value: contact.address2 },
    { label: "City", value: contact.city },
    { label: "Region", value: contact.region },
    { label: "Postal", value: contact.postal },
    { label: "Country", value: contact.country },
  ];

  return (
    <View className="flex-1 bg-[#1a1a2e]">
      <View className="px-4 pt-14 pb-4 flex-row justify-between items-center">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-xl font-bold">Contact</Text>
        <Pressable onPress={handleDelete}>
          <Ionicons name="trash" size={22} color="#e94560" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="items-center mb-6">
          <View className="bg-white/10 rounded-full w-20 h-20 items-center justify-center mb-3">
            <Ionicons name="person" size={36} color="#e94560" />
          </View>
          <Text className="text-white text-xl font-bold">
            {contact.full_name || contact.email}
          </Text>
          <View className={`px-3 py-1 rounded-full mt-2 ${contact.subscribed ? "bg-green-500/20" : "bg-gray-500/20"}`}>
            <Text className={`text-xs font-semibold ${contact.subscribed ? "text-green-400" : "text-gray-400"}`}>
              {contact.subscribed ? "Subscribed" : "Unsubscribed"}
            </Text>
          </View>
        </View>

        {contact.tags.length > 0 && (
          <View className="flex-row flex-wrap gap-2 mb-6 justify-center">
            {contact.tags.map((tag) => (
              <View key={tag.id} className="bg-[#e94560]/10 rounded-full px-3 py-1">
                <Text className="text-[#e94560] text-sm">{tag.name}</Text>
              </View>
            ))}
          </View>
        )}

        <View className="bg-white/5 rounded-lg overflow-hidden">
          {rows.map(
            (row, i) =>
              row.value && (
                <View
                  key={row.label}
                  className={`flex-row px-4 py-3 ${i < rows.length - 1 ? "border-b border-white/5" : ""}`}
                >
                  <Text className="text-gray-400 flex-1">{row.label}</Text>
                  <Text className="text-white flex-1 text-right">{row.value}</Text>
                </View>
              )
          )}
        </View>

        <Text className="text-gray-500 text-xs text-center mt-4">
          Created {new Date(contact.created_at).toLocaleDateString()}
        </Text>
      </ScrollView>
    </View>
  );
}
