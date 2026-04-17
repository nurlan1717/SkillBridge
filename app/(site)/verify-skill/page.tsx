"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, BadgeCheck, LoaderCircle, Sparkles, XCircle } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { getUserIdFromToken } from "@/lib/auth/session";
import { usersService, type DirectoryUserSkill } from "@/lib/api/services/users.service";
import { tasksService } from "@/lib/api/services/tasks.service";
import { submissionsService } from "@/lib/api/services/submissions.service";
import type { GeneratedTask } from "@/lib/api/types";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";

function TypewriterText({ text, speed = 15 }: { text: string; speed?: number }) {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.substring(0, i + 1));
      i++;
      if (i >= text.length) clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <>
      {displayedText}
      {displayedText.length < text.length && <span className="animate-pulse">|</span>}
    </>
  );
}

function normalizeGeneratedTasksPayload(payload: unknown): GeneratedTask[] {
  if (Array.isArray(payload)) {
    return payload as GeneratedTask[];
  }

  if (payload && typeof payload === "object") {
    const record = payload as Record<string, unknown>;
    const candidateArray = (record.tasks ?? record.data ?? record.items) as unknown;
    if (Array.isArray(candidateArray)) {
      return candidateArray as GeneratedTask[];
    }
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
  const [generatedTasks, setGeneratedTasks] = useState<GeneratedTask[]>([]);

  // Submission state
  const [solutionTexts, setSolutionTexts] = useState<Record<string, string>>({});
  const [submittingTasks, setSubmittingTasks] = useState<Record<string, boolean>>({});
  const [submittedTasks, setSubmittedTasks] = useState<Record<string, boolean>>({});
  const [submissionErrors, setSubmissionErrors] = useState<Record<string, string>>({});

  const [isRequestingAI, setIsRequestingAI] = useState(false);
  const [aiReviewError, setAiReviewError] = useState<string | null>(null);
  const [aiReviewSuccess, setAiReviewSuccess] = useState(false);

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
    setGeneratedTasks([]);
    setSolutionTexts({});
    setSubmittingTasks({});
    setSubmittedTasks({});
    setSubmissionErrors({});
    setAiReviewError(null);
    setAiReviewSuccess(false);

    try {
      const response = await tasksService.generate(user.token, selectedSkillId);
      const normalized = normalizeGeneratedTasksPayload(response);
      setGeneratedTasks(normalized);

      // Pre-fill existing submissions if present
      const currentUserId = getUserIdFromToken(user.token);
      if (currentUserId) {
        try {
          const pastSubmissions = await submissionsService.byUser(user.token, currentUserId);
          const initialSolutions: Record<string, string> = {};
          const preSubmitted: Record<string, boolean> = {};

          pastSubmissions.forEach(sub => {
            if (sub.taskId) {
              initialSolutions[String(sub.taskId)] = sub.answer || "";
              preSubmitted[String(sub.taskId)] = true;
            }
          });

          setSolutionTexts(initialSolutions);
          setSubmittedTasks(preSubmitted);
        } catch (err) {
          console.error("Could not load past submissions", err);
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to generate tasks";
      setVerifyError(message);
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleSubmitSolution(taskId: string) {
    if (!user?.token) return;
    const text = solutionTexts[taskId] || "";
    if (!text.trim()) {
      toast.error("Solution cannot be empty");
      setSubmissionErrors((prev) => ({ ...prev, [taskId]: "Solution cannot be empty" }));
      return;
    }

    setSubmittingTasks((prev) => ({ ...prev, [taskId]: true }));
    setSubmissionErrors((prev) => ({ ...prev, [taskId]: "" }));
    
    try {
      const currentUserId = getUserIdFromToken(user.token);
      if (!currentUserId) throw new Error("Could not retrieve your user ID.");
      await submissionsService.create(user.token, {
        taskId: Number(taskId) || taskId,
        userId: Number(currentUserId) || currentUserId,
        answer: text,
        feedback: "Pending AI Review",
        score: 0,
        status: "PENDING",
      });
      setSubmittedTasks((prev) => ({ ...prev, [taskId]: true }));
      toast.success("Solution submitted successfully!");
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ["#6366f1", "#a855f7", "#ec4899", "#2dd4bf"],
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit solution";
      setSubmissionErrors((prev) => ({ ...prev, [taskId]: message }));
      toast.error(message);
    } finally {
      setSubmittingTasks((prev) => ({ ...prev, [taskId]: false }));
    }
  }

  async function handleRequestAIReview() {
    if (!user?.token) return;
    const userId = getUserIdFromToken(user.token);
    if (!userId) {
      const errMs = "Could not retrieve your user ID.";
      setAiReviewError(errMs);
      toast.error(errMs);
      return;
    }

    setIsRequestingAI(true);
    setAiReviewError(null);
    setAiReviewSuccess(false);

    try {
      await submissionsService.aiReview(user.token, userId);
      setAiReviewSuccess(true);
      toast.success("AI review requested magically! ✨");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to request AI review";
      setAiReviewError(message);
      toast.error(message);
    } finally {
      setIsRequestingAI(false);
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
    <div className="relative isolate mx-auto w-full max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pt-16 overflow-hidden">
      {/* Ambient background glow for 'wow' effect */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/4 animate-pulse rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/10 blur-3xl" />
      
      <section className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="relative z-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm text-[var(--muted)] hover:text-[var(--text)] transition">
            <ArrowLeft className="h-4 w-4" />
            Back to dashboard
          </Link>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.14em] text-purple-500">Skill verification</p>
          <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
            Generate AI tasks
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
            Choose your skill, generate AI tasks from the skill ID, and magically verify your expertise with automated reviews.
          </p>
        </div>
      </section>

      <section className="relative z-10 mt-8 grid gap-6 lg:grid-cols-[1fr_2fr]">
        <article className="rounded-3xl border border-[var(--line)] bg-[var(--surface)]/80 backdrop-blur-md p-6 h-fit sticky top-6 shadow-sm">
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
          <h2 className="font-display text-2xl font-bold tracking-tight">Generate tasks</h2>
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
              {isVerifying ? "Generating tasks..." : "Generate tasks"}
            </button>
          </div>

          {verifyError ? (
            <p className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {verifyError}
            </p>
          ) : null}

          {generatedTasks.length > 0 ? (
            <>
              <div className="mt-4 space-y-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">Generated tasks</p>
                {generatedTasks.map((task, index) => (
                  <article 
                    key={String(task.id)} 
                    className="reveal rounded-2xl border border-[var(--line)] bg-[var(--bg)]/90 backdrop-blur-lg p-6 shadow-sm ring-1 ring-white/5 transition hover:shadow-md"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h3 className="font-display text-xl font-bold tracking-tight text-[var(--text)] bg-gradient-to-r from-[var(--text)] to-[var(--muted)] bg-clip-text">{task.title}</h3>
                        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--muted)] font-medium">
                          {task.skillTitle} • {task.difficulty} • {task.durationMinutes} min
                        </p>
                      </div>
                      <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/25 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-600 shadow-[0_0_15px_-3px_var(--tw-shadow-color)] shadow-purple-500/20">
                        <Sparkles className="h-3 w-3" />
                        {task.aiGenerated ? "AI generated" : "Manual"}
                      </span>
                    </div>

                    <div className="mt-5 rounded-xl bg-[var(--surface)]/50 p-4 border border-[var(--line)]">
                      <p className="text-sm leading-7 text-[var(--muted)]">
                        <TypewriterText text={task.description} speed={10} />
                      </p>
                    </div>

                    <div className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--surface)] p-4 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-1 bg-purple-500 h-full rounded-l-xl"></div>
                      <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)] font-semibold ml-2">Expected output</p>
                      <p className="mt-2 text-sm leading-7 text-[var(--text)] ml-2 bg-black/5 dark:bg-white/5 p-3 rounded-lg font-mono text-xs">
                        <TypewriterText text={task.expectedOutput} speed={25} />
                      </p>
                    </div>

                    <div className="mt-6 border-t border-[var(--line)] pt-4">
                      <h4 className="text-sm font-semibold tracking-tight">Your Solution</h4>
                      <textarea
                        placeholder="Write your solution here..."
                        className="mt-2 w-full min-h-[120px] rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 text-sm focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                        value={solutionTexts[String(task.id)] || ""}
                        onChange={(e) => setSolutionTexts((prev) => ({ ...prev, [String(task.id)]: e.target.value }))}
                        disabled={submittedTasks[String(task.id)]}
                      />
                      
                      {submissionErrors[String(task.id)] && (
                        <p className="mt-2 text-xs text-red-600">{submissionErrors[String(task.id)]}</p>
                      )}

                      <div className="mt-3 flex justify-between items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setSolutionTexts((prev) => ({ 
                              ...prev, 
                              [String(task.id)]: `// Auto-generated solution for ${task.title}\n\nfunction solve() {\n  console.log("Magic completion for demo purposes!");\n  // ...implementation logic...\n}\n` 
                            }));
                            toast("Magic implementation applied! ✨", { icon: "🪄" });
                          }}
                          disabled={submittedTasks[String(task.id)]}
                          className="inline-flex items-center gap-1.5 rounded-xl bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-600 hover:bg-purple-500/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Sparkles className="h-3.5 w-3.5" />
                          Auto-Solve Demo
                        </button>

                        <button
                          type="button"
                          onClick={() => handleSubmitSolution(String(task.id))}
                          disabled={submittingTasks[String(task.id)] || submittedTasks[String(task.id)] || !solutionTexts[String(task.id)]}
                          className="inline-flex items-center gap-2 rounded-xl bg-[var(--text)] px-4 py-2 text-xs font-semibold text-[var(--bg)] disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                          {submittingTasks[String(task.id)] ? (
                            <>
                              <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                              Submitting...
                            </>
                          ) : submittedTasks[String(task.id)] ? (
                            <>
                              <BadgeCheck className="h-3.5 w-3.5" />
                              Submitted
                            </>
                          ) : (
                            "Submit Solution"
                          )}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              
              <div className="mt-8 relative overflow-hidden rounded-3xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-blue-500/5 p-6 shadow-sm">
                <div className="absolute -top-24 -right-24 h-48 w-48 rounded-full bg-purple-500/10 blur-3xl pointer-events-none"></div>
                <h3 className="font-display text-xl font-bold tracking-tight">Ready for AI Review?</h3>
                <p className="mt-1 text-sm text-[var(--muted)] relative z-10 max-w-xl">
                  Once you have submitted your solutions, you can request an AI review to get instant technical feedback and code analysis.
                </p>
                
                <div className="mt-5 relative z-10">
                  <button
                    type="button"
                    onClick={handleRequestAIReview}
                    disabled={isRequestingAI}
                    className="inline-flex overflow-hidden relative group items-center gap-2 rounded-full bg-black text-white dark:bg-white dark:text-black px-6 py-3 text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(0,0,0,0.3)] dark:shadow-[0_0_20px_-5px_rgba(255,255,255,0.3)]"
                  >
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></span>
                    {isRequestingAI ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                    {isRequestingAI ? "Analyzing..." : "Request AI Review for my submissions"}
                  </button>
                </div>

                {aiReviewError && (
                  <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600 relative z-10">
                    {aiReviewError}
                  </p>
                )}
                
                {aiReviewSuccess && (
                  <p className="mt-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-600 relative z-10 font-medium">
                    <BadgeCheck className="inline-block mr-2 h-4 w-4 -mt-0.5" />
                    AI review requested successfully! The AI will analyze your pending submissions shortly.
                  </p>
                )}
              </div>
            </>
          ) : null}
        </article>
      </section>
    </div>
  );
}
