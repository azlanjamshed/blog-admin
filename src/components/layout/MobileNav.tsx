"use client";

import React from "react";
import { X, LayoutDashboard, FileText, FolderKanban, Tags, LogOut, PenTool } from "lucide-react";
import { AdminTab } from "./AdminSidebar";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../lib/utils";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentTab: AdminTab;
  onSelectTab: (tab: AdminTab) => void;
}

export function MobileNav({ isOpen, onClose, currentTab, onSelectTab }: MobileNavProps) {
  const { user, logout } = useAuth();

  if (!isOpen) return null;

  const navItems = [
    { label: "Overview", tab: "Overview" as AdminTab, icon: LayoutDashboard },
    { label: "Stories & Posts", tab: "Posts" as AdminTab, icon: FileText },
    { label: "Categories", tab: "Categories" as AdminTab, icon: FolderKanban },
    { label: "Tags", tab: "Tags" as AdminTab, icon: Tags },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-xs" onClick={onClose} />

      {/* Drawer */}
      <div className="fixed inset-y-0 left-0 flex w-72 flex-col justify-between bg-zinc-950 p-6 text-zinc-300 shadow-2xl animate-in slide-in-from-left duration-200">
        <div>
          {/* Brand & Close */}
          <div className="flex items-center justify-between pb-6 border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                <PenTool className="h-5 w-5" />
              </div>
              <span className="text-lg font-bold text-white font-serif">Paper Studio</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="mt-6 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.tab;
              return (
                <button
                  key={item.tab}
                  onClick={() => {
                    onSelectTab(item.tab);
                    onClose();
                  }}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all text-left",
                    isActive
                      ? "bg-emerald-600 text-white font-semibold"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User & Logout */}
        <div className="border-t border-zinc-800 pt-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-700 text-xs font-bold text-white">
              {user?.name ? user.name.slice(0, 2).toUpperCase() : "AU"}
            </div>
            <div className="overflow-hidden">
              <p className="truncate text-xs font-semibold text-white">{user?.name || "Author"}</p>
              <p className="truncate text-[10px] text-zinc-400">{user?.email || ""}</p>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              logout();
            }}
            className="flex w-full items-center gap-2 rounded-xl bg-zinc-900 px-3.5 py-2.5 text-xs font-medium text-rose-400 hover:bg-zinc-850"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}
