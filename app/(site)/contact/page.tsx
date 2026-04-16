"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageSquare,
  Users,
  Briefcase,
  HelpCircle,
  Sparkles,
  CheckCircle,
  ArrowRight,
  X,
  Globe
} from "lucide-react";

const contactMethods = [
  {
    title: "Email",
    value: "hello@skillbridge.ai",
    subtext: "Response within 24 hours",
    icon: Mail,
    color: "from-blue-500/20 to-cyan-500/20",
    link: "mailto:hello@skillbridge.ai",
  },
  {
    title: "Phone",
    value: "+994 50 000 00 00",
    subtext: "Mon-Fri, 9AM-6PM",
    icon: Phone,
    color: "from-green-500/20 to-emerald-500/20",
    link: "tel:+994500000000",
  },
  {
    title: "Office",
    value: "San Francisco, CA",
    subtext: "94105, United States",
    icon: MapPin,
    color: "from-purple-500/20 to-pink-500/20",
    link: "https://maps.google.com",
  },
  {
    title: "Support Hours",
    value: "24/7",
    subtext: "Emergency support available",
    icon: Clock,
    color: "from-orange-500/20 to-red-500/20",
    link: null,
  },
];

const departments = [
  {
    name: "Sales & Partnerships",
    email: "partners@skillbridge.ai",
    description: "For enterprise solutions and partnership opportunities",
    icon: Briefcase,
  },
  {
    name: "Customer Support",
    email: "support@skillbridge.ai",
    description: "For technical issues and account questions",
    icon: HelpCircle,
  },
  {
    name: "Community",
    email: "community@skillbridge.ai",
    description: "For events, webinars, and community engagement",
    icon: Users,
  },
  {
    name: "General Inquiries",
    email: "hello@skillbridge.ai",
    description: "For any other questions or feedback",
    icon: MessageSquare,
  },
];

