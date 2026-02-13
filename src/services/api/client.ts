import axios from "axios";
import { toast } from "sonner";
import { getToken, clearToken } from "@/lib/auth";

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      clearToken();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      return Promise.reject(error);
    }

    if (status === 429) {
      toast.error("Too many requests, please try again later");
      return Promise.reject(error);
    }

    if (status && status >= 500) {
      toast.error("Something went wrong. Please try again.");
    }

    return Promise.reject(error);
  },
);
