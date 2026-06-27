import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function StatCard({
  icon,
  value,
  label,
  sub,
  color,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  value: number | string;
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
