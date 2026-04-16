"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  LoaderCircle,
  LogOut,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserCircle2,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { getUserIdFromToken } from "@/lib/auth/session";
import { usersService, type DirectoryUserSkill, type DirectoryUserRole, type ProfileUser } from "@/lib/api/services/users.service";

type RoleProfileConfig = {
  title: string;
  subtitle: string;
  metrics: Array<{ label: string; value: string }>;
  actions: Array<{ label: string; href: string }>;
};

const roleConfigs: Record<DirectoryUserRole, RoleProfileConfig> = {
  STUDENT: {
    title: "Student profile",
    subtitle: "Track your skills, mentor confirmations, and task progress.",
    metrics: [
      { label: "Learning mode", value: "Practice + Verify" },
      { label: "Skill focus", value: "Frontend and Data" },
      { label: "Roadmap", value: "Active" },
    ],
    actions: [
      { label: "Open Dashboard", href: "/dashboard" },
      { label: "Browse Challenges", href: "/features" },
    ],
  },
  USER: {
    title: "User profile",
    subtitle: "Track your skills, mentor confirmations, and task progress.",
    metrics: [
      { label: "Learning mode", value: "Practice + Verify" },
      { label: "Skill focus", value: "General" },
      { label: "Roadmap", value: "Active" },
    ],
    actions: [
      { label: "Open Dashboard", href: "/dashboard" },
      { label: "Browse Challenges", href: "/features" },
    ],
  },
  EMPLOYER: {
    title: "Employer profile",
    subtitle: "Review worker profiles and verified skills for hiring decisions.",
    metrics: [
      { label: "Hiring mode", value: "Evidence-first" },
      { label: "Candidate source", value: "Platform users" },
      { label: "Review flow", value: "AI + Human" },
    ],
    actions: [
      { label: "Open Dashboard", href: "/dashboard" },
      { label: "View Workers", href: "/dashboard" },
    ],
  },
  MENTOR: {
    title: "Mentor profile",
    subtitle: "Handle learner reviews and approve mentor confirmations.",
    metrics: [
      { label: "Review mode", value: "Manual + AI assist" },
      { label: "Feedback style", value: "Actionable" },
      { label: "Queue", value: "Open" },
    ],
    actions: [
      { label: "Open Dashboard", href: "/dashboard" },
      { label: "View Pending Reviews", href: "/dashboard" },
    ],
  },
  ADMIN: {
    title: "Admin profile",
    subtitle: "Manage platform quality, skills, and role permissions.",
    metrics: [
      { label: "Control mode", value: "Global" },
      { label: "Data scope", value: "All users" },
      { label: "Skill governance", value: "Enabled" },
    ],
    actions: [
      { label: "Open Admin Panel", href: "/admin" },
      { label: "Back to Home", href: "/" },
    ],
  },
};

function toRole(value: string | null | undefined): DirectoryUserRole {
  const normalized = (value ?? "").toUpperCase();
  if (normalized === "EMPLOYER") return "EMPLOYER";
  if (normalized === "MENTOR") return "MENTOR";
  if (normalized === "ADMIN") return "ADMIN";
  if (normalized === "USER") return "USER";
  return "STUDENT";
}

