"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, BarChart3, Check, Layers, Plus, RotateCw, Save, Search, Shield, Sparkles, Trash2, TrendingUp, X } from "lucide-react";
import { useAuth } from "@/app/providers/AuthProvider";
import { skillsService } from "@/lib/api/services/skills.service";
import type { Skill } from "@/lib/api/types";

const skillCategories = ["FRONTEND", "BACKEND", "DATA", "SECURITY", "DEVOPS", "DESIGN", "PM"] as const;
const skillLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

const emptySkillForm = {
  title: "",
  category: "FRONTEND" as Skill["category"],
  description: "",
  difficulty: "BEGINNER" as Skill["difficulty"],
  iconUrl: "",
  active: true,
};

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [form, setForm] = useState(emptySkillForm);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

    if (user?.role !== "ADMIN") {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, router, user?.role]);

  useEffect(() => {
    let isMounted = true;

    async function loadSkills() {
      if (user?.role !== "ADMIN") {
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const response = await skillsService.list(user.token);
        if (isMounted) {
          setSkills(response);
          if (response.length > 0) {
            setSelectedSkillId((current) => current ?? String(response[0].id));
          }
        }
      } catch (err) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Failed to load skills";
          setError(message);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    void loadSkills();

    return () => {
      isMounted = false;
    };
  }, [user?.role, user?.token]);

  const filteredSkills = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return skills;
    }

    return skills.filter((skill) => {
      const blob = `${skill.title} ${skill.category} ${skill.difficulty} ${skill.description ?? ""}`.toLowerCase();
      return blob.includes(query);
    });
  }, [search, skills]);

  const selectedSkill = skills.find((skill) => String(skill.id) === selectedSkillId) ?? null;

  useEffect(() => {
    if (!selectedSkill) {
      return;
    }

    setForm({
      title: selectedSkill.title,
      category: selectedSkill.category,
      description: selectedSkill.description ?? "",
      difficulty: selectedSkill.difficulty,
      iconUrl: selectedSkill.iconUrl ?? "",
      active: selectedSkill.isActive,
    });
  }, [selectedSkill]);

  const totalSkills = skills.length;
  const activeSkills = skills.filter((skill) => skill.isActive).length;
  const inactiveSkills = totalSkills - activeSkills;
  const categoryCount = new Set(skills.map((skill) => skill.category)).size;

  async function refreshSkills() {
    setIsLoading(true);
    setError(null);

    try {
      const response = await skillsService.list(user?.token);
      setSkills(response);
      if (response.length > 0 && !response.find((skill) => String(skill.id) === selectedSkillId)) {
        setSelectedSkillId(String(response[0].id));
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to refresh skills";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (user?.role !== "ADMIN") {
      return;
    }

    setIsSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title: form.title.trim(),
      category: form.category,
      description: form.description.trim() || null,
      difficulty: form.difficulty,
      iconUrl: form.iconUrl.trim() || null,
      active: form.active,
    };

    try {
      if (selectedSkill) {
        await skillsService.update(user.token, String(selectedSkill.id), payload);
        setSuccess("Skill updated successfully.");
      } else {
        await skillsService.create(user.token, payload);
        setSuccess("Skill created successfully.");
      }

      await refreshSkills();
      if (!selectedSkill) {
        setForm(emptySkillForm);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to save skill";
      setError(message);
    } finally {
      setIsSaving(false);
    }
  }

  async function handleConfirmDelete() {
    if (!selectedSkill || user?.role !== "ADMIN") {
      return;
    }

    setIsDeleting(true);
    setError(null);
    setSuccess(null);

    try {
      await skillsService.remove(user.token, String(selectedSkill.id));
      setSuccess("Skill deleted successfully.");
      setIsDeleteModalOpen(false);
      setSelectedSkillId(null);
      setForm(emptySkillForm);
      await refreshSkills();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to delete skill";

      // Some backends expose only POST/PUT; in that case fallback to a soft delete.
      if (message.includes("405") || message.toLowerCase().includes("method not allowed")) {
        try {
          await skillsService.update(user.token, String(selectedSkill.id), { active: false });
          setSuccess("Delete endpoint is disabled. Skill was deactivated instead.");
          setIsDeleteModalOpen(false);
          await refreshSkills();
        } catch (fallbackErr) {
          const fallbackMessage = fallbackErr instanceof Error ? fallbackErr.message : "Delete fallback failed";
          setError(fallbackMessage);
        }
      } else {
        setError(message);
      }
    } finally {
      setIsDeleting(false);
    }
  }

  if (!isAuthenticated || user?.role !== "ADMIN") {
    return (
      <div className="mx-auto w-full max-w-4xl px-5 pb-16 pt-12 md:px-8 md:pt-16">
        <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-8 text-center">
          <Shield className="mx-auto h-10 w-10 text-[var(--accent)]" />
          <h1 className="mt-4 font-display text-4xl font-bold tracking-tight">Admin access only</h1>
          <p className="mt-3 text-sm text-[var(--muted)] md:text-base">
            This panel is only available to users with the ADMIN role.
          </p>
        </section>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pt-16">
      <section className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">Admin panel</p>
            <h1 className="mt-2 font-display text-4xl font-bold tracking-tight md:text-5xl">
              Skill controller workspace
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--muted)] md:text-base">
              Manage skills with the same endpoints exposed in the API docs: list, get by id, create, and update.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-700">
            <Sparkles className="h-4 w-4" />
            ADMIN ONLY
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-4">
        <article className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Total skills</p>
          <p className="mt-2 font-display text-3xl font-bold">{totalSkills}</p>
        </article>
        <article className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Active skills</p>
          <p className="mt-2 inline-flex items-center gap-2 font-display text-3xl font-bold text-emerald-700">
            <Check className="h-5 w-5" />
            {activeSkills}
          </p>
        </article>
        <article className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Inactive skills</p>
          <p className="mt-2 inline-flex items-center gap-2 font-display text-3xl font-bold">
            <Layers className="h-5 w-5 text-[var(--accent)]" />
            {inactiveSkills}
          </p>
        </article>
        <article className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-5">
          <p className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">Categories</p>
          <p className="mt-2 inline-flex items-center gap-2 font-display text-3xl font-bold">
            <BarChart3 className="h-5 w-5 text-[var(--accent)]" />
            {categoryCount}
          </p>
          <p className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-700">
            <TrendingUp className="h-3.5 w-3.5" />
            Static analytics preview
          </p>
        </article>
      </section>

      <section className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">Skills list</p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                {isLoading ? "Loading skills..." : `${filteredSkills.length} skills`}
              </h2>
            </div>
            <div className="relative w-full md:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by title, category, level"
                className="w-full rounded-2xl border border-[var(--line)] bg-[var(--bg)] py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[var(--accent)]"
              />
            </div>
          </div>

          {error ? (
            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          ) : null}

          <div className="mt-5 grid gap-3">
            {filteredSkills.map((skill) => (
              <button
                key={String(skill.id)}
                type="button"
                onClick={() => setSelectedSkillId(String(skill.id))}
                className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                  String(skill.id) === selectedSkillId
                    ? "border-[var(--accent)] bg-[var(--bg)] shadow-lg"
                    : "border-[var(--line)] bg-[var(--bg)]"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-display text-lg font-bold tracking-tight">{skill.title}</h3>
                    <p className="mt-1 text-sm text-[var(--muted)]">
                      {skill.category} • {skill.difficulty}
                    </p>
                  </div>
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold ${skill.isActive ? "bg-emerald-500/10 text-emerald-700" : "bg-zinc-500/10 text-zinc-500"}`}>
                    <Check className="h-3.5 w-3.5" />
                    {skill.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--muted)]">
                  {skill.description ?? "No description provided."}
                </p>
              </button>
            ))}
          </div>

          {!isLoading && filteredSkills.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--muted)]">
              No skills found.
            </div>
          ) : null}
        </div>

        <div className="rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 md:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
                {selectedSkill ? "Update skill" : "Create skill"}
              </p>
              <h2 className="mt-2 font-display text-2xl font-bold tracking-tight md:text-3xl">
                {selectedSkill ? selectedSkill.title : "New skill"}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedSkillId(null);
                setForm(emptySkillForm);
              }}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" />
              New
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[var(--muted)]">
                Title
                <input
                  value={form.title}
                  onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                  placeholder="React Developer"
                  required
                />
              </label>

              <label className="grid gap-2 text-sm text-[var(--muted)]">
                Category
                <select
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value as Skill["category"] }))}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                >
                  {skillCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <label className="grid gap-2 text-sm text-[var(--muted)]">
              Description
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="min-h-28 rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                placeholder="What does this skill cover?"
              />
            </label>

            <div className="grid gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-[var(--muted)]">
                Difficulty
                <select
                  value={form.difficulty}
                  onChange={(event) => setForm((current) => ({ ...current, difficulty: event.target.value as Skill["difficulty"] }))}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                >
                  {skillLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </label>

              <label className="grid gap-2 text-sm text-[var(--muted)]">
                Icon URL
                <input
                  value={form.iconUrl}
                  onChange={(event) => setForm((current) => ({ ...current, iconUrl: event.target.value }))}
                  className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
                  placeholder="https://..."
                />
              </label>
            </div>

            <label className="flex items-center gap-3 rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--muted)]">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(event) => setForm((current) => ({ ...current, active: event.target.checked }))}
                className="h-4 w-4 rounded border-[var(--line)]"
              />
              Active skill
            </label>

            {success ? (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
                {success}
              </div>
            ) : null}

            <div className="grid gap-3 md:grid-cols-2">
              <button
                type="submit"
                disabled={isSaving}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-text)] transition hover:brightness-110 disabled:opacity-70"
              >
                {isSaving ? <RotateCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {selectedSkill ? "Update skill" : "Create skill"}
              </button>

              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(true)}
                disabled={!selectedSkill || isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-500/30 bg-red-500/10 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isDeleting ? <RotateCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete skill
              </button>
            </div>
          </form>
        </div>
      </section>

      {isDeleteModalOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4">
          <div className="w-full max-w-md rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs uppercase tracking-[0.14em] text-red-600">Delete confirmation</p>
                <h3 className="mt-2 font-display text-2xl font-bold tracking-tight">Delete this skill?</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-full border border-[var(--line)] p-2 text-[var(--muted)] transition hover:text-[var(--text)]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-700">
              <p className="inline-flex items-center gap-2 font-semibold">
                <AlertTriangle className="h-4 w-4" />
                This action cannot be undone easily.
              </p>
              <p className="mt-2">
                You are deleting: <span className="font-semibold">{selectedSkill?.title ?? "Unknown skill"}</span>
              </p>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteModalOpen(false)}
                className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm font-semibold text-[var(--muted)] transition hover:text-[var(--text)]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-70"
              >
                {isDeleting ? <RotateCw className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Confirm delete
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