const faqs = [
  {
    question: "How quickly do you respond to support tickets?",
    answer: "We typically respond within 24 hours on business days. Premium support customers get priority response within 4 hours.",
  },
  {
    question: "Do you offer enterprise onboarding?",
    answer: "Yes, we provide dedicated onboarding for enterprise customers including training sessions and custom integrations.",
  },
  {
    question: "Can I schedule a demo?",
    answer: "Absolutely! Contact our sales team to schedule a personalized demo of our platform.",
  },
  {
    question: "Is there a community forum?",
    answer: "Yes, we have an active community forum where users share tips, ask questions, and connect with mentors.",
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    department: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [hoveredMethod, setHoveredMethod] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    setFormData({ name: "", email: "", department: "general", message: "" });
    
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-5 pb-20 pt-12 md:px-8 md:pt-20">
      
      {/* Hero Section */}
      <section className="reveal relative overflow-hidden rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-8 md:p-12">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-[var(--accent)]/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-[var(--accent-2)]/20 to-transparent blur-3xl" />
        
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--surface)] px-4 py-1.5 text-xs font-medium uppercase tracking-wider text-[var(--muted)] backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-[var(--accent)]" />
            Get in Touch
          </div>
          <h1 className="mt-6 font-display text-5xl font-bold tracking-tight md:text-7xl">
            We'd love to hear
            <br />
            <span className="bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] bg-clip-text text-transparent">
              from you
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-[var(--muted)]">
            For product support, partnerships, and onboarding, contact the team below.
            We're here to help you succeed.
          </p>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <section className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {contactMethods.map((method, index) => (
          <div
            key={method.title}
            className="reveal group relative overflow-hidden rounded-2xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            style={{ animationDelay: `${index * 100}ms` }}
            onMouseEnter={() => setHoveredMethod(method.title)}
            onMouseLeave={() => setHoveredMethod(null)}
          >
            <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${method.color} blur-3xl transition-all duration-500 ${
              hoveredMethod === method.title ? "scale-150 opacity-100" : "opacity-0"
            }`} />
            
            <div className="relative">
              <div className="mb-4 inline-flex rounded-xl border border-[var(--line)] bg-[var(--bg)] p-3 transition-all duration-300 group-hover:scale-110">
                <method.icon className="h-6 w-6 text-[var(--accent)]" />
              </div>
              
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-[var(--muted)]">
                {method.title}
              </h3>
              
              {method.link ? (
                <Link
                  href={method.link}
                  target={method.title === "Office" ? "_blank" : undefined}
                  className="group/link inline-flex items-center gap-1"
                >
                  <p className="mt-2 text-lg font-bold transition-colors group-hover/link:text-[var(--accent)]">
                    {method.value}
                  </p>
                  <ArrowRight className="mt-2 h-4 w-4 opacity-0 transition-all group-hover/link:translate-x-1 group-hover/link:opacity-100" />
                </Link>
              ) : (
                <p className="mt-2 text-lg font-bold">{method.value}</p>
              )}
              
              <p className="mt-1 text-sm text-[var(--muted)]">{method.subtext}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Contact Form & Departments */}
      <div className="reveal delay-1 mt-12 grid gap-8 lg:grid-cols-2">
        {/* Contact Form */}
        <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold">Send us a message</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Fill out the form below and we'll get back to you as soon as possible.
          </p>
          
          {isSubmitted ? (
            <div className="mt-6 animate-fade-in-up rounded-2xl border border-green-500/30 bg-green-500/10 p-6 text-center">
              <CheckCircle className="mx-auto mb-3 h-12 w-12 text-green-500" />
              <h3 className="font-display text-xl font-bold">Message Sent!</h3>
              <p className="mt-2 text-sm text-[var(--muted)]">
                Thanks for reaching out. We'll respond within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                  placeholder="hello@example.com"
                />
              </div>
              
              <div>
                <label htmlFor="department" className="block text-sm font-medium mb-2">
                  Department
                </label>
                <select
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all"
                >
                  <option value="general">General Inquiry</option>
                  <option value="sales">Sales & Partnerships</option>
                  <option value="support">Technical Support</option>
                  <option value="community">Community</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full rounded-xl border border-[var(--line)] bg-[var(--bg)] px-4 py-3 text-sm text-[var(--text)] placeholder:text-[var(--muted)] focus:border-[var(--accent)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/20 transition-all resize-none"
                  placeholder="Tell us how we can help..."
                />
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] px-6 py-3 font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-white/20 to-transparent transition-transform duration-500 group-hover:translate-x-0" />
              </button>
            </form>
          )}
        </div>

        {/* Departments & Social */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold">Contact Departments</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Reach out directly to the right team
            </p>
            
            <div className="mt-6 space-y-4">
              {departments.map((dept, idx) => (
                <div
                  key={dept.name}
                  className="group flex items-start gap-4 rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-4 transition-all duration-300 hover:-translate-x-1 hover:border-[var(--accent)]/50 hover:shadow-lg"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="rounded-xl bg-[var(--surface)] p-2.5">
                    <dept.icon className="h-5 w-5 text-[var(--accent)]" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{dept.name}</h3>
                    <p className="text-xs text-[var(--muted)]">{dept.description}</p>
                    <Link
                      href={`mailto:${dept.email}`}
                      className="mt-2 inline-flex items-center gap-1 text-sm text-[var(--accent)] transition-all hover:gap-2"
                    >
                      {dept.email}
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Social Media */}
          <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 md:p-8">
            <h2 className="font-display text-2xl font-bold">Follow Us</h2>
            <p className="mt-2 text-sm text-[var(--muted)]">
              Stay connected on social media
            </p>
            
            <div className="mt-6 flex gap-3">
              {[
                { icon: X, href: "https://twitter.com", label: "Twitter", color: "hover:border-sky-500" },
                { icon: Globe, href: "https://skillbridge.ai", label: "Website", color: "hover:border-[var(--accent)]" },
              ].map((social, idx) => (
                <Link
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  className={`group rounded-full border border-[var(--line)] bg-[var(--bg)] p-3 transition-all duration-300 hover:-translate-y-1 ${social.color} hover:shadow-lg`}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <social.icon className="h-5 w-5 text-[var(--muted)] transition-colors duration-300 group-hover:text-[var(--accent)]" />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="reveal delay-2 mt-12">
        <div className="rounded-3xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] p-6 md:p-8">
          <h2 className="font-display text-2xl font-bold">Frequently Asked Questions</h2>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Find quick answers to common questions
          </p>
          
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {faqs.map((faq, idx) => (
              <div
                key={faq.question}
                className="rounded-2xl border border-[var(--line)] bg-[var(--bg)] p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <h3 className="font-semibold">{faq.question}</h3>
                <p className="mt-2 text-sm text-[var(--muted)]">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="reveal delay-3 mt-12">
        <div className="overflow-hidden rounded-3xl border border-[var(--line)] bg-[var(--surface)]">
          <div className="h-64 w-full bg-gradient-to-br from-[var(--accent)]/20 to-[var(--accent-2)]/20 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="mx-auto h-8 w-8 text-[var(--accent)]" />
              <p className="mt-2 text-sm text-[var(--muted)]">Interactive Map Loading</p>
              <p className="text-xs text-[var(--muted)]">San Francisco, CA</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}