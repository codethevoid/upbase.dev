import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export const Card = ({ children, className }: { children: ReactNode; className?: string }) => {
  return <div className={cn("bg-input/10 rounded-lg border p-4", className)}>{children}</div>;
};
