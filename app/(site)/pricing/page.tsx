"use client";

import Link from "next/link";
import { CheckCircle, Sparkles, Zap, Shield, Users, Briefcase, ArrowRight, Star, Crown, Rocket } from "lucide-react";
import { useState } from "react";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "forever",
    note: "For students exploring verified skill workflows.",
    points: [
      "Assessment basics",
      "Limited submissions (5/month)",
      "Public wallet",
      "Basic skill badges",
      "Community support"
    ],
    icon: Star,
    color: "from-blue-500/20 to-cyan-500/20",
    borderColor: "border-blue-500/30",
    buttonVariant: "outline",
    featured: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    note: "For active learners and mentors needing deeper tracking.",
    points: [
      "Full assessment flow",
      "Mentor review features",
      "Certificate history",
      "Unlimited submissions",
      "Priority badge verification",
      "AI-powered roadmap",
      "Email support"
    ],
    icon: Crown,
    color: "from-purple-500/20 to-pink-500/20",
    borderColor: "border-purple-500/30",
    buttonVariant: "primary",
    featured: true,
    popular: true,
  },
  {
    name: "Team",
    price: "Custom",
    period: "",
    note: "For universities and employers with cohort-level analytics.",
    points: [
      "Role dashboards",
      "Hiring match tools",
      "Priority support (24/7)",
      "API access",
      "Custom integrations",
      "Analytics & reporting",
      "SLA guarantee"
    ],
    icon: Users,
    color: "from-green-500/20 to-emerald-500/20",
    borderColor: "border-green-500/30",
    buttonVariant: "secondary",
    featured: false,
  },
];

const faqs = [
  {
    question: "Can I switch plans later?",
    answer: "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
  },
  {
    question: "Is there a free trial?",
    answer: "Yes, Pro plan comes with a 14-day free trial. No credit card required.",
  },
  {
    question: "Can I cancel anytime?",
    answer: "Absolutely. You can cancel your subscription at any time with no hidden fees.",
  },
  {
    question: "Do you offer student discounts?",
    answer: "Yes, students get 50% off on Pro plans with valid .edu email verification.",
  },
  {
    question: "What's your refund policy?",
    answer: "30-day money-back guarantee for annual subscriptions.",
  },
];

const comparisonFeatures = [
  "Skill Assessment",
  "Task Submissions",
  "Mentor Verification",
  "Certificate Generation",
  "Job Matching",
  "API Access",
  "Analytics Dashboard",
  "Priority Support",
];

