import { Text, View } from "react-native";

export default function ScreenHeader({ title }: { title: string }) {
  return (
    <View className="px-4 pt-14 pb-4">
      <Text className="text-white text-2xl font-bold">{title}</Text>
    </View>
  );
}
