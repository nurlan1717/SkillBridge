"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BadgeCheck, LoaderCircle, Sparkles, XCircle } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { getUserIdFromToken } from "@/lib/auth/session";
import { usersService, type DirectoryUserSkill } from "@/lib/api/services/users.service";
import { fetchSkillTestsBySkillId, generateRoadmapForSkill } from "@/lib/api/services/skill-verification.service";

function normalizeTestsPayload(payload: unknown): string[] {
  if (Array.isArray(payload)) {
    return payload.map((item, index) => {
      if (typeof item === "string") return `${index + 1}. ${item}`;
      return `${index + 1}. ${JSON.stringify(item)}`;
    });
  }

  if (typeof payload === "string") {
    return [payload];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const candidateArray = (record.tests ?? record.data ?? record.items) as unknown;
    if (Array.isArray(candidateArray)) {
      return candidateArray.map((item, index) => {
        if (typeof item === "string") return `${index + 1}. ${item}`;
        return `${index + 1}. ${JSON.stringify(item)}`;
      });
    }

    return [JSON.stringify(payload, null, 2)];
  }

  return [];
}

export default function VerifySkillPage() {
  const { user, isAuthenticated } = useAuth();
  const [querySkillId, setQuerySkillId] = useState<string | null>(null);

  const [userSkills, setUserSkills] = useState<DirectoryUserSkill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string>("");
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);
  const [skillsError, setSkillsError] = useState<string | null>(null);

  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState<string | null>(null);
  const [testItems, setTestItems] = useState<string[]>([]);

  const [isGeneratingRoadmap, setIsGeneratingRoadmap] = useState(false);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);
  const [roadmapText, setRoadmapText] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const params = new URLSearchParams(window.location.search);
    setQuerySkillId(params.get("skillId"));
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadUserSkills() {
      if (!user?.token) {
        return;
      }

      const userId = getUserIdFromToken(user.token);
      if (!userId) {
        if (isMounted) {
          setSkillsError("User ID could not be decoded from JWT.");
        }
        return;
      }

      setIsLoadingSkills(true);
      setSkillsError(null);

      try {
        const profile = await usersService.byId(user.token, userId);
        const skills = profile.skills ?? [];

        if (isMounted) {
          setUserSkills(skills);

          const defaultSkillId = querySkillId && skills.some((item) => String(item.id) === querySkillId)
            ? querySkillId
            : skills[0]
              ? String(skills[0].id)
              : "";

          setSelectedSkillId(defaultSkillId);
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Failed to load user skills";
          setSkillsError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoadingSkills(false);
        }
      }
    }

    void loadUserSkills();

    return () => {
      isMounted = false;
    };
  }, [querySkillId, user?.token]);

  const selectedSkill = useMemo(
    () => userSkills.find((item) => String(item.id) === selectedSkillId) ?? null,
    [selectedSkillId, userSkills],
  );

  async function handleVerifySkill() {
    if (!selectedSkillId || !user?.token) {
      return;
    }

    setIsVerifying(true);
    setVerifyError(null);
    setTestItems([]);

    try {
      const response = await fetchSkillTestsBySkillId(user.token, selectedSkillId);
      const normalized = normalizeTestsPayload(response);
      setTestItems(normalized);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to fetch tests by skill";
      setVerifyError(message);
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleGenerateRoadmap() {
    if (!selectedSkill?.title || !user?.token) {
      return;
    }

    setIsGeneratingRoadmap(true);
    setRoadmapError(null);
    setRoadmapText("");

    try {
      const response = await generateRoadmapForSkill(user.token, selectedSkill.title);
      if (typeof response === "string") {
        setRoadmapText(response);
      } else {
        setRoadmapText(JSON.stringify(response));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate roadmap";
      setRoadmapError(message);
    } finally {
      setIsGeneratingRoadmap(false);
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto w-full max-w-4xl px-5 pb-16 pt-12 md:px-8 md:pt-16">
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
          <h1 className="font-display text-4xl font-bold tracking-tight">Login required</h1>
          <p className="mt-3 text-sm text-[var(--muted)] md:text-base">
            Please login to verify your skills.
          </p>
          <div className="mt-6">
            <Link href="/login" className="rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-text)]">
              Go Login
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pt-16">
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)]">
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </Link>
        <p className="mt-4 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Skill verification</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Verify to skill
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
          Choose your skill, load tests by skill ID, and generate AI roadmap in the same page.
        </p>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">Your skills</h2>

          {isLoadingSkills ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm text-[var(--muted)]">
              <LoaderCircle className="h-4 w-4 animate-spin" />
              Loading skills...
            </div>
          ) : null}

          {skillsError ? (
            <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {skillsError}
            </p>
          ) : null}

          <div className="mt-4 space-y-3">
            {userSkills.map((skill) => {
              const isSelected = String(skill.id) === selectedSkillId;
              return (
                <button
                  key={String(skill.id)}
                  type="button"
                  onClick={() => setSelectedSkillId(String(skill.id))}
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-[var(--accent)] bg-[var(--bg)]"
                      : "border-[var(--line)] bg-[var(--bg)] hover:border-[var(--accent)]"
                  }`}
                >
                  <p className="font-display text-xl font-bold tracking-tight">{skill.title}</p>
                  <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                    {skill.category} • {skill.difficulty}
                  </p>
                  <div className="mt-2 inline-flex items-center gap-1 text-xs font-semibold">
                    {skill.active ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2 py-0.5 text-emerald-700">
                        <BadgeCheck className="h-3.5 w-3.5" />
                        mentor confirmed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/25 bg-rose-500/10 px-2 py-0.5 text-rose-700">
                        <XCircle className="h-3.5 w-3.5" />
                        pending mentor
                      </span>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {!isLoadingSkills && userSkills.length === 0 ? (
            <p className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--muted)]">
              No skills on your profile yet. Add skills from dashboard first.
            </p>
          ) : null}
        </article>

        <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6">
          <h2 className="font-display text-2xl font-bold tracking-tight">Verify and roadmap</h2>
          <p className="mt-1 text-sm text-[var(--muted)]">
            Selected: <span className="font-semibold text-[var(--text)]">{selectedSkill?.title ?? "-"}</span>
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={handleVerifySkill}
              disabled={!selectedSkillId || isVerifying}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-text)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isVerifying ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isVerifying ? "Loading tests..." : "Verify skill"}
            </button>

            <button
              type="button"
              onClick={handleGenerateRoadmap}
              disabled={!selectedSkillId || isGeneratingRoadmap}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-5 py-2.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isGeneratingRoadmap ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
              {isGeneratingRoadmap ? "Generating roadmap..." : "Generate roadmap"}
            </button>
          </div>

          {verifyError ? (
            <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {verifyError}
            </p>
          ) : null}

          {testItems.length > 0 ? (
            <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Tests by skill ID</p>
              <ul className="mt-3 space-y-2 text-sm">
                {testItems.map((item) => (
                  <li key={item} className="rounded-xl border border-[var(--line)] bg-[var(--surface)] px-3 py-2">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {roadmapError ? (
            <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {roadmapError}
            </p>
          ) : null}

          {roadmapText ? (
            <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4">
              <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">AI Roadmap Response</p>
              <pre className="mt-2 whitespace-pre-wrap text-sm text-[var(--text)]">{roadmapText}</pre>
            </div>
          ) : null}
        </article>
      </section>
    </div>
  );
}
