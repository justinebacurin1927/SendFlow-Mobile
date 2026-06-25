import client from "./client";
import type { AuthResponse, User } from "../types";

export const authApi = {
  login: (email: string, password: string) =>
    client.post<AuthResponse>("/auth/login", { email, password }),

  register: (name: string, email: string, password: string) =>
    client.post<AuthResponse>("/auth/register", {
      name,
      email,
      password,
      password_confirmation: password,
    }),

  user: () => client.get<User>("/auth/user"),

  logout: () => client.post("/auth/logout"),
};
