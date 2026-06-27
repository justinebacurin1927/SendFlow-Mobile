import client from "./client";
import type { Message } from "../types";

export const inboxApi = {
  list: (params?: { status?: string }) =>
    client.get<Message[]>("/audience/inbox", { params }),

  markRead: (id: number) =>
    client.post(`/inbox/${id}/read`),

  trash: (id: number) =>
    client.post(`/inbox/${id}/trash`),

  delete: (id: number) =>
    client.delete(`/inbox/${id}`),
};
