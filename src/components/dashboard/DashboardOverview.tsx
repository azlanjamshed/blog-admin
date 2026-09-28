"use client";

import React from "react";
import { Post, DashboardMetrics } from "../../lib/types";
import { MetricsGrid } from "./MetricsGrid";
import { RecentPostsList } from "./RecentPostsList";
import { PenTool, FolderPlus, Tag, Sparkles } from "lucide-react";
import { Button } from "../ui/Button";

interface DashboardOverviewProps {
  posts: Post[];
  metrics: DashboardMetrics;
  onNewPost: () => void;
  onEditPost: (post: Post) => void;
  onSelectTab: (tab: "Overview" | "Posts" | "Categories" | "Tags") => void;
}

export function DashboardOverview({
  posts,
  metrics,
  onNewPost,
  onEditPost,
  onSelectTab,
}: DashboardOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-zinc-950 via-zinc-900 to-emerald-950 p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 border border-emerald-500/30">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Author Studio & Editorial Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight font-serif">
            Welcome to your writing sanctum.
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            Craft thoughtful ideas, organize them into topics, and publish stories directly to your
            readers with instant preview and live metric tracking.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              onClick={onNewPost}
              icon={<PenTool className="h-4 w-4" />}
              className="bg-emerald-500 hover:bg-emerald-600 text-zinc-950 font-bold"
            >
              Write New Story
            </Button>
            <Button
              variant="outline"
              onClick={() => onSelectTab("Categories")}
              className="border-zinc-700 text-zinc-200 hover:bg-zinc-800"
              icon={<FolderPlus className="h-4 w-4" />}
            >
              New Category
            </Button>
          </div>
        </div>

        {/* Ambient decorative circle */}
        <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-emerald-600/20 blur-3xl" />
      </div>

      {/* Metrics */}
      <div className="space-y-3">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Publication Analytics
        </h3>
        <MetricsGrid metrics={metrics} />
      </div>

      {/* Recent Activity & Quick Links */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <RecentPostsList
            posts={posts}
            onEditPost={onEditPost}
            onViewAll={() => onSelectTab("Posts")}
          />
        </div>

        {/* Quick Tools Card */}
        <div className="rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-900 font-serif">Quick Actions</h3>
            <p className="text-xs text-zinc-500 mt-1">Shortcuts to manage your publication structure</p>

            <div className="mt-4 space-y-2.5">
              <button
                onClick={onNewPost}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 text-left hover:border-emerald-600 hover:bg-emerald-50/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    <PenTool className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-800">Draft an Essay</p>
                    <p className="text-[11px] text-zinc-400">Start a blank story</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onSelectTab("Categories")}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 text-left hover:border-purple-600 hover:bg-purple-50/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                    <FolderPlus className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-800">Manage Categories</p>
                    <p className="text-[11px] text-zinc-400">Add or edit publication sections</p>
                  </div>
                </div>
              </button>

              <button
                onClick={() => onSelectTab("Tags")}
                className="flex w-full items-center justify-between rounded-xl border border-zinc-200 p-3 text-left hover:border-rose-600 hover:bg-rose-50/40 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-700 group-hover:bg-rose-600 group-hover:text-white transition-colors">
                    <Tag className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-zinc-800">Organize Tags</p>
                    <p className="text-[11px] text-zinc-400">Add keywords for story discovery</p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-xl bg-zinc-50 p-4 border border-zinc-100 text-xs text-zinc-500">
            <span className="font-semibold text-zinc-700 block mb-0.5">Author Tip:</span>
            Include at least 50 characters in your story body to meet publication guidelines.
          </div>
        </div>
      </div>
    </div>
  );
}
