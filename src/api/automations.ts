import client from "./client";
import type { Automation } from "../types";

export const automationsApi = {
  list: () => client.get<Automation[]>("/automations"),

  show: (id: number) =>
    client.get<{ data: Automation }>(`/automations/${id}`),

  create: (data: {
    name: string;
    description?: string;
    trigger_type: string;
    trigger_config?: Record<string, any>;
    steps: { action_type: string; action_config?: Record<string, any>; delay_days: number; order: number }[];
  }) => client.post<{ data: Automation }>("/automations", data),

  update: (id: number, data: Partial<Automation>) =>
    client.put<{ data: Automation }>(`/automations/${id}`, data),

  delete: (id: number) => client.delete(`/automations/${id}`),

  toggle: (id: number) =>
    client.post(`/automations/${id}/toggle`),
};
