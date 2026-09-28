import React, { TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "../../lib/utils";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  showCount?: boolean;
  currentCount?: number;
  minCount?: number;
  maxCount?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      label,
      error,
      hint,
      showCount,
      currentCount,
      minCount,
      maxCount,
      id,
      ...props
    },
    ref
  ) => {
    const textareaId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        <div className="flex items-center justify-between">
          {label && (
            <label htmlFor={textareaId} className="block text-xs font-semibold uppercase tracking-wider text-zinc-600">
              {label}
            </label>
          )}
          {showCount && currentCount !== undefined && (
            <span
              className={cn(
                "text-xs font-mono",
                minCount && currentCount < minCount ? "text-amber-600 font-medium" : "text-zinc-400"
              )}
            >
              {currentCount} {minCount ? `/ min ${minCount}` : ""} {maxCount ? `/ max ${maxCount}` : ""} chars
            </span>
          )}
        </div>
        <textarea
          id={textareaId}
          ref={ref}
          className={cn(
            "w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 text-sm text-zinc-900 transition-all placeholder:text-zinc-400 focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-zinc-50 disabled:text-zinc-400 shadow-xs resize-y",
            error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "",
            className
          )}
          {...props}
        />
        {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
