import React from "react";
import { cn } from "../../lib/utils";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "info" | "neutral" | "danger";
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className,
}: BadgeProps) {
  const variantStyles = {
    success: "bg-emerald-50 text-emerald-700 border-emerald-200/60 ring-emerald-600/10",
    warning: "bg-amber-50 text-amber-700 border-amber-200/60 ring-amber-600/10",
    info: "bg-sky-50 text-sky-700 border-sky-200/60 ring-sky-600/10",
    neutral: "bg-zinc-100 text-zinc-700 border-zinc-200/70 ring-zinc-500/10",
    danger: "bg-rose-50 text-rose-700 border-rose-200/60 ring-rose-600/10",
  };

  const sizeStyles = {
    sm: "px-2.5 py-0.5 text-xs font-medium",
    md: "px-3 py-1 text-xs font-semibold",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border ring-1 ring-inset",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
    >
      <span
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          variant === "success"
            ? "bg-emerald-500"
            : variant === "warning"
            ? "bg-amber-500"
            : variant === "info"
            ? "bg-sky-500"
            : variant === "danger"
            ? "bg-rose-500"
            : "bg-zinc-400"
        )}
      />
      {children}
    </span>
  );
}
