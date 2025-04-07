"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";

// Basic type definition for ThemeProvider props
type ThemeProviderProps = {
  children: React.ReactNode;
  [key: string]: any; // Allow any other props to pass through
};

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
} 