"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Sparkles,
  Users,
  ShieldCheck,
  Mail,
  Check,
  X,
  Plus,
  LoaderCircle,
} from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { CvAnalyzeSection } from "@/app/shared/CvAnalyzeSection";
import { listUsers, type DirectoryUser } from "@/lib/api/services/users.service";
import { skillsService } from "@/lib/api/services/skills.service";
import type { Skill } from "@/lib/api/types";
import { addSkillToUser } from "@/lib/api/services/user-skills.service";
import { getUserIdFromToken } from "@/lib/auth/session";

function getRoleLabel(role: string | null | undefined) {
  if (role === "STUDENT") return "Student";
  if (role === "EMPLOYER") return "Employer";
  if (role === "MENTOR") return "Mentor";
  if (role === "ADMIN") return "Admin";
  return "Unknown";
}

function getRoleActions(role: string | null | undefined) {
  if (role === "STUDENT") {
    return [
      "Complete your weekly assessment",
      "Upload CV and review AI feedback",
      "Track skill proof progress",
    ];
  }
  if (role === "EMPLOYER") {
    return [
      "Analyze candidate CV with AI",
      "Review shortlist quality metrics",
      "Publish a new role requirement",
    ];
  }
  if (role === "MENTOR") {
    return [
      "Review pending task submissions",
      "Give actionable mentor feedback",
      "Approve verified skill outcomes",
    ];
  }
  return ["Role data not available"];
}

