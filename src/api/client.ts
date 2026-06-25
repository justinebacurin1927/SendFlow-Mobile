import axios from "axios";
import { useAuthStore } from "../stores/auth";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8000/api";

const client = axios.create({
  baseURL: API_URL,
  headers: { Accept: "application/json" },
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default client;
