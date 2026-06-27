import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { profileApi } from "../../src/api/profile";
import { useAuthStore } from "../../src/stores/auth";

export default function ProfileScreen() {
  const router = useRouter();
  const { user, login } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleUpdateProfile = async () => {
    setError("");
    setSaving(true);
    try {
      await profileApi.update({ name, email });
      Alert.alert("Success", "Profile updated");
    } catch (e: any) {
      setError(e.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setError("");
    setSaving(true);
    try {
      await profileApi.changePassword({
        current_password: currentPassword,
        password: newPassword,
        password_confirmation: confirmPassword,
      });
      Alert.alert("Success", "Password changed");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (e: any) {
      setError(e.response?.data?.message || "Password change failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <View className="flex-1 bg-[#1a1a2e]">
      <View className="px-4 pt-14 pb-4 flex-row items-center">
        <Pressable onPress={() => router.back()} className="mr-4">
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <Text className="text-white text-xl font-bold">Profile</Text>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {error ? (
          <Text className="text-[#e94560] mb-4 text-sm">{error}</Text>
        ) : null}

        <View className="items-center mb-6">
          <View className="bg-white/10 rounded-full w-20 h-20 items-center justify-center mb-3">
            <Ionicons name="person" size={40} color="#e94560" />
          </View>
        </View>

        <Text className="text-white text-lg font-semibold mb-4">Profile Info</Text>

        <Text className="text-gray-400 text-sm mb-2">Name</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          value={name}
          onChangeText={setName}
        />

        <Text className="text-gray-400 text-sm mb-2">Email</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Pressable
          className="bg-[#e94560] py-3 rounded-lg items-center mb-8"
          onPress={handleUpdateProfile}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-semibold">Update Profile</Text>
          )}
        </Pressable>

        <Text className="text-white text-lg font-semibold mb-4">Change Password</Text>

        <Text className="text-gray-400 text-sm mb-2">Current Password</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          value={currentPassword}
          onChangeText={setCurrentPassword}
          secureTextEntry
        />

        <Text className="text-gray-400 text-sm mb-2">New Password</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          value={newPassword}
          onChangeText={setNewPassword}
          secureTextEntry
        />

        <Text className="text-gray-400 text-sm mb-2">Confirm New Password</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <Pressable
          className="bg-white/10 py-3 rounded-lg items-center"
          onPress={handleChangePassword}
          disabled={saving}
        >
          <Text className="text-white font-semibold">Change Password</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
