"use client";

import Link from "next/link";
import { 
  Brain, 
  Users, 
  Wallet, 
  Briefcase, 
  Shield, 
  Zap,
  Award,
  BarChart,
  Clock,
  Lock,
  Globe,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Star
} from "lucide-react";
import { useState } from "react";

const featureCards = [
  {
    title: "AI Skill Assessment",
    description: "Analyze answers, infer level, and produce evidence-backed scores with our advanced machine learning models.",
    icon: Brain,
    color: "from-purple-500/20 to-pink-500/20",
    benefits: ["Real-time analysis", "Personalized feedback", "Adaptive difficulty"],
  },
  {
    title: "Mentor Verification",
    description: "Add human review on top of AI scoring for trusted outcomes and quality assurance.",
    icon: Users,
    color: "from-blue-500/20 to-cyan-500/20",
    benefits: ["Expert validation", "Quality control", "Trusted credentials"],
  },
  {
    title: "Skill Wallet",
    description: "Collect verified progress, badges, and proof in one profile that's portable and secure.",
    icon: Wallet,
    color: "from-green-500/20 to-emerald-500/20",
    benefits: ["Blockchain secured", "Portable credentials", "Shareable profile"],
  },
  {
    title: "Job Matching",
    description: "Map verified skills to job requirements with match score logic and intelligent recommendations.",
    icon: Briefcase,
    color: "from-orange-500/20 to-red-500/20",
    benefits: ["Smart matching", "Role-fit scoring", "Direct hiring"],
  },
];

const additionalFeatures = [
  {
    title: "Real-time Analytics",
    description: "Track your progress with detailed insights and performance metrics",
    icon: BarChart,
  },
  {
    title: "Fast Verification",
    description: "Get your skills verified in under 24 hours with our efficient process",
    icon: Clock,
  },
  {
    title: "Secure Platform",
    description: "Enterprise-grade security with end-to-end encryption",
    icon: Lock,
  },
  {
    title: "Global Recognition",
    description: "Credentials recognized by 500+ partner companies worldwide",
    icon: Globe,
  },
];

const integrations = [
  "LinkedIn", "GitHub", "Slack", "Zoom", "Google Workspace", "Microsoft Teams"
];

export default function FeaturesPage() {
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pt-20">
      
      {/* Hero Section */}
      <section className="reveal relative overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-8 md:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[var(--accent-2)]/20 to-transparent blur-3xl" />
        
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--muted)] backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            Powerful Platform
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold tracking-tight md:text-7xl">
            Everything you need to
            <br />
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
              verify and showcase skills
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            A focused static overview of what SkillBridge AI provides right now.
            Built for learners, mentors, and employers who value verified proof of capability.
          </p>
        </div>
      </section>

      {/* Main Features Grid */}
      <section className="mt-12 grid gap-6 md:grid-cols-2">
        {featureCards.map((feature, index) => (
          <div
            key={feature.title}
            className="reveal group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            style={{ animationDelay: `${index * 100}ms` }}
            onMouseEnter={() => setHoveredFeature(feature.title)}
            onMouseLeave={() => setHoveredFeature(null)}
          >
            <div className={`absolute -right-12 -top-12 h-48 w-48 rounded-full bg-gradient-to-br ${feature.color} blur-3xl transition-all duration-500 ${
              hoveredFeature === feature.title ? "scale-150 opacity-100" : "opacity-0"
            }`} />
            
            <div className="relative p-6 md:p-8">
              <div className="mb-4 inline-flex rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3">
                <feature.icon className="h-7 w-7 text-[var(--accent)]" />
              </div>
              
              <h2 className="font-display text-2xl font-bold">{feature.title}</h2>
              <p className="mt-2 leading-relaxed text-[var(--muted)]">{feature.description}</p>
              
              <div className="mt-4 flex flex-wrap gap-2">
                {feature.benefits.map((benefit) => (
                  <span key={benefit} className="inline-flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--bg)] px-2.5 py-1 text-xs text-[var(--muted)]">
                    <CheckCircle className="h-3 w-3 text-[var(--accent)]" />
                    {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Additional Features */}
      <section className="reveal delay-1 mt-20">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">More Features</h2>
          <p className="mt-3 text-[var(--muted)]">Everything you need to succeed</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {additionalFeatures.map((feature, idx) => (
            <div
              key={feature.title}
              className="group rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="mx-auto mb-3 inline-flex rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 transition-all duration-300 group-hover:scale-110">
                <feature.icon className="h-6 w-6 text-[var(--accent)]" />
              </div>
              <h3 className="font-display text-lg font-bold">{feature.title}</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Integrations Section */}
      <section className="reveal delay-2 mt-20">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Seamless Integrations</h2>
          <p className="mt-3 text-[var(--muted)]">Connect with the tools you already use</p>
        </div>
        <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-8 md:p-12">
          <div className="flex flex-wrap justify-center gap-3">
            {integrations.map((integration, idx) => (
              <span
                key={integration}
                className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2 text-sm font-medium text-[var(--muted)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {integration}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Highlight */}
      <section className="reveal delay-3 mt-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-2)]/10 p-8 md:p-12">
          <div className="relative text-center">
            <Award className="mx-auto mb-4 h-12 w-12 text-[var(--accent)]" />
            <h2 className="font-display text-3xl font-bold md:text-4xl">Why Choose SkillBridge AI?</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl bg-[var(--bg)]/50 p-6 backdrop-blur-sm">
                <Zap className="mx-auto mb-3 h-8 w-8 text-[var(--accent)]" />
                <h3 className="font-semibold">Faster Verification</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">Get verified in under 24 hours</p>
              </div>
              <div className="rounded-2xl bg-[var(--bg)]/50 p-6 backdrop-blur-sm">
                <Shield className="mx-auto mb-3 h-8 w-8 text-[var(--accent)]" />
                <h3 className="font-semibold">Trusted System</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">AI + human verification layers</p>
              </div>
              <div className="rounded-2xl bg-[var(--bg)]/50 p-6 backdrop-blur-sm">
                <Star className="mx-auto mb-3 h-8 w-8 text-[var(--accent)]" />
                <h3 className="font-semibold">Employer Trusted</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">Recognized by 500+ companies</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="reveal delay-4 mt-20">
        <div className="text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to get started?</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--muted)]">
            Join thousands of learners who are building verified skill profiles
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link
              href="/register"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
            >
              Start Free Trial
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--line)] bg-[var(--bg)] px-8 py-3.5 font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}