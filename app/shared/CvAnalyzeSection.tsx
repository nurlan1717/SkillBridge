"use client";

import { useState } from "react";
import { FileUp, Sparkles, LoaderCircle } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { analyzeCv } from "@/lib/api/services/cv.service";
import type { UserRole } from "@/lib/api/types";

type CvAnalyzeSectionProps = {
  limitMessage?: string;
  allowedRoles?: UserRole[];
  onAnalyzed?: () => void;
};

export function CvAnalyzeSection({
  limitMessage,
  allowedRoles = ["STUDENT", "EMPLOYER"],
  onAnalyzed,
}: CvAnalyzeSectionProps) {
  const { isAuthenticated, user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState<string>("");

  if (!isAuthenticated || !user?.role || !allowedRoles.includes(user.role)) {
    return null;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file) {
      setError("Please select your CV file first.");
      return;
    }

    setError("");
    setResult("");
    setIsLoading(true);

    try {
      const text = await analyzeCv(file, user?.token);
      setResult(text || "Analysis completed, but response was empty.");
      onAnalyzed?.();
    } catch (err) {
      const message = err instanceof Error ? err.message : "CV analyze failed";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="reveal mt-20 rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 md:p-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            AI CV Analyze
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight md:text-4xl">
            Upload CV and get AI feedback
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
            Send your CV file to the analyze endpoint and receive weaknesses, strengths, and
            improvement suggestions as plain text.
          </p>
          {limitMessage ? (
            <p className="mt-3 inline-flex rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)]">
              {limitMessage}
            </p>
          ) : null}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_auto] md:items-end">
        <label className="block">
          <span className="mb-2 block text-sm text-[var(--muted)]">CV File</span>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm outline-none transition focus:border-[var(--accent)]"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-text)] transition hover:brightness-110 disabled:opacity-70"
        >
          {isLoading ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <FileUp className="h-4 w-4" />}
          {isLoading ? "Analyzing..." : "Analyze CV"}
        </button>
      </form>

      {error ? (
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      ) : null}

      {result ? (
        <div className="mt-5 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4 md:p-5">
          <p className="mb-2 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">AI Response</p>
          <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-[var(--text)]">{result}</pre>
        </div>
      ) : null}
    </section>
  );
}
