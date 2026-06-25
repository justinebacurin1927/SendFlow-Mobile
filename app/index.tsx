import { Redirect } from "expo-router";
import { useAuthStore } from "../src/stores/auth";

export default function Index() {
  const { isAuthenticated } = useAuthStore();
  return <Redirect href={isAuthenticated ? "/(tabs)" : "/login"} />;
}
