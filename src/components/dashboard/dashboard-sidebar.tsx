"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Clock3,
  FileImage,
  LayoutDashboard,
  LogOut,
  Palette,
  Plus,
  Settings,
  Sparkles,
  X,
} from "lucide-react";

type DashboardSidebarProps = {
  mobileOpen?: boolean;
  onClose?: () => void;
};

const navigation = [
  {
    title: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Create Poster",
    href: "/create",
    icon: Plus,
  },
  {
    title: "Templates",
    href: "/templates",
    icon: Palette,
  },
  {
    title: "My Posters",
    href: "/posters",
    icon: FileImage,
  },
  {
    title: "History",
    href: "/history",
    icon: Clock3,
  },
];

const secondaryNavigation = [
  {
    title: "Analytics",
    href: "/dashboard?view=analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard?view=settings",
    icon: Settings,
  },
];

export function DashboardSidebar({
  mobileOpen = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    const cleanHref = href.split("?")[0];

    if (cleanHref === "/dashboard") {
      return pathname === "/dashboard";
    }

    return pathname.startsWith(cleanHref);
  };

  return (
    <>
      {/* Mobile backdrop */}
      {mobileOpen && (
        <button
          aria-label="Close sidebar"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r",
          "border-zinc-200/80 bg-white/95 backdrop-blur-xl",
          "dark:border-zinc-800/80 dark:bg-zinc-950/95",
          "transition-transform duration-300",
          "lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
      >
        {/* Brand */}
        <div className="flex h-20 items-center justify-between border-b border-zinc-200/80 px-6 dark:border-zinc-800/80">
          <Link
            href="/dashboard"
            onClick={onClose}
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 text-white shadow-lg shadow-emerald-500/20">
              <Sparkles className="h-5 w-5" />
            </div>

            <div>
              <p className="text-sm font-bold tracking-tight text-zinc-950 dark:text-white">
                PosterAI
              </p>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Political Poster Studio
              </p>
            </div>
          </Link>

          <button
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100 lg:hidden dark:hover:bg-zinc-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Main navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Workspace
          </p>

          <nav className="space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={[
                    "group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all",
                    active
                      ? "bg-emerald-50 text-emerald-700 shadow-sm dark:bg-emerald-500/10 dark:text-emerald-400"
                      : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white",
                  ].join(" ")}
                >
                  <Icon
                    className={[
                      "h-[18px] w-[18px]",
                      active
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200",
                    ].join(" ")}
                  />

                  <span>{item.title}</span>

                  {active && (
                    <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          <p className="mb-3 mt-8 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-400">
            Manage
          </p>

          <nav className="space-y-1.5">
            {secondaryNavigation.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-zinc-600 transition-all hover:bg-zinc-100 hover:text-zinc-950 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-white"
                >
                  <Icon className="h-[18px] w-[18px] text-zinc-400 group-hover:text-zinc-700 dark:group-hover:text-zinc-200" />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>

          {/* AI card */}
          <div className="mt-8 overflow-hidden rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-4 dark:border-emerald-500/10 dark:from-emerald-500/10 dark:via-zinc-950 dark:to-teal-500/10">
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <Sparkles className="h-4 w-4" />
            </div>

            <h3 className="text-sm font-semibold text-zinc-900 dark:text-white">
              AI Poster Studio
            </h3>

            <p className="mt-1 text-xs leading-5 text-zinc-500 dark:text-zinc-400">
              Turn your campaign information into polished poster designs.
            </p>

            <Link
              href="/create"
              onClick={onClose}
              className="mt-4 flex items-center justify-center rounded-lg bg-zinc-950 px-3 py-2 text-xs font-semibold text-white transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Create with AI
            </Link>
          </div>
        </div>

        {/* User section */}
        <div className="border-t border-zinc-200/80 p-4 dark:border-zinc-800/80">
          <div className="flex items-center gap-3 rounded-xl p-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-sm font-bold text-white">
              AH
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                Azijul Hakim
              </p>
              <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">
                Creator account
              </p>
            </div>

            <button
              title="Logout"
              className="rounded-lg p-2 text-zinc-400 transition hover:bg-zinc-100 hover:text-red-500 dark:hover:bg-zinc-900"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}