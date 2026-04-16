"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const saved = window.localStorage.getItem("skillbridge-theme");
  if (saved === "light" || saved === "dark") {
    return saved;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.setAttribute("data-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(() => getPreferredTheme());

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  function toggleTheme() {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    window.localStorage.setItem("skillbridge-theme", nextTheme);
  }

  return (
    <button
      onClick={toggleTheme}
      className="h-9 w-9 rounded-full border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_0_3px_color-mix(in_oklab,var(--accent)_18%,transparent)] md:h-10 md:w-10"
      aria-label="Toggle theme"
      title={theme === "dark" ? "Light mode" : "Dark mode"}
      type="button"
    >
      <span className="text-sm md:text-base">{theme === "dark" ? "☀" : "☾"}</span>
    </button>
  );
}
