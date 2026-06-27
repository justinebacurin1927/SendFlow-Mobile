import client from "./client";
import type { Source } from "../types";

export const sourcesApi = {
  list: () => client.get<Source[]>("/add-source"),

  create: (email: string) =>
    client.post<{ data: Source }>("/add-source", { email }),

  delete: (id: number) =>
    client.delete(`/delete-source/${id}`),
};
