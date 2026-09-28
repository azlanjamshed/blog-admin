"use client";

import React from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  FileText,
  FolderKanban,
  Tags,
  LogOut,
  PenTool,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

export type AdminTab = "Overview" | "Posts" | "Categories" | "Tags";

interface AdminSidebarProps {
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
  className?: string;
}

export function AdminSidebar({ currentTab, onSelectTab, className }: AdminSidebarProps) {
  const { user, logout } = useAuth();

  const navItems = [
    { label: "Overview", tab: "Overview" as AdminTab, icon: LayoutDashboard },
    { label: "Stories & Posts", tab: "Posts" as AdminTab, icon: FileText },
    { label: "Categories", tab: "Categories" as AdminTab, icon: FolderKanban },
    { label: "Tags", tab: "Tags" as AdminTab, icon: Tags },
  ];

  return (
    <aside
      className={cn(
        "flex h-screen w-64 flex-col justify-between border-r border-zinc-200/80 bg-zinc-950 px-4 py-6 text-zinc-300",
        className
      )}
    >
      <div className="space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-3 px-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-md shadow-emerald-950/40">
            <PenTool className="h-5 w-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white font-serif">
              Paper<span className="text-emerald-400">.</span>
            </span>
            <span className="ml-1.5 rounded-sm bg-zinc-800 px-1.5 py-0.5 text-[10px] font-semibold tracking-wider text-emerald-400 uppercase">
              Author
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.tab;
            return (
              <button
                key={item.tab}
                onClick={() => onSelectTab(item.tab)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-150 text-left",
                  isActive
                    ? "bg-emerald-600 text-white font-semibold shadow-xs"
                    : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                )}
              >
                <Icon className={cn("h-4 w-4 shrink-0", isActive ? "text-white" : "text-zinc-400")} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer / Profile */}
      <div className="space-y-3 border-t border-zinc-800/80 pt-4">
        {/* Reader blog external link */}
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200 transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="h-3.5 w-3.5 text-emerald-400" />
            View Live Journal
          </span>
          <span className="text-[10px] bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-400">3000</span>
        </a>

        {/* Author Card & Logout */}
        <div className="flex items-center justify-between rounded-xl bg-zinc-900/90 p-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-700/60 font-bold text-xs text-emerald-200 border border-emerald-500/30">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "AU"}
            </div>
            <div className="min-w-0 flex-1 truncate">
              <p className="truncate text-xs font-semibold text-zinc-200 leading-tight">
                {user?.name || "Author"}
              </p>
              <p className="truncate text-[10px] text-zinc-400">{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-rose-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
