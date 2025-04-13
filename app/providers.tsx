"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider defaultTheme="dark" disableTransitionOnChange attribute="class">
      {children}
      <Toaster richColors closeButton />
    </ThemeProvider>
  );
};
