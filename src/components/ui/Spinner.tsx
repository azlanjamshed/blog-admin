import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export function Spinner({
  className,
  size = "md",
}: {
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizeStyles = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-10 h-10",
  };

  return (
    <Loader2
      className={cn("animate-spin text-emerald-600", sizeStyles[size], className)}
    />
  );
}

export function LoadingScreen({ message = "Loading..." }: { message?: string }) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm font-medium text-zinc-500">{message}</p>
    </div>
  );
}
