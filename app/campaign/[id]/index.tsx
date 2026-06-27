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
import { campaignsApi } from "../../../src/api/campaigns";
import StatusBadge from "../../../src/components/StatusBadge";
import type { Campaign } from "../../../src/types";

export default function CampaignDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    try {
      const { data } = await campaignsApi.show(Number(id));
      setCampaign(data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { fetch(); }, [fetch]);

  const handleSend = () => {
    Alert.alert("Send Campaign", "Send this campaign now?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Send Now",
        onPress: async () => {
          try {
            await campaignsApi.send(Number(id));
            fetch();
          } catch {}
        },
      },
    ]);
  };

  const handleDuplicate = async () => {
    try {
      await campaignsApi.create({
        name: `${campaign?.name} (Copy)`,
        template_id: campaign!.template_id || campaign!.template!.id,
        status: "draft",
      });
      router.back();
    } catch {}
  };

  const handleDelete = () => {
    Alert.alert("Delete Campaign", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await campaignsApi.delete(Number(id));
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

  if (!campaign) {
    return (
      <View className="flex-1 bg-[#1a1a2e] justify-center items-center">
        <Text className="text-gray-400">Campaign not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#1a1a2e]">
      <View className="px-4 pt-14 pb-4 flex-row justify-between items-center">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-xl font-bold">Campaign</Text>
        <Pressable onPress={handleDelete}>
          <Ionicons name="trash" size={22} color="#e94560" />
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 40 }}>
        <View className="mb-6">
          <Text className="text-white text-2xl font-bold">{campaign.name}</Text>
          <View className="flex-row items-center mt-2 gap-3">
            <StatusBadge status={campaign.status} />
            {campaign.type && (
              <Text className="text-gray-400 text-sm capitalize">{campaign.type}</Text>
            )}
          </View>
        </View>

        <View className="bg-white/5 rounded-lg px-4 py-4 mb-6">
          <View className="flex-row items-center mb-3">
            <Ionicons name="people" size={18} color="#e94560" />
            <Text className="text-white ml-2">
              {campaign.recipients_count} recipients
            </Text>
          </View>
          {campaign.send_date && (
            <View className="flex-row items-center mb-3">
              <Ionicons name="calendar" size={18} color="#e94560" />
              <Text className="text-white ml-2">{campaign.send_date}</Text>
            </View>
          )}
          {campaign.sent_at && (
            <View className="flex-row items-center mb-3">
              <Ionicons name="checkmark-circle" size={18} color="#4ade80" />
              <Text className="text-green-400 ml-2">
                Sent {new Date(campaign.sent_at).toLocaleDateString()}
              </Text>
            </View>
          )}
          {campaign.created_by && (
            <View className="flex-row items-center">
              <Ionicons name="person" size={18} color="#e94560" />
              <Text className="text-white ml-2">Created by {campaign.created_by}</Text>
            </View>
          )}
        </View>

        {campaign.template && (
          <View className="bg-white/5 rounded-lg px-4 py-4 mb-6">
            <Text className="text-gray-400 text-sm mb-1">Template</Text>
            <Text className="text-white font-semibold text-lg">{campaign.template.name}</Text>
            <Text className="text-gray-400">{campaign.template.subject}</Text>
          </View>
        )}

        <View className="flex-row gap-3">
          {campaign.status === "draft" && (
            <Pressable
              className="flex-1 bg-[#e94560] py-3 rounded-lg items-center"
              onPress={handleSend}
            >
              <Text className="text-white font-semibold">Send Now</Text>
            </Pressable>
          )}
          <Pressable
            className="flex-1 bg-white/10 py-3 rounded-lg items-center"
            onPress={handleDuplicate}
          >
            <Text className="text-white font-semibold">Duplicate</Text>
          </Pressable>
          {campaign.template && (
            <Pressable
              className="flex-1 bg-white/10 py-3 rounded-lg items-center"
              onPress={() => router.push(`/campaign/${id}/preview`)}
            >
              <Text className="text-white font-semibold">Preview</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
