import { useRouter } from "expo-router";
import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { campaignsApi } from "../../src/api/campaigns";
import { templatesApi } from "../../src/api/templates";
import { tagsApi } from "../../src/api/tags";
import { contactsApi } from "../../src/api/contacts";
import type { MessageTemplate, Tag, Contact } from "../../src/types";

export default function CreateCampaignScreen() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);
  const [form, setForm] = useState({
    name: "",
    status: "draft",
    send_date: "",
  });

  useEffect(() => {
    Promise.all([
      templatesApi.list(),
      tagsApi.list(),
      contactsApi.list({ per_page: 100 }),
    ]).then(([tRes, tagRes, cRes]) => {
      setTemplates(tRes.data);
      setTags(tagRes.data);
      setContacts(cRes.data.data);
    });
  }, []);

  const handleSave = async () => {
    if (!form.name) { setError("Campaign name is required"); return; }
    if (!selectedTemplateId) { setError("Please select a template"); return; }
    setError("");
    setSaving(true);
    try {
      await campaignsApi.create({
        name: form.name,
        template_id: selectedTemplateId,
        status: form.status,
        send_date: form.send_date || undefined,
        tag_ids: selectedTagIds,
        contact_ids: selectedContactIds,
      });
      router.back();
    } catch (e: any) {
      setError(e.response?.data?.message || "Failed to create campaign");
    } finally {
      setSaving(false);
    }
  };

  const toggleTag = (id: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const toggleContact = (id: number) => {
    setSelectedContactIds((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <View className="flex-1 bg-[#1a1a2e]">
      <View className="px-4 pt-14 pb-4 flex-row justify-between items-center">
        <Pressable onPress={() => router.back()}>
          <Text className="text-[#e94560] text-base">Cancel</Text>
        </Pressable>
        <Text className="text-white text-xl font-bold">New Campaign</Text>
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

        <Text className="text-gray-400 text-sm mb-2">Campaign Name *</Text>
        <TextInput
          className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
          placeholder="Campaign name"
          placeholderTextColor="#666"
          value={form.name}
          onChangeText={(v) => setForm({ ...form, name: v })}
        />

        <Text className="text-gray-400 text-sm mb-2">Status</Text>
        <View className="flex-row gap-2 mb-4">
          {["draft", "scheduled"].map((s) => (
            <Pressable
              key={s}
              className={`px-4 py-2 rounded-full ${form.status === s ? "bg-[#e94560]" : "bg-white/10"}`}
              onPress={() => setForm({ ...form, status: s })}
            >
              <Text className={`text-sm font-semibold ${form.status === s ? "text-white" : "text-gray-400"}`}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        {form.status === "scheduled" && (
          <>
            <Text className="text-gray-400 text-sm mb-2">Send Date</Text>
            <TextInput
              className="bg-white/10 text-white px-4 py-3 rounded-lg mb-4 text-base"
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#666"
              value={form.send_date}
              onChangeText={(v) => setForm({ ...form, send_date: v })}
            />
          </>
        )}

        <Text className="text-white text-base font-semibold mb-3">Template *</Text>
        {templates.length === 0 ? (
          <Text className="text-gray-500 mb-4">No templates available</Text>
        ) : (
          templates.map((t) => (
            <Pressable
              key={t.id}
              className={`rounded-lg px-4 py-3 mb-2 ${selectedTemplateId === t.id ? "bg-[#e94560]/20 border border-[#e94560]" : "bg-white/5"}`}
              onPress={() => setSelectedTemplateId(t.id)}
            >
              <Text className="text-white font-medium">{t.name}</Text>
              <Text className="text-gray-400 text-sm">{t.subject}</Text>
            </Pressable>
          ))
        )}

        {tags.length > 0 && (
          <>
            <Text className="text-white text-base font-semibold mb-3 mt-4">Target by Tags</Text>
            <View className="flex-row flex-wrap gap-2 mb-4">
              {tags.map((tag) => {
                const selected = selectedTagIds.includes(tag.id);
                return (
                  <Pressable
                    key={tag.id}
                    className={`rounded-full px-3 py-1.5 ${selected ? "bg-[#533483]" : "bg-white/10"}`}
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

        {contacts.length > 0 && (
          <>
            <Text className="text-white text-base font-semibold mb-3 mt-4">
              Target by Contacts ({selectedContactIds.length} selected)
            </Text>
            {contacts.map((c) => {
              const selected = selectedContactIds.includes(c.id);
              return (
                <Pressable
                  key={c.id}
                  className={`rounded-lg px-4 py-3 mb-1 flex-row items-center ${selected ? "bg-[#533483]/20" : "bg-white/5"}`}
                  onPress={() => toggleContact(c.id)}
                >
                  <Text className={`mr-2 ${selected ? "text-[#e94560]" : "text-gray-500"}`}>
                    {selected ? "✓" : "○"}
                  </Text>
                  <View className="flex-1">
                    <Text className="text-white text-sm">{c.full_name || c.email}</Text>
                    <Text className="text-gray-400 text-xs">{c.email}</Text>
                  </View>
                </Pressable>
              );
            })}
          </>
        )}
      </ScrollView>
    </View>
  );
}
