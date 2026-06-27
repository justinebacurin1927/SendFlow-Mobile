import client from "./client";
import type { User } from "../types";

export const profileApi = {
  get: () => client.get<User>("/profile"),

  update: (data: { name?: string; email?: string }) =>
    client.put("/profile", data),

  changePassword: (data: { current_password: string; password: string; password_confirmation: string }) =>
    client.put("/profile/password", data),

  uploadAvatar: (formData: FormData) =>
    client.post("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  removeAvatar: () => client.delete("/profile/avatar"),
};
