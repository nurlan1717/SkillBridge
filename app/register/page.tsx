import Link from "next/link";
import Image from "next/image";

const onboardingSteps = [
  "Create your account",
  "Complete assessment",
  "Earn verified badge",
  "Get matched to roles",
];

export default function RegisterPage() {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-130px)] w-full max-w-6xl items-center gap-8 px-5 py-8 md:grid-cols-[1fr_1fr] md:px-8 md:py-12">
      <section className="reveal space-y-5 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_24px_60px_-36px_color-mix(in_oklab,var(--text)_65%,transparent)] md:p-8">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] transition duration-300 hover:-translate-y-0.5 hover:text-[var(--text)]"
          >
            ← Back to Home
          </Link>
          <Link
            href="/login"
            className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] underline underline-offset-4 transition hover:text-[var(--text)]"
          >
            Sign in
          </Link>
        </div>

        <div className="inline-flex items-center gap-3">
          <span className="relative h-12 w-12 overflow-hidden border border-[var(--line)] bg-black">
            <Image
              src="/logoskill.jpeg"
              alt=""
              fill
              sizes="48px"
              className="object-contain p-1"
            />
          </span>
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted)]">
              Build your skill identity
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">Join the platform</h1>
          </div>
        </div>

        <p className="max-w-md text-[var(--muted)]">
          Create your profile as student, mentor, or employer and launch your
          verified skill wallet.
        </p>

        <div className="space-y-2.5 pt-2">
          {onboardingSteps.map((step, index) => (
            <div
              key={step}
              className="reveal flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--muted)]"
              style={{ animationDelay: `${120 + index * 90}ms` }}
            >
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-[var(--line)] text-xs text-[var(--text)]">
                {index + 1}
              </span>
              {step}
            </div>
          ))}
        </div>
      </section>

      <section className="reveal delay-1 rounded-3xl border border-[var(--line)] bg-[var(--surface)] p-6 shadow-[0_18px_50px_-28px_color-mix(in_oklab,var(--text)_40%,transparent)] md:p-8">
        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm font-medium transition duration-300 hover:-translate-y-0.5"
          >
            Continue with Google
          </button>
          <button
            type="button"
            className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2 text-sm font-medium transition duration-300 hover:-translate-y-0.5"
          >
            Continue with GitHub
          </button>
        </div>

        <div className="mb-4 flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[var(--muted)]">
          <span className="h-px flex-1 bg-[var(--line)]" />
          Or use email
          <span className="h-px flex-1 bg-[var(--line)]" />
        </div>

        <form className="grid gap-4">
          <div className="space-y-2">
            <label className="text-sm text-[var(--muted)]" htmlFor="fullName">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              placeholder="Alex Carter"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none transition duration-300 focus:-translate-y-0.5 focus:border-[var(--accent)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[var(--muted)]" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none transition duration-300 focus:-translate-y-0.5 focus:border-[var(--accent)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[var(--muted)]" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Minimum 8 characters"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none transition duration-300 focus:-translate-y-0.5 focus:border-[var(--accent)]"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-[var(--muted)]" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none transition duration-300 focus:-translate-y-0.5 focus:border-[var(--accent)]"
              defaultValue="STUDENT"
            >
              <option value="STUDENT">Student</option>
              <option value="MENTOR">Mentor</option>
              <option value="EMPLOYER">Employer</option>
            </select>
          </div>

          <div className="rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-xs text-[var(--muted)]">
            By creating an account, you agree to skill verification terms and
            mentor review policies.
          </div>

          <button
            type="button"
            className="mt-1 w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-[var(--accent-text)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
          >
            Create Account
          </button>
        </form>

        <p className="mt-4 text-sm text-[var(--muted)]">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[var(--text)]">
            Login
          </Link>
        </p>
      </section>
    </div>
  );
}