const featureMatrix = {
  Starter: [true, "5/month", true, false, false, false, false, false],
  Pro: [true, "Unlimited", true, true, true, false, true, "Email"],
  Team: [true, "Unlimited", true, true, true, true, true, "24/7"],
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [hoveredTier, setHoveredTier] = useState<string | null>(null);

  const getPrice = (basePrice: string) => {
    if (basePrice === "$0" || basePrice === "Custom") return basePrice;
    if (billingCycle === "yearly") {
      const monthlyPrice = parseInt(basePrice.replace("$", ""));
      const yearlyPrice = monthlyPrice * 12 * 0.8; // 20% discount
      return `$${Math.round(yearlyPrice)}`;
    }
    return basePrice;
  };

  const getPeriod = (basePrice: string) => {
    if (basePrice === "$0" || basePrice === "Custom") return "";
    return billingCycle === "yearly" ? "/year" : "/month";
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pt-20">
      
      {/* Hero Section */}
      <section className="reveal text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--muted)] backdrop-blur-sm">
          <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
          Simple, Transparent Pricing
        </div>
        <h1 className="mt-6 font-display text-5xl font-bold tracking-tight md:text-7xl">
          Choose the plan that
          <br />
          <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
            fits your journey
          </span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-[var(--muted)]">
          Start for free, scale as you grow. No hidden fees, cancel anytime.
        </p>

        {/* Billing Toggle */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <span className={`text-sm transition-colors ${billingCycle === "monthly" ? "text-[var(--text)]" : "text-[var(--muted)]"}`}>
            Monthly
          </span>
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "yearly" : "monthly")}
            className="relative h-8 w-16 rounded-full bg-[var(--surface)] border border-[var(--line)] transition-all duration-300 hover:shadow-md"
          >
            <div
              className={`absolute top-1 h-6 w-6 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-all duration-300 ${
                billingCycle === "yearly" ? "translate-x-9" : "translate-x-1"
              }`}
            />
          </button>
          <span className={`text-sm transition-colors ${billingCycle === "yearly" ? "text-[var(--text)]" : "text-[var(--muted)]"}`}>
            Yearly
            <span className="ml-1.5 rounded-full bg-[var(--accent)]/20 px-2 py-0.5 text-xs text-[var(--accent)]">
              Save 20%
            </span>
          </span>
        </div>
      </section>

      {/* Pricing Tiers */}
      <section className="mt-12 grid gap-8 lg:grid-cols-3">
        {tiers.map((tier, index) => (
          <div
            key={tier.name}
            className={`reveal relative rounded-2xl border-2 transition-all duration-500 hover:-translate-y-3 ${
              tier.featured
                ? "border-[var(--accent)] shadow-2xl scale-105 lg:scale-110"
                : "border-[var(--line)] hover:shadow-xl"
            }`}
            style={{ animationDelay: `${index * 100}ms` }}
            onMouseEnter={() => setHoveredTier(tier.name)}
            onMouseLeave={() => setHoveredTier(null)}
          >
            {tier.popular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-50">
                <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-3 py-1 text-xs font-semibold text-white shadow-lg">
                  <Zap className="h-3 w-3" />
                  Most Popular
                </span>
              </div>
            )}
            
            <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 md:p-8 ${
              tier.featured ? "border-0" : "border border-[var(--line)]"
            }`}>
              {/* Background Decoration */}
              <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${tier.color} blur-3xl transition-all duration-500 ${
                hoveredTier === tier.name ? "scale-150 opacity-100" : "opacity-0"
              }`} />
              
              <div className="relative">
                <div className="mb-4 inline-flex rounded-xl border border-[var(--line)] bg-[var(--bg)] p-2.5">
                  <tier.icon className="h-6 w-6 text-[var(--accent)]" />
                </div>
                
                <h2 className="font-display text-2xl font-bold">{tier.name}</h2>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{getPrice(tier.price)}</span>
                  <span className="text-[var(--muted)]">{getPeriod(tier.price)}</span>
                </div>
                <p className="mt-2 text-sm text-[var(--muted)]">{tier.note}</p>
                
                <ul className="mt-6 space-y-3">
                  {tier.points.map((point) => (
                    <li key={point} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-[var(--accent)]" />
                      <span className="text-[var(--muted)]">{point}</span>
                    </li>
                  ))}
                </ul>
                
                <Link
                  href={tier.price === "$0" ? "/register" : "/checkout"}
                  className={`group mt-8 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 font-semibold transition-all duration-300 hover:scale-105 ${
                    tier.buttonVariant === "primary"
                      ? "bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] text-white shadow-lg hover:shadow-xl"
                      : tier.buttonVariant === "secondary"
                      ? "border-2 border-[var(--line)] bg-[var(--surface)] hover:border-[var(--accent)] hover:bg-[var(--bg)]"
                      : "border-2 border-[var(--line)] bg-[var(--bg)] hover:border-[var(--accent)]"
                  }`}
                >
                  {tier.price === "$0" ? "Get Started" : tier.price === "Custom" ? "Contact Sales" : "Subscribe Now"}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Feature Comparison Table */}
      <section className="reveal mt-20">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Compare Features</h2>
          <p className="mt-3 text-[var(--muted)]">Everything you need to make the right choice</p>
        </div>
        
        <div className="overflow-x-auto rounded-2xl border border-[var(--line)] bg-[var(--surface)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--line)] bg-[var(--bg)]">
                <th className="p-4 text-left font-display text-sm font-semibold">Feature</th>
                {tiers.map((tier) => (
                  <th key={tier.name} className="p-4 text-center font-display text-sm font-semibold">
                    {tier.name}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {comparisonFeatures.map((feature, idx) => (
                <tr key={feature} className={`border-b border-[var(--line)] transition-colors hover:bg-[var(--bg)] ${
                  idx % 2 === 0 ? "bg-[var(--surface)]" : ""
                }`}>
                  <td className="p-4 text-sm font-medium">{feature}</td>
                  {tiers.map((tier) => {
                    const value = featureMatrix[tier.name as keyof typeof featureMatrix]?.[idx];
                    return (
                      <td key={tier.name} className="p-4 text-center text-sm">
                        {typeof value === "boolean" ? (
                          value ? (
                            <CheckCircle className="mx-auto h-5 w-5 text-[var(--accent)]" />
                          ) : (
                            <span className="text-[var(--muted)]">—</span>
                          )
                        ) : (
                          <span className="font-medium text-[var(--accent)]">{value}</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="reveal delay-1 mt-20">
        <div className="mb-10 text-center">
          <h2 className="font-display text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
          <p className="mt-3 text-[var(--muted)]">Got questions? We've got answers</p>
        </div>
        
        <div className="grid gap-4 md:grid-cols-2">
          {faqs.map((faq, idx) => (
            <div
              key={faq.question}
              className="group rounded-2xl border border-[var(--line)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <h3 className="font-display text-lg font-semibold">{faq.question}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--muted)]">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="reveal delay-2 mt-20">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-2)]/10 p-10 md:p-16">
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--accent)]/30 blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-[var(--accent-2)]/30 blur-3xl animate-pulse [animation-delay:1s]" />
          
          <div className="relative text-center">
            <Rocket className="mx-auto mb-4 h-12 w-12 text-[var(--accent)]" />
            <h2 className="font-display text-3xl font-bold md:text-4xl">Ready to get started?</h2>
            <p className="mx-auto mt-3 max-w-2xl text-[var(--muted)]">
              Join thousands of learners and mentors building verified skill profiles
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
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--line)] bg-[var(--bg)] px-8 py-3.5 font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                Contact Sales
              </Link>
            </div>
            <p className="mt-6 text-xs text-[var(--muted)]">No credit card required for free trial</p>
          </div>
        </div>
      </section>
    </div>
  );
}