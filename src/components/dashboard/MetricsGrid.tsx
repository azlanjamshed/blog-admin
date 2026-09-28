import React from "react";
import { FileText, CheckCircle, Clock, Eye, FolderKanban, Tag } from "lucide-react";
import { DashboardMetrics } from "../../lib/types";
import { formatNumber } from "../../lib/utils";

interface MetricsGridProps {
  metrics: DashboardMetrics;
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  const cards = [
    {
      label: "Total Stories",
      value: formatNumber(metrics.totalPosts),
      subtext: "Written articles",
      icon: FileText,
      color: "text-zinc-900 bg-zinc-100",
    },
    {
      label: "Published",
      value: formatNumber(metrics.publishedPosts),
      subtext: "Live on journal",
      icon: CheckCircle,
      color: "text-emerald-700 bg-emerald-50 border-emerald-100",
    },
    {
      label: "Drafts",
      value: formatNumber(metrics.draftPosts),
      subtext: "In progress",
      icon: Clock,
      color: "text-amber-700 bg-amber-50 border-amber-100",
    },
    {
      label: "Reader Views",
      value: formatNumber(metrics.totalViews),
      subtext: "Total post reads",
      icon: Eye,
      color: "text-sky-700 bg-sky-50 border-sky-100",
    },
    {
      label: "Categories",
      value: formatNumber(metrics.totalCategories),
      subtext: "Topics mapped",
      icon: FolderKanban,
      color: "text-purple-700 bg-purple-50 border-purple-100",
    },
    {
      label: "Active Tags",
      value: formatNumber(metrics.totalTags),
      subtext: "Content keywords",
      icon: Tag,
      color: "text-rose-700 bg-rose-50 border-rose-100",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="flex flex-col justify-between rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-xs transition-all hover:border-zinc-300"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                {card.label}
              </span>
              <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${card.color}`}>
                <Icon className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold tracking-tight text-zinc-900 font-serif">
                {card.value}
              </span>
              <p className="text-[11px] text-zinc-400 mt-0.5">{card.subtext}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
