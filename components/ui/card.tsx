import { cn } from "@/lib/utils";

export const Card = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn("bg-input/10 rounded-lg border p-4", className)}>{children}</div>;
};
