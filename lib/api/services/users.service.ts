import { endpoints } from "@/lib/api/endpoints";
import { api } from "@/lib/api/http";
import { apiRequest } from "@/lib/api/http";
import type { User } from "@/lib/api/types";

export type DirectoryUserRole = "USER" | "STUDENT" | "MENTOR" | "EMPLOYER" | "ADMIN";

export interface DirectoryUserSkill {
  id: number | string;
  title: string;
  description?: string | null;
  category: string;
  difficulty: string;
  iconUrl?: string | null;
  active: boolean;
}

export interface DirectoryUser {
  id: number | string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: DirectoryUserRole;
  active: boolean;
  emailVerified: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  skills?: DirectoryUserSkill[];
}

export interface ProfileUser {
  id: number | string;
  fullName: string;
  email: string;
  phone?: string | null;
  role: DirectoryUserRole;
  active: boolean;
  emailVerified: boolean;
  createdAt?: string | null;
  updatedAt?: string | null;
  skills?: DirectoryUserSkill[];
}

export function listUsers(token?: string) {
  return api.get<DirectoryUser[]>(endpoints.users.list, token);
}

export const usersService = {
  me: (token: string) => apiRequest<User>(endpoints.users.me, { token }),

  updateMe: (token: string, payload: Partial<User>) =>
    apiRequest<User>(endpoints.users.me, { method: "PUT", token, body: payload }),

  byId: (token: string, id: string) => apiRequest<ProfileUser>(endpoints.users.byId(id), { token }),

  list: (token: string) => apiRequest<User[]>(endpoints.users.list, { token }),
};
