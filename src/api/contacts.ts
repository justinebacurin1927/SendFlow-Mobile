import client from "./client";
import type { Contact, PaginatedResponse } from "../types";

export const contactsApi = {
  list: (params?: { search?: string; tag?: string; per_page?: number }) =>
    client.get<PaginatedResponse<Contact>>("/contacts", { params }),

  show: (id: number) => client.get<{ data: Contact }>(`/contacts/${id}`),

  create: (data: Partial<Contact> & { tag_ids?: number[] }) =>
    client.post<{ data: Contact }>("/contacts", data),

  update: (id: number, data: Partial<Contact> & { tag_ids?: number[] }) =>
    client.put<{ data: Contact }>(`/contacts/${id}`, data),

  delete: (id: number) => client.delete(`/contacts/${id}`),
};
