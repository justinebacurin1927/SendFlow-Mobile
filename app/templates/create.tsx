import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { templatesApi } from "../../src/api/templates";

export default function CreateTemplateScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({ name: "", subject: "", body: "" });

  const handleSave = async () => {
    if (!form.name) { setError("Template name is required"); return; }
    if (!form.subject) { setError("Subject is required"); return; }
    if (!form.body) { setError("Body is required"); return; }
    setError("");
    setSaving(true);
    try {
      await templatesApi.create(form);
      router.back();
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to create template");
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#1a1a2e]"
    >
      <View className="px-4 pt-14 pb-4 flex-row justify-between items-center">
        <Pressable onPress={() => router.back()}>
          <Text className="text-[#e94560] text-base">Cancel</Text>
        </Pressable>
        <Text className="text-white text-xl font-bold">New Template</Text>
        <Pressable onPress={handleSave} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color="#e94560" />
          ) : (
            <Text className="text-[#e94560] text-base font-semibold">Save</Text>
          )}
        </Pressable>
      </View>

      <ScrollView className="flex-1 px-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {error ? (
          <Text className="text-[#e94560] mb-4 text-sm">{error}</Text>
        ) : null}

        <Text className="text-gray-400 text-sm mb-2">Template Name *</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          placeholder="My Template"
          placeholderTextColor="#666"
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
        />

        <Text className="text-gray-400 text-sm mb-2">Subject *</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          placeholder="Email subject line"
          placeholderTextColor="#666"
          value={form.subject}
          onChangeText={(v) => setForm({ ...form, subject: v })}
        />

        <Text className="text-gray-400 text-sm mb-2">HTML Body *</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          placeholder="<h1>Hello {{name}}!</h1><p>Your content here...</p>"
          placeholderTextColor="#666"
          value={form.body}
          onChangeText={(v) => setForm({ ...form, body: v })}
          multiline
          numberOfLines={10}
          style={{ minHeight: 200, textAlignVertical: "top" }}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
