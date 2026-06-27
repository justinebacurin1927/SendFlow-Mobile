import client from "./client";
import type { MessageTemplate } from "../types";

export const templatesApi = {
  list: () => client.get<MessageTemplate[]>("/message-temp"),

  show: (id: number) =>
    client.get<{ data: MessageTemplate }>(`/template-form/${id}`),

  create: (data: { name: string; subject: string; body: string }) =>
    client.post<{ data: MessageTemplate }>("/template-form", data),

  update: (id: number, data: Partial<{ name: string; subject: string; body: string }>) =>
    client.put<{ data: MessageTemplate }>(`/template-form/${id}`, data),

  delete: (id: number) => client.delete(`/template-form/${id}`),
};
