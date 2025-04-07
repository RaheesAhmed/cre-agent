"use client";

import * as React from "react";
import { Moon, Sun, Building2 } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="inline-flex items-center justify-center rounded-md p-2 transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring relative"
      aria-label="Toggle theme"
    >
      <Building2 className="absolute h-5 w-5 transition-all opacity-30 dark:opacity-0" />
      <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-accent" />
      <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-primary" />
      <span className="sr-only">Toggle theme</span>
    </button>
  );
} 