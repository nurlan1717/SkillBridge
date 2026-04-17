import { getAccessTokenFromCookie } from "@/lib/auth/session";

type Method = "GET" | "POST" | "PUT" | "DELETE";

interface RequestOptions {
  method?: Method;
  body?: unknown;
  token?: string;
}

const RAW_API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:8080";

function normalizeBaseUrl(url: string): string {
  const trimmed = url.trim().replace(/\/+$/, "");
  return trimmed || "http://localhost:8080";
}

const API_BASE_URL = normalizeBaseUrl(RAW_API_URL);

function toAbsoluteUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body } = options;
  
  // Try to use the provided token, fallback to cookie if running in browser
  const token = options.token || (typeof window !== "undefined" ? getAccessTokenFromCookie() : null);

  const response = await fetch(toAbsoluteUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return {} as T;
  }

  const raw = await response.text();
  if (!raw) {
    return {} as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const expectsJson = contentType.includes("application/json");

  if (expectsJson) {
    try {
      return JSON.parse(raw) as T;
    } catch {
      // Some endpoints claim JSON but return plain text; allow text fallback.
      return raw as T;
    }
  }

  return raw as T;
}

export const api = {
  get: <T>(path: string, token?: string) => apiRequest<T>(path, { method: "GET", token }),
  post: <T>(path: string, body?: unknown, token?: string) =>
    apiRequest<T>(path, { method: "POST", body, token }),
  put: <T>(path: string, body?: unknown, token?: string) =>
    apiRequest<T>(path, { method: "PUT", body, token }),
  delete: <T>(path: string, token?: string) => apiRequest<T>(path, { method: "DELETE", token }),
};
