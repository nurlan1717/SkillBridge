import Link from "next/link";
import { ArrowRight, CheckCircle, Sparkles, Zap, Shield, Award, TrendingUp, Users, Clock, Briefcase } from "lucide-react";

const highlights = [
    {
        title: "Skill Verification",
        text: "Challenge completion + mentor approval + evidence-backed badges.",
        icon: Shield,
        color: "from-blue-500/20 to-cyan-500/20",
    },
    {
        title: "AI Guidance",
        text: "Personalized roadmap, skill-gap analysis, and next-step plans.",
        icon: Sparkles,
        color: "from-purple-500/20 to-pink-500/20",
    },
    {
        title: "Job Matching",
        text: "Employer-readable skill wallet with role-fit scoring and shortlists.",
        icon: TrendingUp,
        color: "from-green-500/20 to-emerald-500/20",
    },
];

const workflow = [
    "User onboarding and profile setup",
    "AI diagnostic + capability baseline",
    "Micro-task generation and submission",
    "Mentor review and skill verification",
    "Job-fit score and opportunity matching",
];

const roles = [
    {
        role: "Students",
        value: "Build proof of capability, not just course history.",
        icon: Users,
    },
    {
        role: "Mentors",
        value: "Review task evidence and unlock trusted credentials.",
        icon: Award,
    },
    {
        role: "Employers",
        value: "Filter candidates by verified skill signals.",
        icon: Briefcase,
    },
    {
        role: "Universities",
        value: "Track cohort-level skill gaps and outcomes.",
        icon: TrendingUp,
    },
];

const metrics = [
    { label: "Assessment to Match", value: "< 24h", icon: Clock },
    { label: "Verification Layers", value: "AI + Human", icon: Zap },
    { label: "Skill Wallet Format", value: "Stackable", icon: Shield },
    { label: "Hiring Focus", value: "Evidence-first", icon: CheckCircle },
];

const testimonials = [
    {
        name: "Sarah Johnson",
        role: "Software Engineer",
        content: "This platform changed how I showcase my skills. Got hired within 2 weeks!",
        image: "https://randomuser.me/api/portraits/women/1.jpg",
    },
    {
        name: "Michael Chen",
        role: "Technical Mentor",
        content: "Verifying real skills vs credentials - this is the future of hiring.",
        image: "https://randomuser.me/api/portraits/men/2.jpg",
    },
    {
        name: "Emily Rodriguez",
        role: "HR Director",
        content: "Finally a way to filter candidates by actual ability, not just degrees.",
        image: "https://randomuser.me/api/portraits/women/3.jpg",
    },
];

const stats = [
    { number: "15K+", label: "Active Learners", icon: Users },
    { number: "2.5K+", label: "Verified Skills", icon: CheckCircle },
    { number: "94%", label: "Hire Rate", icon: TrendingUp },
    { number: "500+", label: "Partner Companies", icon: Briefcase },
];