function buildFallbackProfile(role: DirectoryUserRole, email: string | null): ProfileUser {
  const name = email?.split("@")[0] || "SkillBridge user";
  return {
    id: "N/A",
    fullName: name,
    email: email ?? "unknown@skillbridge.local",
    phone: null,
    role,
    active: true,
    emailVerified: false,
    createdAt: null,
    updatedAt: null,
    skills: role === "STUDENT" || role === "USER"
      ? [
          {
            id: "fallback-1",
            title: "React",
            description: "Fallback sample skill",
            category: "FRONTEND",
            difficulty: "INTERMEDIATE",
            iconUrl: null,
            active: false,
          },
        ]
      : [],
  };
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [profile, setProfile] = useState<ProfileUser | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadProfileById() {
      if (!isAuthenticated || !user?.token) {
        return;
      }

      const fallbackRole = toRole(user.role);
      const fallback = buildFallbackProfile(fallbackRole, user.email);

      const userId = getUserIdFromToken(user.token);
      if (!userId) {
        if (isMounted) {
          setProfile(fallback);
          setProfileError("User ID not found in token. Static profile loaded.");
        }
        return;
      }

      setIsLoadingProfile(true);
      setProfileError(null);

      try {
        const response = await usersService.byId(user.token, userId);
        if (isMounted) {
          setProfile(response);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Failed to load profile";
          setProfile(fallback);
          setProfileError(`${message}. Static role profile loaded.`);
        }
      } finally {
        if (isMounted) {
          setIsLoadingProfile(false);
        }
      }
    }

    void loadProfileById();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user?.email, user?.role, user?.token]);

  async function handleLogout() {
    setIsLoggingOut(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    logout();
    router.push("/");
    router.refresh();
  }

  const resolvedRole = toRole(profile?.role ?? user?.role ?? null);
  const roleConfig = useMemo(() => roleConfigs[resolvedRole], [resolvedRole]);
  const displaySkills: DirectoryUserSkill[] = profile?.skills ?? [];

  if (!isAuthenticated) {
    return (
      <div className="mx-auto w-full max-w-4xl px-5 pb-20 pt-12 md:px-8 md:pt-20">
        <section className="reveal relative overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-8 text-center md:p-12">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-transparent blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[var(--accent-2)]/20 to-transparent blur-3xl" />
          
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--muted)] backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
              Profile Access
            </div>
            <h1 className="mt-6 font-display text-4xl font-bold tracking-tight md:text-5xl">
              You are not signed in
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-[var(--muted)]">
              Sign in to access your profile, manage your identity, and continue your skill journey.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/login"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Go to Login
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--line)] bg-[var(--bg)] px-6 py-3 font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Create Account
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pt-20">

      <section className="reveal relative overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 md:p-8">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[var(--accent-2)]/20 to-transparent blur-3xl" />

        <div className="relative flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-medium">
              <Sparkles className="h-3 w-3 text-[var(--accent)]" />
              {roleConfig.title}
            </div>
            <h1 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
              <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                {profile?.fullName ?? user?.email?.split("@")[0] ?? "User"}
              </span>
            </h1>
            <p className="mt-2 text-[var(--muted)]">
              {roleConfig.subtitle}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] px-4 py-3 text-sm">
            <p className="text-[var(--muted)]">Role</p>
            <p className="font-semibold">{resolvedRole}</p>
          </div>
        </div>
      </section>

      <section className="reveal delay-2 mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: UserCircle2, label: "User ID", value: String(profile?.id ?? "N/A"), color: "from-blue-500/20" },
          { icon: ShieldCheck, label: "Role", value: resolvedRole, color: "from-purple-500/20" },
          { icon: Mail, label: "Email", value: profile?.email ?? user?.email ?? "No email", color: "from-green-500/20" },
          { icon: Phone, label: "Phone", value: profile?.phone ?? "No phone", color: "from-orange-500/20" },
        ].map((item) => (
          <div
            key={item.label}
            className="group rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${item.color} to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl`} />
            <div className="relative">
              <div className="mb-3 inline-flex rounded-xl border border-[var(--line)] bg-[var(--bg)] p-2.5">
                <item.icon className="h-5 w-5 text-[var(--accent)]" />
              </div>
              <p className="text-xs uppercase tracking-wider text-[var(--muted)]">{item.label}</p>
              <p className="mt-1 break-all font-semibold">{item.value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="reveal delay-3 mt-8">
        <h2 className="font-display text-2xl font-bold">Role Metrics</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          {roleConfig.metrics.map((item) => (
            <article key={item.label} className="rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">{item.label}</p>
              <p className="mt-2 font-display text-2xl font-bold">{item.value}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="reveal delay-4 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold">Role Actions</h2>
        </div>

        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {roleConfig.actions.map((action) => (
            <Link key={action.label} href={action.href} className="group flex items-center justify-between rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-4 transition hover:-translate-y-0.5 hover:shadow-lg">
              <span className="font-medium">{action.label}</span>
              <ArrowRight className="h-4 w-4 text-[var(--muted)] transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      {(resolvedRole === "STUDENT" || resolvedRole === "USER") ? (
        <section className="reveal delay-5 mt-8">
          <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold">Skills</h2>
            <p className="mt-1 text-sm text-[var(--muted)]">Mentor confirmation status from your profile</p>

            {isLoadingProfile ? (
              <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--muted)]">
                <LoaderCircle className="h-4 w-4 animate-spin" />
                Loading profile...
              </div>
            ) : (
              <div className="mt-4 flex flex-wrap gap-2">
                {displaySkills.length > 0 ? (
                  displaySkills.map((skill) => (
                    <span
                      key={String(skill.id)}
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                        skill.active
                          ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-700"
                          : "border border-rose-500/25 bg-rose-500/10 text-rose-700"
                      }`}
                    >
                      {skill.active ? <BadgeCheck className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
                      {skill.title} {skill.active ? "(mentor confirmed)" : "(pending mentor)"}
                    </span>
                  ))
                ) : (
                  <span className="inline-flex rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                    No skills yet
                  </span>
                )}
              </div>
            )}
          </div>
        </section>
      ) : null}

      <section className="reveal delay-6 mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-5">
        <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 md:p-8">
          <p className="text-sm text-[var(--muted)]">
            Account status: {profile?.active ? "Active" : "Inactive"} • Email: {profile?.emailVerified ? "Verified" : "Pending verification"}
          </p>
          <p className="mt-1 text-xs text-[var(--muted)]">
            {profile?.createdAt ? `Created at: ${new Date(profile.createdAt).toLocaleString()}` : "Created date unavailable"}
          </p>
          {profileError ? (
            <p className="mt-2 text-xs text-amber-600">{profileError}</p>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-red-500 to-red-600 px-6 py-2.5 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50"
        >
          {isLoggingOut ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Logout
            </>
          )}
        </button>
      </section>
    </div>
  );
}