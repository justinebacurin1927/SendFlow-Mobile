import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { campaignsApi } from "../../../src/api/campaigns";
import type { Campaign } from "../../../src/types";

export default function CampaignPreviewScreen() {
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

  if (loading) {
    return (
      <View className="flex-1 bg-[#1a1a2e] justify-center items-center">
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  if (!campaign?.template) {
    return (
      <View className="flex-1 bg-[#1a1a2e] justify-center items-center">
        <Text className="text-gray-400">No template found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-[#1a1a2e]">
      <View className="px-4 pt-14 pb-4 flex-row items-center">
        <Pressable onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <View className="flex-1">
          <Text className="text-white text-lg font-bold">Email Preview</Text>
          <Text className="text-gray-400 text-sm">{campaign.template.subject}</Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-4">
        <View className="bg-white rounded-lg p-4 mb-8">
          <Text className="text-gray-800 text-lg font-bold mb-2">
            Subject: {campaign.template.subject}
          </Text>
          <View className="border-t border-gray-200 my-2" />
          <Text className="text-gray-700 leading-6">
            {campaign.template.body}
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
