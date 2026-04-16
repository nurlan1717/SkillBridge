import Link from "next/link";
import Image from "next/image";

const valuePoints = [
  "Verified skill wallet",
  "Mentor-backed validation",
  "Job-ready opportunity matching",
];

export default function LoginPage() {
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
            href="/register"
            className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--muted)] underline underline-offset-4 transition hover:text-[var(--text)]"
          >
            Create account
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
              Access portal
            </p>
            <h1 className="text-4xl font-semibold tracking-tight">Welcome back.</h1>
          </div>
        </div>

        <p className="max-w-md text-[var(--muted)]">
          Sign in to continue your learning journey, verified submissions, and
          skill-to-job pipeline.
        </p>

        <div className="space-y-2.5 pt-2">
          {valuePoints.map((item, index) => (
            <div
              key={item}
              className="reveal flex items-center gap-2 rounded-xl border border-[var(--line)] bg-[var(--bg)] px-3 py-2.5 text-sm text-[var(--muted)]"
              style={{ animationDelay: `${120 + index * 90}ms` }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {item}
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

        <form className="space-y-4">
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
              placeholder="••••••••"
              className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 outline-none transition duration-300 focus:-translate-y-0.5 focus:border-[var(--accent)]"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2 text-[var(--muted)]">
              <input type="checkbox" className="h-4 w-4 rounded border-[var(--line)]" />
              Remember me
            </label>
            <button
              type="button"
              className="text-[var(--muted)] underline underline-offset-4 transition hover:text-[var(--text)]"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="button"
            className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 font-semibold text-[var(--accent-text)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
          >
            Sign In
          </button>
        </form>

        <p className="mt-4 text-sm text-[var(--muted)]">
          New here?{" "}
          <Link href="/register" className="font-semibold text-[var(--text)]">
            Create an account
          </Link>
        </p>
      </section>
    </div>
  );
}
