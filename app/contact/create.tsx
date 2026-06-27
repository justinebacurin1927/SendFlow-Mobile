import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
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
import { contactsApi } from "../../src/api/contacts";
import { tagsApi } from "../../src/api/tags";
import type { Tag } from "../../src/types";

export default function CreateContactScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [form, setForm] = useState({
    email: "",
    first_name: "",
    last_name: "",
    company: "",
    phone: "",
    birthday: "",
    street: "",
    address2: "",
    city: "",
    region: "",
    postal: "",
    country: "",
    subscribed: true,
    permission: false,
  });

  useEffect(() => {
    tagsApi.list().then(({ data }) => setTags(data));
  }, []);

  const handleSave = async () => {
    if (!form.email) { setError("Email is required"); return; }
    setError("");
    setSaving(true);
    try {
      await contactsApi.create({ ...form, tag_ids: selectedTagIds });
      router.back();
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to create contact");
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
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
        <Text className="text-white text-xl font-bold">Add Contact</Text>
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

        <Text className="text-gray-400 text-sm mb-2">Email *</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          placeholder="email@example.com"
          placeholderTextColor="#666"
          value={form.email}
          onChangeText={(v) => setForm({ ...form, email: v })}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <Text className="text-gray-400 text-sm mb-2">First Name</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          placeholder="First name"
          placeholderTextColor="#666"
          value={form.first_name}
          onChangeText={(v) => setForm({ ...form, first_name: v })}
        />

        <Text className="text-gray-400 text-sm mb-2">Last Name</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          placeholder="Last name"
          placeholderTextColor="#666"
          value={form.last_name}
          onChangeText={(v) => setForm({ ...form, last_name: v })}
        />

        <Text className="text-gray-400 text-sm mb-2">Company</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          placeholder="Company"
          placeholderTextColor="#666"
          value={form.company}
          onChangeText={(v) => setForm({ ...form, company: v })}
        />

        <Text className="text-gray-400 text-sm mb-2">Phone</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          placeholder="Phone"
          placeholderTextColor="#666"
          value={form.phone}
          onChangeText={(v) => setForm({ ...form, phone: v })}
          keyboardType="phone-pad"
        />

        <Text className="text-white text-base font-semibold mb-3 mt-2">Address</Text>

        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          placeholder="Street"
          placeholderTextColor="#666"
          value={form.street}
          onChangeText={(v) => setForm({ ...form, street: v })}
        />

        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          placeholder="Address Line 2"
          placeholderTextColor="#666"
          value={form.address2}
          onChangeText={(v) => setForm({ ...form, address2: v })}
        />

        <View className="flex-row gap-3">
          <View className="flex-1">
            <TextInput
              className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
              placeholder="City"
              placeholderTextColor="#666"
              value={form.city}
              onChangeText={(v) => setForm({ ...form, city: v })}
            />
          </View>
          <View className="flex-1">
            <TextInput
              className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
              placeholder="Region"
              placeholderTextColor="#666"
              value={form.region}
              onChangeText={(v) => setForm({ ...form, region: v })}
            />
          </View>
        </View>

        <View className="flex-row gap-3">
          <View className="flex-1">
            <TextInput
              className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
              placeholder="Postal Code"
              placeholderTextColor="#666"
              value={form.postal}
              onChangeText={(v) => setForm({ ...form, postal: v })}
            />
          </View>
          <View className="flex-1">
            <TextInput
              className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
              placeholder="Country"
              placeholderTextColor="#666"
              value={form.country}
              onChangeText={(v) => setForm({ ...form, country: v })}
            />
          </View>
        </View>

        {tags.length > 0 && (
          <>
            <Text className="text-white text-base font-semibold mb-3 mt-2">Tags</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {tags.map((tag) => {
                const selected = selectedTagIds.includes(tag.id);
                return (
                  <Pressable
                    key={tag.id}
                    className={`rounded-full px-3 py-1.5 ${selected ? "bg-[#e94560]" : "bg-white/10"}`}
                    onPress={() => toggleTag(tag.id)}
                  >
                    <Text className={`text-sm ${selected ? "text-white" : "text-gray-300"}`}>
                      {tag.name}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}

        <Pressable
          className={`py-3 rounded-lg items-center mt-4 ${form.subscribed ? "bg-green-500/20" : "bg-white/10"}`}
          onPress={() => setForm({ ...form, subscribed: !form.subscribed })}
        >
          <Text className={`font-semibold ${form.subscribed ? "text-green-400" : "text-gray-400"}`}>
            {form.subscribed ? "✓ Subscribed" : "Not Subscribed"}
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
