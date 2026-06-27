import { ActivityIndicator, View } from "react-native";

export default function LoadingScreen() {
  return (
    <View className="flex-1 bg-[#1a1a2e] justify-center items-center">
      <ActivityIndicator size="large" color="#e94560" />
    </View>
  );
}
