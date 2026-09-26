"use client";

import Link from "next/link";
import { Bell, Menu, Plus, Search, Sparkles } from "lucide-react";

type DashboardHeaderProps = {
  onMenuClick: () => void;
};

export function DashboardHeader({
  onMenuClick,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center border-b border-zinc-200/80 bg-white/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8 dark:border-zinc-800/80 dark:bg-zinc-950/80">
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 text-zinc-600 hover:bg-zinc-100 lg:hidden dark:text-zinc-300 dark:hover:bg-zinc-900"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Search */}
        <div className="relative hidden w-full max-w-md md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

          <input
            type="search"
            placeholder="Search posters, templates..."
            className="h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-10 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
          />
        </div>

        {/* Mobile brand */}
        <Link
          href="/dashboard"
          className="flex items-center gap-2 md:hidden"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500 text-white">
            <Sparkles className="h-4 w-4" />
          </div>

          <span className="text-sm font-bold text-zinc-950 dark:text-white">
            PosterAI
          </span>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/create"
          className="hidden items-center gap-2 rounded-xl bg-zinc-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 sm:flex dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Plus className="h-4 w-4" />
          Create Poster
        </Link>

        <button
          className="relative rounded-xl p-2.5 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-5 w-5" />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-950" />
        </button>

        <div className="hidden h-8 w-px bg-zinc-200 sm:block dark:bg-zinc-800" />

        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-xs font-bold text-white">
          AH
        </div>
      </div>
    </header>
  );
}