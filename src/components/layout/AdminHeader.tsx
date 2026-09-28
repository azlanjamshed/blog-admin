"use client";

import React from "react";
import { Menu, Plus, Bell, User as UserIcon } from "lucide-react";
import { Button } from "../ui/Button";
import { AdminTab } from "./AdminSidebar";
import { useAuth } from "../../context/AuthContext";

interface AdminHeaderProps {
  currentTab: AdminTab;
  onOpenMobileNav: () => void;
  onNewPost: () => void;
}

export function AdminHeader({
  currentTab,
  onOpenMobileNav,
  onNewPost,
}: AdminHeaderProps) {
  const { user } = useAuth();

  const titles: Record<AdminTab, { title: string; subtitle: string }> = {
    Overview: {
      title: "Studio Overview",
      subtitle: "Performance metrics and publication highlights.",
    },
    Posts: {
      title: "Stories & Articles",
      subtitle: "Write, edit, and publish your written work.",
    },
    Categories: {
      title: "Content Categories",
      subtitle: "Organize topics for readers to discover.",
    },
    Tags: {
      title: "Tag Cloud",
      subtitle: "Micro-topics and keywords attached to articles.",
    },
  };

  const current = titles[currentTab];

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-zinc-200/80 bg-white/90 px-6 backdrop-blur-md">
      <div className="flex items-center gap-4">
        <button
          onClick={onOpenMobileNav}
          className="rounded-xl border border-zinc-200 p-2 text-zinc-600 hover:bg-zinc-100 lg:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-900 font-serif">
            {current.title}
          </h1>
          <p className="hidden text-xs text-zinc-500 sm:block">{current.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Button
          onClick={onNewPost}
          size="sm"
          icon={<Plus className="h-4 w-4" />}
          className="shadow-sm font-semibold"
        >
          Write Story
        </Button>

        <div className="hidden h-6 w-px bg-zinc-200 sm:block" />

        <div className="hidden items-center gap-2 rounded-full border border-zinc-200 bg-zinc-50 py-1 pl-1.5 pr-3 sm:flex">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
            {user?.name ? user.name[0].toUpperCase() : "A"}
          </div>
          <span className="text-xs font-semibold text-zinc-700">{user?.name || "Author"}</span>
        </div>
      </div>
    </header>
  );
}
