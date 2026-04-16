import { endpoints } from "@/lib/api/endpoints";
import { apiRequest } from "@/lib/api/http";
import type {
  AuthPayload,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "@/lib/api/types";

export const authService = {
  register: (payload: RegisterRequest) =>
    apiRequest<AuthPayload>(endpoints.auth.register, { method: "POST", body: payload }),

  login: (payload: LoginRequest) =>
    apiRequest<LoginResponse>(endpoints.auth.login, { method: "POST", body: payload }),
};
