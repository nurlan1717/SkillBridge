import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_0%,var(--bg-accent-soft),transparent_45%),var(--bg)] px-5 py-16 md:px-8">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center justify-center rounded-3xl border border-[var(--line)] bg-[var(--surface)] px-6 py-14 text-center shadow-[0_24px_60px_-36px_color-mix(in_oklab,var(--text)_60%,transparent)] md:px-10">
        <p className="reveal text-xs uppercase tracking-[0.18em] text-[var(--muted)]">
          Error 404
        </p>
        <h1 className="reveal delay-1 mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
          Page Not Found
        </h1>
        <p className="reveal delay-2 mt-4 max-w-xl text-sm leading-7 text-[var(--muted)] md:text-base">
          The page you requested does not exist or has been moved.
          Use one of the links below to continue.
        </p>

        <div className="reveal delay-3 mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/"
            className="rounded-full bg-[var(--accent)] px-6 py-3 text-sm font-semibold text-[var(--accent-text)] transition duration-300 hover:-translate-y-0.5 hover:brightness-110"
          >
            Go Home
          </Link>
          <Link
            href="/login"
            className="rounded-full border border-[var(--line)] bg-[var(--bg)] px-6 py-3 text-sm font-semibold transition duration-300 hover:-translate-y-0.5"
          >
            Open Login
          </Link>
        </div>
      </div>
    </main>
  );
}