function UserDashboard() {
  const { user } = useAuth();
  const [isSkillPanelOpen, setIsSkillPanelOpen] = useState(false);
  const [allSkills, setAllSkills] = useState<Skill[]>([]);
  const [isSkillsLoading, setIsSkillsLoading] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);
  const [skillsSuccess, setSkillsSuccess] = useState<string | null>(null);
  const [addingSkillId, setAddingSkillId] = useState<string | null>(null);
  const [addedSkillIds, setAddedSkillIds] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadAllSkills() {
      if (!isSkillPanelOpen || !user?.token) {
        return;
      }

      setIsSkillsLoading(true);
      setSkillsError(null);

      try {
        const response = await skillsService.list(user.token);
        if (isMounted) {
          setAllSkills(response);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Failed to load skills";
          setSkillsError(message);
        }
      } finally {
        if (isMounted) {
          setIsSkillsLoading(false);
        }
      }
    }

    void loadAllSkills();

    return () => {
      isMounted = false;
    };
  }, [isSkillPanelOpen, user?.token]);

  async function handleAddSkill(skillId: string) {
    if (addedSkillIds.includes(skillId)) {
      return;
    }

    if (!user?.token) {
      setSkillsError("User token not found. Please login again.");
      return;
    }

    const userId = getUserIdFromToken(user.token);
    if (!userId) {
      setSkillsError("User ID could not be decoded from JWT.");
      return;
    }

    setAddingSkillId(skillId);
    setSkillsError(null);
    setSkillsSuccess(null);

    try {
      await addSkillToUser(userId, skillId, user.token);
      setSkillsSuccess("Skill added to your profile.");
      setAddedSkillIds((current) => (current.includes(skillId) ? current : [...current, skillId]));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to add skill";
      setSkillsError(message);
    } finally {
      setAddingSkillId(null);
    }
  }

  return (
    <>
      <section className="reveal rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">User Dashboard</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Student workspace
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
          Follow your assessment flow, upload CV for AI feedback, and improve your skill proof.
        </p>
      </section>
      <CvAnalyzeSection
        limitMessage="Monthly limit: 5 CV analyses"
        allowedRoles={["STUDENT"]}
        onAnalyzed={() => setIsSkillPanelOpen(true)}
      />

      {isSkillPanelOpen ? (
        <section className="reveal mt-8 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
          <div className="mb-4">
            <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Skill picker</p>
            <h2 className="mt-2 font-display text-3xl font-bold tracking-tight md:text-4xl">
              Choose skills to add
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-[var(--muted)] md:text-base">
              Tap any skill below to add it to your profile using the user-skill endpoint.
            </p>
          </div>

          {skillsError ? (
            <div className="mb-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {skillsError}
            </div>
          ) : null}

          {skillsSuccess ? (
            <div className="mb-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
              {skillsSuccess}
            </div>
          ) : null}

          {isSkillsLoading ? (
            <div className="inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--muted)]">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading skills...
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {allSkills.map((skill) => (
                <button
                  key={String(skill.id)}
                  type="button"
                  onClick={() => handleAddSkill(String(skill.id))}
                  disabled={addingSkillId === String(skill.id) || addedSkillIds.includes(String(skill.id))}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4 text-left transition hover:-translate-y-0.5 hover:border-[var(--accent)] disabled:opacity-70"
                >
                  <p className="font-display text-lg font-bold tracking-tight">{skill.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                    {skill.category} • {skill.difficulty}
                  </p>
                  <div className="mt-3 inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
                    {addingSkillId === String(skill.id) ? (
                      <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                    ) : addedSkillIds.includes(String(skill.id)) ? (
                      <Check className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                    {addingSkillId === String(skill.id)
                      ? "Adding..."
                      : addedSkillIds.includes(String(skill.id))
                        ? "Added"
                        : "Add skill"}
                  </div>
                </button>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </>
  );
}

function EmployerDashboard() {
  const { user } = useAuth();
  const [workers, setWorkers] = useState<DirectoryUser[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadWorkers() {
      if (!user?.token) {
        setWorkers([]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await listUsers(user.token);
        const filteredWorkers = response.filter((item) => item.role === "USER" || item.role === "STUDENT");

        if (isMounted) {
          setWorkers(filteredWorkers);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Failed to load workers";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadWorkers();

    return () => {
      isMounted = false;
    };
  }, [user?.token]);

  const workerCount = useMemo(() => workers.length, [workers]);

  return (
    <>
      <section className="reveal rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
        <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">Employer Dashboard</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Workers page
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
          View only USER and STUDENT profiles from the platform user directory.
        </p>
      </section>

      <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">Workers directory</p>
            <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
              {isLoading ? "Loading workers..." : `${workerCount} workers found`}
            </h2>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        ) : null}

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {workers.map((worker) => (
            <article
              key={String(worker.id)}
              className="rounded-3xl border border-[var(--line)] bg-[var(--bg)] p-5 shadow-[0_18px_40px_-32px_color-mix(in_oklab,var(--text)_40%,transparent)]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-display text-xl font-bold tracking-tight">{worker.fullName}</h3>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-[var(--muted)]">
                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 font-semibold uppercase tracking-[0.12em]">
                      {worker.role}
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 font-semibold text-emerald-600">
                      <Check className="h-3.5 w-3.5" />
                      Active
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 font-semibold tracking-[0.08em]">
                      {worker.emailVerified ? "Email verified" : "Email pending"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                <div className="space-y-3 text-sm text-[var(--muted)]">
                  <p className="inline-flex items-center gap-2">
                    <Mail className="h-4 w-4 text-[var(--accent)]" />
                    {worker.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Skills</p>
                  <p className="mt-1 text-xs text-[var(--muted)]">Active = mentor confirmed</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {worker.skills && worker.skills.length > 0 ? (
                      worker.skills.map((skill) => (
                        <span
                          key={`${worker.email}-${String(skill.id)}`}
                          className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${
                            skill.active
                              ? "border border-emerald-500/25 bg-emerald-500/10 text-emerald-700"
                              : "border border-rose-500/25 bg-rose-500/10 text-rose-700"
                          }`}
                        >
                          {skill.active ? <Check className="h-3.5 w-3.5" /> : <X className="h-3.5 w-3.5" />}
                          {skill.title} {skill.active ? "(confirmed)" : "(pending)"}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--muted)]">
                        No skills yet
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {!isLoading && workers.length === 0 && !error ? (
          <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--muted)]">
            No USER or STUDENT workers found.
          </div>
        ) : null}
      </section>

      <CvAnalyzeSection limitMessage="Daily limit: 5 CV analyses" allowedRoles={["EMPLOYER"]} />
    </>
  );
}

function MentorDashboard() {
  return (
    <section className="reveal rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">Mentor Dashboard</p>
      <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
        Review and verification workspace
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
        Manage pending submissions, provide feedback, and approve verified skill outcomes.
      </p>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <article className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
          <Users className="h-6 w-6 text-[var(--accent)]" />
          <p className="mt-2 text-sm text-[var(--muted)]">Pending reviews</p>
          <p className="font-display text-3xl font-bold">24</p>
        </article>
        <article className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
          <ShieldCheck className="h-6 w-6 text-[var(--accent)]" />
          <p className="mt-2 text-sm text-[var(--muted)]">Approved today</p>
          <p className="font-display text-3xl font-bold">9</p>
        </article>
        <article className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
          <Sparkles className="h-6 w-6 text-[var(--accent)]" />
          <p className="mt-2 text-sm text-[var(--muted)]">Avg review time</p>
          <p className="font-display text-3xl font-bold">18m</p>
        </article>
      </div>
    </section>
  );
}

export default function DashboardPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const displayName = user?.email?.split("@")[0] ?? "there";
  const roleActions = getRoleActions(user?.role);

  useEffect(() => {
    if (user?.role === "ADMIN") {
      router.replace("/admin");
    }
  }, [router, user?.role]);

  if (user?.role === "ADMIN") {
    return null;
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto w-full max-w-4xl px-5 pb-16 pt-12 md:px-8 md:pt-16">
        <section className="reveal rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center md:p-10">
          <h1 className="font-display text-4xl font-bold tracking-tight">Login required</h1>
          <p className="mt-3 text-sm text-[var(--muted)] md:text-base">
            Sign in first to access your role-based dashboard.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <Link href="/login" className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-text)]">
              Go Login
            </Link>
            <Link href="/register" className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-5 py-2.5 text-sm font-semibold">
              Create Account
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pt-16">
      <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
        <Briefcase className="h-3.5 w-3.5" />
        Active role: {getRoleLabel(user?.role)}
      </div>

      <div className="mb-6 rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-4 md:p-5">
        <p className="text-sm text-[var(--muted)]">Welcome back, {displayName}.</p>
        <p className="mt-1 text-sm text-[var(--muted)]">
          Your dashboard is personalized for the {getRoleLabel(user?.role)} role.
        </p>
      </div>

      <section className="mb-8 grid gap-3 md:grid-cols-3">
        {roleActions.map((action) => (
          <article key={action} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4">
            <p className="text-sm text-[var(--muted)]">{action}</p>
          </article>
        ))}
      </section>

      {user?.role === "EMPLOYER" ? <EmployerDashboard /> : null}
      {user?.role === "MENTOR" ? <MentorDashboard /> : null}
      {user?.role === "STUDENT" ? <UserDashboard /> : null}
      {!user?.role ? (
        <section className="reveal rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
          <h1 className="font-display text-3xl font-bold tracking-tight md:text-4xl">Role is not recognized</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
            Your token role could not be mapped to a dashboard. Please contact support or re-login.
          </p>
        </section>
      ) : null}
    </div>
  );
}
