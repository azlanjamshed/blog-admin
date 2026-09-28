import React, { SelectHTMLAttributes, forwardRef } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "../../lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
  hint?: string;
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, options, error, hint, placeholder, id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-semibold uppercase tracking-wider text-zinc-600">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              "w-full appearance-none rounded-xl border border-zinc-200 bg-white px-3.5 py-2.5 pr-10 text-sm text-zinc-900 transition-all focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-600/20 disabled:cursor-not-allowed disabled:bg-zinc-50 shadow-xs",
              error ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/20" : "",
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400">
            <ChevronDown className="h-4 w-4" />
          </div>
        </div>
        {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
        {error && <p className="text-xs font-medium text-rose-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = "Select";
