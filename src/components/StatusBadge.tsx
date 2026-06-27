import { Text } from "react-native";

const colors: Record<string, string> = {
  sent: "text-green-400",
  draft: "text-yellow-400",
  scheduled: "text-blue-400",
  active: "text-green-400",
  paused: "text-orange-400",
};

const backgrounds: Record<string, string> = {
  sent: "bg-green-500/20",
  draft: "bg-yellow-500/20",
  scheduled: "bg-blue-500/20",
  active: "bg-green-500/20",
  paused: "bg-orange-500/20",
};

export default function StatusBadge({ status }: { status: string }) {
  const s = status.toLowerCase();
  return (
    <Text
      className={`text-xs font-semibold px-2 py-1 rounded-full ${backgrounds[s] || "bg-gray-500/20"} ${colors[s] || "text-gray-400"}`}
    >
      {status}
    </Text>
  );
}
