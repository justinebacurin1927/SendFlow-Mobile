import client from "./client";
import type { Campaign, PaginatedResponse } from "../types";

export const campaignsApi = {
  list: (params?: { status?: string; per_page?: number }) =>
    client.get<PaginatedResponse<Campaign>>("/campaigns", { params }),

  show: (id: number) => client.get<{ data: Campaign }>(`/campaigns/${id}`),

  create: (data: {
    name: string;
    template_id: number;
    status: string;
    send_date?: string;
    contact_ids?: number[];
    tag_ids?: number[];
  }) => client.post<{ data: Campaign }>("/campaigns", data),

  update: (
    id: number,
    data: Partial<{
      name: string;
      status: string;
      send_date: string;
      template_id: number;
      contact_ids: number[];
      tag_ids: number[];
    }>
  ) => client.put<{ data: Campaign }>(`/campaigns/${id}`, data),

  delete: (id: number) => client.delete(`/campaigns/${id}`),

  send: (id: number) => client.post(`/campaigns/${id}/send`),

  recipients: (id: number) =>
    client.get<{ total: number; recipients: unknown[] }>(
      `/campaigns/${id}/recipients`
    ),
};
