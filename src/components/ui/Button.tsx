import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "../../lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  icon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant = "primary",
      size = "md",
      loading = false,
      disabled,
      icon,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none rounded-xl";

    const variantStyles = {
      primary:
        "bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm focus:ring-emerald-600 active:bg-emerald-900",
      secondary:
        "bg-zinc-800 hover:bg-zinc-700 text-zinc-100 shadow-sm focus:ring-zinc-500",
      outline:
        "border border-zinc-300 dark:border-zinc-700 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 focus:ring-zinc-400",
      danger:
        "bg-rose-600 hover:bg-rose-700 text-white shadow-sm focus:ring-rose-500 active:bg-rose-800",
      ghost:
        "bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-850 text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white focus:ring-zinc-400",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 rounded-lg",
      md: "text-sm px-4 py-2.5 gap-2 rounded-xl",
      lg: "text-base px-6 py-3 gap-2.5 rounded-xl",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          icon && <span className="shrink-0">{icon}</span>
        )}
        <span>{children}</span>
      </button>
    );
  }
);

Button.displayName = "Button";
