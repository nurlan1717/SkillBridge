"use client";

import Link from "next/link";
import { 
  Target, 
  Eye, 
  Heart, 
  Shield, 
  Award, 
  Users, 
  TrendingUp,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Globe,
  Clock
} from "lucide-react";
import { useState } from "react";
import Image from "next/image";

const teamMembers = [
  {
    name: "Dr. Sarah Chen",
    role: "CEO & Co-founder",
    bio: "Former AI researcher at Google, passionate about skill-based education",
    image: "https://randomuser.me/api/portraits/women/11.jpg",
  },
  {
    name: "Marcus Rodriguez",
    role: "CTO & Co-founder",
    bio: "Ex-Microsoft engineer, building scalable verification systems",
    image: "https://randomuser.me/api/portraits/men/12.jpg",
  },
  {
    name: "Dr. Emily Watson",
    role: "Head of Education",
    bio: "PhD in Learning Sciences, 15+ years in ed-tech",
    image: "https://randomuser.me/api/portraits/women/13.jpg",
  },
  {
    name: "James Kim",
    role: "Product Lead",
    bio: "Former product manager at LinkedIn Learning",
    image: "https://randomuser.me/api/portraits/men/14.jpg",
  },
];

const values = [
  {
    title: "Transparency",
    description: "Every verification step is visible and auditable",
    icon: Eye,
  },
  {
    title: "Trust",
    description: "AI + human verification ensures reliable outcomes",
    icon: Shield,
  },
  {
    title: "Innovation",
    description: "Constantly evolving with latest AI technology",
    icon: Zap,
  },
  {
    title: "Inclusivity",
    description: "Equal opportunity for all learners worldwide",
    icon: Users,
  },
];

const milestones = [
  { year: "2022", title: "Company Founded", description: "Started with a vision to transform skill verification" },
  { year: "2023", title: "Platform Launch", description: "Released beta version to 500+ early users" },
  { year: "2024", title: "AI Integration", description: "Launched advanced AI assessment engine" },
  { year: "2025", title: "Global Expansion", description: "Reached 50,000+ active users worldwide" },
];

const stats = [
  { number: "50K+", label: "Active Users", icon: Users },
  { number: "100K+", label: "Skills Verified", icon: Award },
  { number: "500+", label: "Partner Companies", icon: TrendingUp },
  { number: "98%", label: "Satisfaction Rate", icon: Heart },
];

export default function AboutPage() {
  const [hoveredValue, setHoveredValue] = useState<string | null>(null);

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pt-20">
      
      {/* Hero Section */}
      <section className="reveal relative overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-8 md:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[var(--accent-2)]/20 to-transparent blur-3xl" />
        
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--muted)] backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            Our Story
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold tracking-tight md:text-7xl">
            Building the future of
            <br />
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
              skill verification
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            SkillBridge AI is built around one core belief: outcomes should be verified, not assumed.
            We connect learners, mentors, and employers with a shared skill language.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <div className="reveal delay-1 mt-8 grid gap-6 md:grid-cols-2">
        <div className="group rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl md:p-8">
          <div className="mb-4 inline-flex rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3">
            <Target className="h-6 w-6 text-[var(--accent)]" />
          </div>
          <h2 className="font-display text-2xl font-bold">Our Mission</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            Turn learning activity into trusted proof of capability that can be used in real hiring.
            We're democratizing access to opportunities by focusing on what people can actually do.
          </p>
        </div>

        <div className="group rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl md:p-8">
          <div className="mb-4 inline-flex rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3">
            <Eye className="h-6 w-6 text-[var(--accent)]" />
          </div>
          <h2 className="font-display text-2xl font-bold">Our Vision</h2>
          <p className="mt-3 leading-relaxed text-[var(--muted)]">
            A world where every skill is visible, verifiable, and valued — regardless of background
            or traditional credentials. Where hiring is based on ability, not pedigree.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <section className="reveal delay-2 mt-12">
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

      {/* Values Section */}
      <section className="reveal delay-3 mt-20">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Our Core Values</h2>
          <p className="mt-3 text-[var(--muted)]">The principles that guide everything we do</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {values.map((value, idx) => (
            <div
              key={value.title}
              className="group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ animationDelay: `${idx * 100}ms` }}
              onMouseEnter={() => setHoveredValue(value.title)}
              onMouseLeave={() => setHoveredValue(null)}
            >
              <div className={`absolute inset-0 bg-gradient-to-br from-[var(--accent)]/10 to-transparent transition-opacity duration-300 ${
                hoveredValue === value.title ? "opacity-100" : "opacity-0"
              }`} />
              <div className="relative">
                <value.icon className="mx-auto mb-3 h-10 w-10 text-[var(--accent)]" />
                <h3 className="font-display text-lg font-bold">{value.title}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{value.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Section */}
      <section className="reveal delay-4 mt-20">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Our Journey</h2>
          <p className="mt-3 text-[var(--muted)]">Key milestones along the way</p>
        </div>
        <div className="relative">
          <div className="absolute left-1/2 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-[var(--accent)]/50 to-transparent" />
          <div className="space-y-8">
            {milestones.map((milestone, idx) => (
              <div
                key={milestone.year}
                className={`relative flex items-center gap-8 ${
                  idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                <div className="flex-1 text-right">
                  {idx % 2 === 0 && (
                    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <h3 className="font-display text-xl font-bold text-[var(--accent)]">{milestone.year}</h3>
                      <h4 className="mt-2 font-semibold">{milestone.title}</h4>
                      <p className="mt-1 text-sm text-[var(--muted)]">{milestone.description}</p>
                    </div>
                  )}
                </div>
                <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] shadow-lg">
                  <div className="h-2 w-2 rounded-full bg-white" />
                </div>
                <div className="flex-1">
                  {idx % 2 !== 0 && (
                    <div className="rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <h3 className="font-display text-xl font-bold text-[var(--accent)]">{milestone.year}</h3>
                      <h4 className="mt-2 font-semibold">{milestone.title}</h4>
                      <p className="mt-1 text-sm text-[var(--muted)]">{milestone.description}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="reveal delay-5 mt-20">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Meet the Team</h2>
          <p className="mt-3 text-[var(--muted)]">The people behind SkillBridge AI</p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {teamMembers.map((member, idx) => (
            <div
              key={member.name}
              className="group rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 text-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-[var(--accent)]/20 transition-all duration-300 group-hover:border-[var(--accent)]/50 group-hover:scale-105">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{member.name}</h3>
              <p className="text-sm text-[var(--accent)]">{member.role}</p>
              <p className="mt-2 text-xs text-[var(--muted)]">{member.bio}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="reveal delay-6 mt-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-2)]/10 p-10 text-center md:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/30 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[var(--accent-2)]/30 blur-3xl animate-pulse [animation-delay:1s]" />
          
          <div className="relative">
            <Globe className="mx-auto mb-4 h-12 w-12 text-[var(--accent)]" />
            <h2 className="font-display text-3xl font-bold md:text-4xl">Join Our Mission</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[var(--muted)]">
              Be part of the skill verification revolution. Together, we're building a future
              where talent is recognized everywhere.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                href="/register"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-8 py-3.5 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                Get Started
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--line)] bg-[var(--bg)] px-8 py-3.5 font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}