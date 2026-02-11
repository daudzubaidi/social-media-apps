import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/services/api/client";
import { API_ENDPOINTS } from "@/config/constants";
import { setToken, clearToken } from "@/lib/auth";
import type { ApiResponse } from "@/types/api";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "@/types/auth";

export function useLogin() {
  return useMutation({
    mutationFn: async (data: LoginRequest) => {
      const res = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.LOGIN,
        data,
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const res = await apiClient.post<ApiResponse<AuthResponse>>(
        API_ENDPOINTS.AUTH.REGISTER,
        data,
      );
      return res.data.data;
    },
    onSuccess: (data) => {
      setToken(data.token);
    },
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: async () => {
      clearToken();
    },
  });
}
