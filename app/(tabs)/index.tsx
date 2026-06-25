import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from "react-native";
import { dashboardApi } from "../../src/api/dashboard";
import { useAuthStore } from "../../src/stores/auth";
import type { DashboardData } from "../../src/types";

export default function DashboardScreen() {
  const { user } = useAuthStore();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const { data: res } = await dashboardApi.get();
      setData(res);
    } catch {
      // error state handled implicitly
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
        <Text className="text-white text-2xl font-bold">Good {new Date().getHours() < 12 ? "Morning" : "Afternoon"}</Text>
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

          {data?.recent_campaigns && data.recent_campaigns.length > 0 && (
            <View className="mt-2">
              <Text className="text-white text-lg font-semibold mb-3">
                Recent Campaigns
              </Text>
              {data.recent_campaigns.map((c) => (
                <View
                  key={c.id}
                  className="bg-white/5 rounded-lg px-4 py-3 mb-2"
                >
                  <View className="flex-row justify-between items-center">
                    <Text className="text-white font-medium">{c.name}</Text>
                    <StatusBadge status={c.status} />
                  </View>
                  <Text className="text-gray-400 text-sm mt-1">
                    {c.recipients_count} recipients
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      ) : (
        <Text className="text-gray-400 text-center mt-10">
          Could not load dashboard
        </Text>
      )}
    </ScrollView>
  );
}

function StatCard({
  icon,
  value,
  label,
  sub,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number;
  label: string;
  sub: string;
  color: string;
}) {
  return (
    <View className="flex-1 rounded-xl p-4" style={{ backgroundColor: color }}>
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text className="text-white/70 text-xs font-semibold">{label}</Text>
          <Text className="text-white text-2xl font-bold mt-1">{value}</Text>
        </View>
        <View className="bg-white/10 rounded-full w-10 h-10 items-center justify-center">
          <Ionicons name={icon} size={18} color="white" />
        </View>
      </View>
      <Text className="text-white/80 text-xs font-semibold mt-2">{sub}</Text>
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
