"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { clearAuthSession, decodeJwt, getCurrentAuthUser, setAuthSession } from "@/lib/auth/session";
import type { UserRole } from "@/lib/api/types";

type AuthUser = {
    token: string;
    email: string | null;
    role: UserRole | null;
};

type AuthContextValue = {
    user: AuthUser | null;
    isAuthenticated: boolean;
    setFromToken: (token: string) => void;
    logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function normalizeRole(role: string | null | undefined): UserRole | null {
    if (!role) {
        return null;
    }

    const value = role.toUpperCase();

    if (value === "STUDENT" || value === "USER" || value === "ROLE_USER" || value === "ROLE_STUDENT") {
        return "STUDENT";
    }
    if (value === "EMPLOYER" || value === "ROLE_EMPLOYER") {
        return "EMPLOYER";
    }
    if (value === "MENTOR" || value === "ROLE_MENTOR") {
        return "MENTOR";
    }
    if (value === "ADMIN" || value === "ROLE_ADMIN") {
        return "ADMIN";
    }

    return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthUser | null>(null);

    useEffect(() => {
        const current = getCurrentAuthUser();
        const timer = window.setTimeout(() => {
            if (!current) {
                setUser(null);
                return;
            }

            setUser({
                token: current.token,
                email: current.email,
                role: normalizeRole(current.role),
            });
        }, 0);

        return () => window.clearTimeout(timer);
    }, []);

    const value = useMemo<AuthContextValue>(
        () => ({
            user,
            isAuthenticated: Boolean(user),
            setFromToken: (token: string) => {
                setAuthSession(token);
                const claims = decodeJwt(token);
                setUser({
                    token,
                    email: claims?.email ?? claims?.sub ?? null,
                    role: normalizeRole(claims?.role),
                });
            },
            logout: () => {
                clearAuthSession();
                setUser(null);
            },
        }),
        [user]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
}
