import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { dashboardApi } from "../../src/api/dashboard";
import StatCard from "../../src/components/StatCard";
import StatusBadge from "../../src/components/StatusBadge";
import { useAuthStore } from "../../src/stores/auth";
import type { DashboardData } from "../../src/types";

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const { data: res } = await dashboardApi.get();
      setData(res);
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

  if (loading) {
    return (
      <View className="flex-1 bg-[#1a1a2e] justify-center items-center">
        <ActivityIndicator size="large" color="#e94560" />
      </View>
    );
  }

  const s = data?.stats;

  return (
    <ScrollView
      className="flex-1 bg-[#1a1a2e]"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#e94560" />
      }
    >
      <View className="px-4 pt-14 pb-4">
        <Text className="text-white text-2xl font-bold">
          Good {new Date().getHours() < 12 ? "Morning" : "Afternoon"} 👋
        </Text>
        <Text className="text-gray-400 text-sm mt-1">{user?.name}</Text>
      </View>

      {s ? (
        <View className="px-4">
          <View className="flex-row gap-3 mb-3">
            <StatCard
              icon="people"
              value={s.total_contacts}
              label="Total Contacts"
              sub={`${s.total_subscribers} subscribed`}
              color="#1a1a2e"
            />
            <StatCard
              icon="mail"
              value={s.total_subscribers}
              label="Subscribers"
              sub={`${s.subscription_rate}% rate`}
              color="#e94560"
            />
          </View>
          <View className="flex-row gap-3 mb-3">
            <StatCard
              icon="send"
              value={s.total_campaigns}
              label="Campaigns"
              sub={`${s.sent_campaigns} sent, ${s.scheduled_campaigns} scheduled`}
              color="#533483"
            />
            <StatCard
              icon="document"
              value={s.total_templates}
              label="Templates"
              sub="Ready to use"
              color="#0f3460"
            />
          </View>

          {data?.tags && data.tags.length > 0 && (
            <View className="mt-2 mb-4">
              <Text className="text-white text-lg font-semibold mb-3">
                Tags
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {data.tags.map((tag) => (
                  <View
                    key={tag.id}
                    className="bg-white/5 rounded-full px-3 py-1.5"
                  >
                    <Text className="text-white text-sm">
                      {tag.name}
                    </Text>
                    {tag.contacts_count !== undefined && (
                      <Text className="text-gray-400 text-xs ml-1">
                        ({tag.contacts_count})
                      </Text>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )}

          {data?.recent_campaigns && data.recent_campaigns.length > 0 && (
            <View className="mt-2">
              <Text className="text-white text-lg font-semibold mb-3">
                Recent Campaigns
              </Text>
              {data.recent_campaigns.map((c) => (
                <Pressable
                  key={c.id}
                  className="bg-white/5 rounded-lg px-4 py-3 mb-2"
                  onPress={() => router.push(`/campaign/${c.id}`)}
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white font-medium">{c.name}</Text>
                    <StatusBadge status={c.status} />
                  </View>
                  <Text className="text-gray-400 text-sm mt-1">
                    {c.recipients_count} recipients
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <View className="mt-4 mb-8">
            <Text className="text-white text-lg font-semibold mb-3">
              Quick Actions
            </Text>
            <View className="flex-row flex-wrap gap-3">
              <QuickAction
                icon="person-add"
                label="Add Contact"
                onPress={() => router.push("/contact/create")}
                color="#e94560"
              />
              <QuickAction
                icon="create"
                label="New Campaign"
                onPress={() => router.push("/campaign/create")}
                color="#533483"
              />
              <QuickAction
                icon="document-text"
                label="New Template"
                onPress={() => router.push("/templates/create")}
                color="#0f3460"
              />
              <QuickAction
                icon="mail"
                label="Inbox"
                onPress={() => router.push("/inbox/index")}
                color="#1a1a2e"
              />
            </View>
          </View>
        </View>
      ) : (
        <Text className="text-gray-400 text-center mt-10">
          Could not load dashboard
        </Text>
      )}
    </ScrollView>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
  color: string;
}) {
  return (
    <Pressable
      className="flex-row items-center gap-2 rounded-xl px-4 py-3"
      style={{ backgroundColor: color }}
      onPress={onPress}
    >
      <Ionicons name={icon} size={18} color="white" />
      <Text className="text-white font-semibold text-sm">{label}</Text>
    </Pressable>
  );
}
