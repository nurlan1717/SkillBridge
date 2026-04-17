"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  BadgeCheck,
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
import { submissionsService } from "@/lib/api/services/submissions.service";
import type { Skill } from "@/lib/api/types";
import toast from "react-hot-toast";
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
  const [isSkillPanelOpen, setIsSkillPanelOpen] = useState(true);
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

      <section className="reveal mt-8 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-5 md:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setIsSkillPanelOpen((current) => !current)}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-5 py-2.5 text-sm font-semibold transition hover:border-[var(--accent)]"
          >
            {isSkillPanelOpen ? "Hide choose skill" : "Choose skill add"}
          </button>

          <Link
            href="/verify-skill"
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-5 py-2.5 text-sm font-semibold text-[var(--accent-text)]"
          >
            Verify to skill
          </Link>
        </div>
        <p className="mt-3 text-sm text-[var(--muted)]">
          This button is always available. You can add or verify skills even if you did not run CV analyze.
        </p>
      </section>

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
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700">
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
                    <Link
                      href={`/verify-skill?skillId=${String(skill.id)}`}
                      className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3 py-1 text-xs font-semibold"
                    >
                      Verify to skill
                    </Link>
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
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [readyToVerify, setReadyToVerify] = useState<Record<string, string>>({});
  const [isActivating, setIsActivating] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadPending() {
      if (!user?.token) return;
      setIsLoading(true);
      setError(null);
      try {
        const response = await submissionsService.pending(user.token);
        if (isMounted) setSubmissions(response || []);
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Failed to load pending submissions";
          setError(message);
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    void loadPending();
    return () => { isMounted = false; };
  }, [user?.token]);

  async function handleReviewSubmit(submissionId: string) {
    if (!user?.token) return;
    setIsSubmitting(true);
    try {
      await submissionsService.mentorReview(user.token, submissionId, {
        id: Number(submissionId) || submissionId,
        feedback: feedback,
        score: score,
      });
      
      const reviewedSub = submissions.find(s => String(s.id) === submissionId);
      
      setSubmissions((prev) => prev.filter((s) => String(s.id) !== submissionId));
      setReviewingId(null);
      
      if (reviewedSub && reviewedSub.userId) {
        setReadyToVerify(prev => ({
          ...prev, 
          [String(reviewedSub.userId)]: reviewedSub.userName || `User ${reviewedSub.userId}`
        }));
      }
      
      toast.success("Review submitted! ✨");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit review";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleActivateSkills(userId: string) {
    if (!user?.token) return;
    setIsActivating(userId);
    try {
      await submissionsService.activateSkills(user.token, userId);
      toast.success("User skills verified and activated successfully! 🎉");
      setReadyToVerify(prev => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to activate skills";
      toast.error(message);
    } finally {
      setIsActivating(null);
    }
  }

  return (
    <>
      <section className="reveal relative overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]/80 backdrop-blur-xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <div className="pointer-events-none absolute -right-20 -top-20 -z-10 h-64 w-64 animate-pulse rounded-full bg-emerald-500/10 blur-3xl" />
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-emerald-500">Mentor Dashboard</p>
        <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
          Review Workspace
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
          Evaluate pending submissions, provide technical feedback, and approve verified skill outcomes.
        </p>
        
        <div className="mt-6 flex gap-4">
          <div className="inline-flex items-center gap-2 rounded-xl bg-[var(--bg)] px-4 py-2 border border-[var(--line)]">
            <Users className="h-4 w-4 text-emerald-500" />
            <span className="text-sm font-semibold">{submissions.length} Pending</span>
          </div>
        </div>
      </section>

      <section className="mt-8 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
        <h2 className="font-display text-2xl font-bold tracking-tight">Pending Submissions</h2>
        
        {isLoading ? (
          <div className="mt-4 inline-flex items-center gap-2 text-sm text-[var(--muted)]">
            <LoaderCircle className="h-4 w-4 animate-spin" /> Loading submissions...
          </div>
        ) : error ? (
          <p className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
            {error}
          </p>
        ) : submissions.length === 0 ? (
          <p className="mt-4 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--muted)]">
            No pending submissions right now. Great job!
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {submissions.map((sub) => (
              <article key={String(sub.id)} className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-5 shadow-sm transition hover:border-[var(--accent)]">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold">{sub.taskTitle || `Task ID: ${sub.taskId}`}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">User ID: {sub.userId} {sub.userName && `• ${sub.userName}`}</p>
                    <p className="mt-1 text-xs text-[var(--muted)]">Submitted: {new Date(sub.submittedAt || Date.now()).toLocaleString()}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 font-semibold text-amber-600 text-xs">
                    Needs Review
                  </span>
                </div>

                <div className="mt-4 rounded-xl bg-[var(--surface)] p-4 border border-[var(--line)] text-sm font-mono whitespace-pre-wrap text-[var(--text)] overflow-hidden text-ellipsis max-h-48 overflow-y-auto">
                  {sub.answer || sub.solutionText || "No answer provided."}
                </div>

                {sub.feedback && (
                  <div className="mt-3 rounded-xl bg-purple-500/5 p-3 text-sm border border-purple-500/10 text-[var(--muted)]">
                    <span className="font-semibold text-purple-600 block mb-1">AI Feedback:</span>
                    {sub.feedback}
                  </div>
                )}

                <div className="mt-4 border-t border-[var(--line)] pt-4">
                  {reviewingId === String(sub.id) ? (
                    <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                      <div>
                        <label className="block text-xs font-semibold text-[var(--muted)] uppercase">Score (0-100)</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={score}
                          onChange={(e) => setScore(Number(e.target.value))}
                          className="mt-1 w-24 rounded-lg border border-[var(--line)] bg-[var(--surface)] px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[var(--muted)] uppercase">Your Feedback</label>
                        <textarea
                          rows={3}
                          value={feedback}
                          onChange={(e) => setFeedback(e.target.value)}
                          placeholder="Provide actionable feedback..."
                          className="mt-1 w-full rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleReviewSubmit(String(sub.id))}
                          disabled={isSubmitting}
                          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-600 disabled:opacity-70 transition"
                        >
                          {isSubmitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                          Submit Review
                        </button>
                        <button
                          onClick={() => setReviewingId(null)}
                          className="px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--text)] transition"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        setReviewingId(String(sub.id));
                        setScore(85);
                        setFeedback("Great job! Consider optimizing your imports.");
                      }}
                      className="inline-flex items-center gap-2 rounded-xl bg-[var(--text)] px-4 py-2 text-xs font-semibold text-[var(--bg)] hover:opacity-90 transition"
                    >
                      Process Submission
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}

        {Object.entries(readyToVerify).length > 0 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 mt-10 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 p-6 shadow-sm">
            <h3 className="font-display text-xl font-bold flex items-center gap-2">
              <BadgeCheck className="h-5 w-5 text-emerald-500" />
              Ready to Activate Skills
            </h3>
            <p className="mt-2 text-sm text-[var(--muted)]">
              You just reviewed submissions for the following users. Click below to bulk-verify and activate their skills on their profiles.
            </p>
            <div className="mt-5 flex flex-wrap gap-4">
              {Object.entries(readyToVerify).map(([uId, uName]) => (
                <button
                  key={uId}
                  onClick={() => handleActivateSkills(uId)}
                  disabled={isActivating === uId}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:hover:scale-100"
                >
                  {isActivating === uId ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4" />
                  )}
                  Verify Skills for {uName}
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
    </>
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
      {user?.role === "STUDENT" || user?.role === "USER" ? <UserDashboard /> : null}
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
