import client from "./client";
import type { Tag } from "../types";

export const tagsApi = {
  list: () => client.get<Tag[]>("/tags"),

  create: (name: string) =>
    client.post<{ data: Tag }>("/tags", { name }),

  update: (id: number, name: string) =>
    client.put<{ data: Tag }>(`/tags/${id}`, { name }),

  delete: (id: number) => client.delete(`/tags/${id}`),

  bulkDelete: (ids: number[]) =>
    client.post("/tags/bulk-delete", { ids }),
};
