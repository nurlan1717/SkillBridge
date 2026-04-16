"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "@/app/shared/ThemeToggle";
import { Menu, X, Sparkles, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

const links = [
  { href: "/", label: "Home" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

const dropdownLinks = [
  { href: "/features", label: "Features" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 z-50 w-full transition-all duration-500 ${
          isScrolled
            ? "border-b border-[var(--line)] bg-[color:color-mix(in_oklab,var(--bg)_92%,transparent)] backdrop-blur-xl shadow-2xl"
            : "bg-transparent backdrop-blur-sm"
        }`}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-4 md:px-8">
          {/* Logo */}
          <Link
            href="/"
            className="group relative inline-flex items-center gap-3 transition-all duration-300 hover:scale-105"
            aria-label="Go to home"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-xl border border-[var(--line)] bg-gradient-to-br from-[var(--surface)] to-[var(--bg)] shadow-lg transition-all duration-300 group-hover:shadow-xl group-hover:border-[var(--accent)]/50">
              <Image
                src="/logoskill.jpeg"
                alt="AI Skill Wallet Logo"
                fill
                sizes="40px"
                className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-110"
                priority
              />
            </div>
            <span className="font-display text-lg font-bold tracking-tight bg-gradient-to-r from-[var(--text)] to-[var(--accent)] bg-clip-text text-transparent">
              SkillBridge AI
            </span>
            <Sparkles className="absolute -right-6 top-0 h-4 w-4 text-[var(--accent)] opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:rotate-12" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-3 md:flex">
            <nav className="flex items-center gap-1 rounded-full border border-[var(--line)] bg-[var(--surface)] p-1">
              {links.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-5 py-2.5 text-sm font-medium text-[var(--muted)] transition-all duration-300 hover:text-[var(--text)] group"
                >
                  <span className="relative z-10">{item.label}</span>
                  <span className="absolute inset-x-0 bottom-0 mx-auto h-0.5 w-0 bg-gradient-to-r from-[var(--accent)] to-[var(--accent-2)] transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
              
              {/* Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-1 px-5 py-2.5 text-sm font-medium text-[var(--muted)] transition-all duration-300 hover:text-[var(--text)] group"
                >
                  <span>More</span>
                  <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-300 ${isDropdownOpen ? "rotate-180" : ""}`} />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right animate-fade-in-down rounded-xl border border-[var(--line)] bg-[var(--surface)] p-1 shadow-2xl backdrop-blur-md">
                    {dropdownLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsDropdownOpen(false)}
                        className="block rounded-lg px-4 py-2.5 text-sm text-[var(--muted)] transition-all duration-200 hover:bg-[var(--bg)] hover:text-[var(--text)] hover:translate-x-1"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </nav>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="relative z-50 flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-[var(--surface)] transition-all duration-300 hover:scale-105 md:hidden"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5 transition-transform duration-300 rotate-0" />
            ) : (
              <Menu className="h-5 w-5 transition-transform duration-300" />
            )}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 bg-[var(--bg)]/95 backdrop-blur-xl transition-all duration-500 md:hidden ${
          isMobileMenuOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
        style={{ top: "64px" }}
      >
        <div className="flex flex-col items-center justify-center space-y-6 p-8 pt-12">
          {[...links, ...dropdownLinks].map((item, idx) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="animate-fade-in-up text-xl font-medium text-[var(--text)] transition-all duration-300 hover:text-[var(--accent)] hover:scale-110"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {item.label}
            </Link>
          ))}
          <div className="animate-fade-in-up pt-6" style={{ animationDelay: "300ms" }}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </>
  );
}