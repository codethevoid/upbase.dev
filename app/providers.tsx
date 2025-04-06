"use client";

import { ThemeProvider } from "next-themes";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" disableTransitionOnChange attribute="class">
      {children}
    </ThemeProvider>
  );
};