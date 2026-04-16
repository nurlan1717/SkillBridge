"use client";

import Image from "next/image";
import Link from "next/link";
import { 
  Mail, 
  MapPin, 
  Phone,
  ArrowUpRight,
  Heart,
  Shield,
  Award,
  Sparkles,
  X
} from "lucide-react";
import { useState } from "react";

const footerLinks = {
  product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Demo", href: "/demo" },
    { label: "Roadmap", href: "/roadmap" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Blog", href: "/blog" },
    { label: "Press", href: "/press" },
  ],
  resources: [
    { label: "Documentation", href: "/docs" },
    { label: "Help Center", href: "/help" },
    { label: "Community", href: "/community" },
    { label: "Status", href: "/status" },
  ],
  legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const badges = [
  "Skill Evidence",
  "Mentor Verified",
  "Job Ready",
  "AI Guided",
  "Blockchain Secured",
  "Global Recognition",
];

const socialLinks = [
  { icon: X, href: "https://twitter.com", label: "Twitter" },
//   { icon: Linked, href: "https://linkedin.com", label: "LinkedIn" },
//   { icon: Github, href: "https://github.com", label: "GitHub" },
  { icon: Mail, href: "mailto:hello@aiskillwallet.com", label: "Email" },
];

export function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      setEmail("");
    }
  };

  return (
    <footer className="relative mt-20 border-t border-[var(--line)] bg-gradient-to-b from-[var(--surface)] to-[var(--bg)]">
      {/* Background Decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-gradient-to-br from-[var(--accent)]/5 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-gradient-to-tr from-[var(--accent-2)]/5 to-transparent blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-5 py-16 md:px-8 md:py-20">
        {/* Main Footer Content */}
        <div className="grid gap-12 lg:grid-cols-[1.2fr_2fr]">
          {/* Brand Section */}
          <div className="space-y-6 reveal">
            <div className="inline-flex items-center gap-3 group">
              <div className="relative h-12 w-12 overflow-hidden rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:scale-105">
                <Image
                  src="/logoskill.jpeg"
                  alt="AI Skill Wallet"
                  fill
                  sizes="48px"
                  className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <div>
                <p className="font-display text-xl font-bold tracking-tight bg-gradient-to-r from-[var(--text)] to-[var(--accent)] bg-clip-text text-transparent">
                  AI Skill Wallet
                </p>
                <p className="text-xs text-[var(--muted)]">Verified Skill Infrastructure</p>
              </div>
            </div>
            
            <p className="max-w-md text-sm leading-relaxed text-[var(--muted)]">
              We make capability visible, verifiable, and hireable. Join the future of skill-based credentialing.
            </p>

            {/* Contact Info */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <MapPin className="h-4 w-4 text-[var(--accent)]" />
                <span>San Francisco, CA 94105</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-[var(--muted)]">
                <Phone className="h-4 w-4 text-[var(--accent)]" />
                <span>+1 (555) 123-4567</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-2">
              {socialLinks.map((social, idx) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group rounded-full border border-[var(--line)] bg-[var(--surface)] p-2.5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)] hover:shadow-lg"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <social.icon className="h-4 w-4 text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--accent)]" />
                </Link>
              ))}
            </div>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="space-y-4 reveal" style={{ animationDelay: "100ms" }}>
                <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[var(--text)]">
                  {category}
                </h3>
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="group flex items-center gap-1 text-sm text-[var(--muted)] transition-all duration-300 hover:text-[var(--accent)] hover:translate-x-1"
                      >
                        {link.label}
                        <ArrowUpRight className="h-3 w-3 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="reveal mt-12 rounded-2xl border border-[var(--line)] bg-gradient-to-r from-[var(--accent)]/5 to-transparent p-6 md:p-8">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h3 className="font-display text-xl font-bold">Stay Updated</h3>
              <p className="mt-1 text-sm text-[var(--muted)]">
                Get the latest updates on features and opportunities.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="flex-1 rounded-full border border-[var(--line)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
              />
              <button
                type="submit"
                className="group relative overflow-hidden rounded-full bg-[var(--accent)] px-6 py-2.5 text-sm font-semibold text-[var(--accent-text)] transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <span className="relative z-10">Subscribe</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-0" />
              </button>
            </form>
          </div>
          {isSubmitted && (
            <div className="mt-4 animate-fade-in-up text-center text-sm text-green-500">
              ✓ Thanks for subscribing!
            </div>
          )}
        </div>

        {/* Badges Row */}
        <div className="reveal delay-1 mt-12 flex flex-wrap justify-center gap-2">
          {badges.map((item, idx) => (
            <span
              key={item}
              className="group flex cursor-default items-center gap-1.5 rounded-full border border-[var(--line)] bg-[var(--surface)] px-3.5 py-1.5 text-xs font-medium text-[var(--muted)] transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]/50 hover:bg-[var(--bg)] hover:text-[var(--accent)]"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {item === "Skill Evidence" && <Shield className="h-3 w-3" />}
              {item === "Mentor Verified" && <Award className="h-3 w-3" />}
              {item === "AI Guided" && <Sparkles className="h-3 w-3" />}
              <span>{item}</span>
            </span>
          ))}
        </div>

        {/* Copyright */}
        <div className="reveal delay-2 mt-12 flex flex-col items-center justify-between gap-4 border-t border-[var(--line)] pt-8 text-center md:flex-row">
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} AI Skill Wallet. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-[var(--muted)]">
            Made with <Heart className="h-3 w-3 text-red-500 animate-pulse" /> for the future of work
          </p>
        </div>
      </div>
    </footer>
  );
}