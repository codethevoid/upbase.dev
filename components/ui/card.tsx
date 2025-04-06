import { cn } from "@/lib/utils";

export const Card = ({ children, className }: { children: React.ReactNode, className?: string }) => {
  return (
    <div className={cn("rounded-lg p-4 border bg-input/10", className)}>
      {children}
    </div>
  );
};