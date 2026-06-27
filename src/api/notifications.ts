import client from "./client";
import type { Notification } from "../types";

export const notificationsApi = {
  list: () => client.get<Notification[]>("/notifications"),

  unreadCount: () =>
    client.get<{ count: number }>("/notifications/unread-count"),

  markRead: (id: string) =>
    client.post(`/notifications/${id}/read`),

  markAllRead: () =>
    client.post("/notifications/read-all"),
};