export default function Home() {
    return (
        <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-10 md:px-8 md:pt-14">

            {/* Hero Section */}
            <section className="grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
                <div className="space-y-8">
                    <div className="animate-fade-in-up space-y-6">
                        <p className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--muted)] backdrop-blur-sm">
                            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
                            Verified Skill Infrastructure
                        </p>
                        <h1 className="font-display text-5xl font-bold leading-[1.1] tracking-tight md:text-7xl lg:text-8xl">
                            We don&apos;t certify attendance.
                            <br />
                            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
                                We certify ability.
                            </span>
                        </h1>
                        <p className="max-w-xl text-base leading-relaxed text-[var(--muted)] md:text-lg">
                            The platform connects students, mentors, and employers in one
                            system: assessment, roadmap, challenge-based proof, verification,
                            and job matching.
                        </p>
                    </div>

                    <div className="animate-fade-in-up flex flex-wrap items-center gap-4 [animation-delay:200ms]">
                        <Link
                            href="/register"
                            className="group relative overflow-hidden rounded-full bg-[var(--accent)] px-8 py-3.5 text-sm font-semibold text-[var(--accent-text)] transition-all duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            <span className="relative z-10 flex items-center gap-2">
                                Create Your Profile
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </span>
                            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-0" />
                        </Link>
                        <Link
                            href="/login"
                            className="rounded-full border-2 border-[var(--line)] bg-[var(--surface)] px-8 py-3.5 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:bg-[var(--bg)] hover:shadow-lg"
                        >
                            Sign In
                        </Link>
                    </div>
                </div>

                <div className="animate-fade-in-up relative [animation-delay:100ms]">
                    <div className="relative overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-8 shadow-2xl">
                        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-transparent blur-3xl animate-pulse" />
                        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[var(--accent-2)]/20 to-transparent blur-3xl animate-pulse [animation-delay:1s]" />

                        <div className="relative space-y-6">
                            <h2 className="font-display text-2xl font-bold md:text-3xl">Live Demo Flow</h2>
                            <ol className="space-y-4">
                                {workflow.map((item, index) => (
                                    <li key={item} className="group flex items-start gap-3 rounded-xl p-2 transition-all hover:bg-[var(--bg)]">
                                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--accent)]/20 text-sm font-bold text-[var(--accent)]">
                                            {index + 1}
                                        </span>
                                        <span className="text-[var(--muted)] transition-colors group-hover:text-[var(--text)]">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ol>
                            <div className="rounded-xl border-l-4 border-[var(--accent)] bg-gradient-to-r from-[var(--accent)]/10 to-transparent p-4">
                                <p className="text-sm italic">
                                    &quot;Courses teach. Profiles display. We verify.&quot;
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="animate-fade-in-up mt-20 [animation-delay:300ms]">
                <div className="grid gap-6 md:grid-cols-4">
                    {stats.map((stat, idx) => (
                        <div
                            key={stat.label}
                            className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/0 to-[var(--accent)]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                            <stat.icon className="mx-auto mb-3 h-8 w-8 text-[var(--accent)]" />
                            <div className="relative font-display text-4xl font-bold">{stat.number}</div>
                            <div className="relative mt-1 text-sm text-[var(--muted)]">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Highlights Section */}
            <section className="mt-20">
                <div className="mb-10 text-center">
                    <h2 className="font-display text-3xl font-bold md:text-4xl">Why Choose Us</h2>
                    <p className="mt-3 text-[var(--muted)]">Three pillars that make verification trustworthy</p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {highlights.map((item, idx) => (
                        <article
                            key={item.title}
                            className="group animate-fade-in-up relative overflow-hidden rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className={`absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br ${item.color} blur-2xl transition-all duration-500 group-hover:scale-150`} />
                            <div className="relative">
                                <item.icon className="mb-4 h-10 w-10 text-[var(--accent)]" />
                                <h3 className="font-display text-xl font-bold">{item.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{item.text}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>


            {/* Who It's For & Why Choose It Section */}
            <section className="mt-20 grid gap-8 lg:grid-cols-2">
                <div className="animate-fade-in-up space-y-6">
                    <h2 className="font-display text-3xl font-bold md:text-4xl">Who It&apos;s For</h2>
                    <div className="grid gap-4">
                        {roles.map((item, idx) => (
                            <div
                                key={item.role}
                                className="group flex items-start gap-4 rounded-2xl border border-[var(--line)] bg-gradient-to-r from-[var(--surface)] to-[var(--bg)] p-5 transition-all duration-300 hover:-translate-x-1 hover:shadow-lg"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <item.icon className="h-6 w-6 shrink-0 text-[var(--accent)]" />
                                <div>
                                    <p className="font-display font-bold">{item.role}</p>
                                    <p className="mt-1 text-sm text-[var(--muted)]">{item.value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="animate-fade-in-up space-y-6 [animation-delay:100ms]">
                    <h2 className="font-display text-3xl font-bold md:text-4xl">Why Teams Choose It</h2>
                    <div className="grid grid-cols-2 gap-4">
                        {metrics.map((metric, idx) => (
                            <div
                                key={metric.label}
                                className="group rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-5 text-center transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <metric.icon className="mx-auto mb-2 h-6 w-6 text-[var(--accent)]" />
                                <p className="font-display text-2xl font-bold">{metric.value}</p>
                                <p className="mt-1 text-xs uppercase tracking-wider text-[var(--muted)]">
                                    {metric.label}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="rounded-2xl border border-[var(--line)] bg-gradient-to-r from-[var(--accent)]/5 to-transparent p-5">
                        <p className="text-sm leading-relaxed text-[var(--muted)]">
                            A single flow from skill signal to hiring signal, designed for modern
                            teams that care about outcomes.
                        </p>
                    </div>
                </div>
            </section>


            {/* Testimonials Section */}
            <section className="mt-20">
                <div className="mb-10 text-center">
                    <h2 className="font-display text-3xl font-bold md:text-4xl">Success Stories</h2>
                    <p className="mt-3 text-[var(--muted)]">Trusted by thousands of professionals</p>
                </div>
                <div className="grid gap-6 md:grid-cols-3">
                    {testimonials.map((testimonial, idx) => (
                        <div
                            key={testimonial.name}
                            className="group animate-fade-in-up rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                            style={{ animationDelay: `${idx * 100}ms` }}
                        >
                            <div className="flex items-center gap-4">
                                <img
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-[var(--accent)]/20"
                                />
                                <div>
                                    <p className="font-display font-bold">{testimonial.name}</p>
                                    <p className="text-xs text-[var(--muted)]">{testimonial.role}</p>
                                </div>
                            </div>
                            <p className="mt-4 text-sm leading-relaxed text-[var(--muted)]">
                                &quot;{testimonial.content}&quot;
                            </p>
                            <div className="mt-3 flex gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="mt-20">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-2)]/10 p-10 md:p-16">
                    <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/30 blur-3xl animate-pulse" />
                    <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[var(--accent-2)]/30 blur-3xl animate-pulse [animation-delay:1s]" />

                    <div className="relative text-center">
                        <h2 className="font-display text-3xl font-bold md:text-5xl">Launch Your Skill Wallet</h2>
                        <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
                            Start with assessment, complete verified tasks, and publish a
                            profile that employers can trust in minutes.
                        </p>
                        <div className="mt-8 flex flex-wrap justify-center gap-4">
                            <Link
                                href="/register"
                                className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-8 py-3.5 font-semibold text-[var(--accent-text)] transition-all duration-300 hover:scale-105 hover:shadow-xl"
                            >
                                Get Started
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="/login"
                                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--line)] bg-[var(--bg)] px-8 py-3.5 font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                            >
                                Open Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}