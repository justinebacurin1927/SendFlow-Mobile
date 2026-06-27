import { create } from "zustand";
import { notificationsApi } from "../api/notifications";
import type { Notification } from "../types";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  fetch: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  fetch: async () => {
    try {
      const { data } = await notificationsApi.list();
      set({ notifications: data });
    } catch {}
  },

  fetchUnreadCount: async () => {
    try {
      const { data } = await notificationsApi.unreadCount();
      set({ unreadCount: data.count });
    } catch {}
  },

  markRead: async (id) => {
    try {
      await notificationsApi.markRead(id);
      get().fetch();
      get().fetchUnreadCount();
    } catch {}
  },

  markAllRead: async () => {
    try {
      await notificationsApi.markAllRead();
      set({ unreadCount: 0 });
      get().fetch();
    } catch {}
  },
}));
