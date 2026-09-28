import React from "react";
import { cn } from "../../lib/utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
}

export function Card({ className, hoverEffect = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs transition-all duration-200",
        hoverEffect ? "hover:border-zinc-300 hover:shadow-md" : "",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  title,
  subtitle,
  action,
}: {
  className?: string;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className={cn("flex items-start justify-between pb-4 mb-4 border-b border-zinc-100", className)}>
      <div>
        <h3 className="text-base font-bold text-zinc-900 tracking-tight">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
