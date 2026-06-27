import client from "./client";
import type { Label } from "../types";

export const labelsApi = {
  list: () => client.get<Label[]>("/audience/add-labels"),

  create: (name: string) =>
    client.post<{ data: Label }>("/audience/add-labels", { name }),

  update: (id: number, name: string) =>
    client.put<{ data: Label }>(`/audience/rename-label/${id}`, { name }),

  delete: (id: number) =>
    client.delete(`/audience/delete-label/${id}`),
};
