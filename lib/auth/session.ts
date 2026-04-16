export type JwtClaims = {
  sub?: string;
  id?: string | number;
  userId?: string | number;
  role?: "USER" | "STUDENT" | "MENTOR" | "EMPLOYER" | "ADMIN";
  email?: string;
  exp?: number;
  iat?: number;
};

type TokenResponseLike = {
  token?: string;
  accessToken?: string;
  data?: {
    token?: string;
    accessToken?: string;
  };
};

const ACCESS_COOKIE = "sb_access_token";

function parseCookies(): Record<string, string> {
  if (typeof document === "undefined") {
    return {};
  }

  return document.cookie
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .reduce<Record<string, string>>((acc, part) => {
      const index = part.indexOf("=");
      if (index === -1) {
        return acc;
      }
      const key = part.slice(0, index);
      const value = part.slice(index + 1);
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
}

function setCookie(name: string, value: string, maxAgeSeconds?: number) {
  if (typeof document === "undefined") {
    return;
  }

  const maxAgePart =
    typeof maxAgeSeconds === "number" && Number.isFinite(maxAgeSeconds)
      ? `; max-age=${Math.max(0, Math.floor(maxAgeSeconds))}`
      : "";

  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; SameSite=Lax${maxAgePart}`;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

function decodeBase64Url(value: string): string | null {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return atob(padded);
  } catch {
    return null;
  }
}

export function decodeJwt(token: string): JwtClaims | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  const decoded = decodeBase64Url(parts[1]);
  if (!decoded) {
    return null;
  }

  try {
    return JSON.parse(decoded) as JwtClaims;
  } catch {
    return null;
  }
}

export function extractTokens(payload: TokenResponseLike): {
  token: string | null;
} {
  const token = payload.token ?? payload.accessToken ?? payload.data?.token ?? payload.data?.accessToken ?? null;

  return { token };
}

export function setAuthSession(token: string) {
  const claims = decodeJwt(token);
  const now = Math.floor(Date.now() / 1000);
  const tokenMaxAge = claims?.exp ? Math.max(0, claims.exp - now) : 60 * 60 * 24 * 7;

  setCookie(ACCESS_COOKIE, token, tokenMaxAge);
}

export function clearAuthSession() {
  deleteCookie(ACCESS_COOKIE);
}

export function getAccessTokenFromCookie(): string | null {
  const cookies = parseCookies();
  return cookies[ACCESS_COOKIE] ?? null;
}

export function getCurrentAuthUser() {
  const token = getAccessTokenFromCookie();
  if (!token) {
    return null;
  }

  const claims = decodeJwt(token);
  if (!claims) {
    return null;
  }

  return {
    token,
    role: claims.role ?? null,
    email: claims.email ?? claims.sub ?? null,
    exp: claims.exp ?? null,
  };
}

function normalizeNumericId(value: unknown): string | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return String(Math.trunc(value));
  }
  if (typeof value === "string" && /^\d+$/.test(value.trim())) {
    return value.trim();
  }
  return null;
}

export function getUserIdFromToken(token: string): string | null {
  const claims = decodeJwt(token);
  if (!claims) {
    return null;
  }

  const direct = normalizeNumericId(claims.userId ?? claims.id);
  if (direct) {
    return direct;
  }

  return normalizeNumericId(claims.sub);
}
