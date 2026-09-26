import Link from "next/link";
import {
  ArrowUpRight,
  Clock3,
  Download,
  FileImage,
  Plus,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const stats = [
  {
    title: "Total Posters",
    value: "24",
    change: "+12%",
    icon: FileImage,
  },
  {
    title: "AI Generations",
    value: "68",
    change: "+18%",
    icon: Sparkles,
  },
  {
    title: "Downloads",
    value: "142",
    change: "+24%",
    icon: Download,
  },
  {
    title: "This Month",
    value: "16",
    change: "+8%",
    icon: TrendingUp,
  },
];

const recentPosters = [
  {
    id: "1",
    title: "Victory Day Celebration",
    type: "Victory Day",
    date: "Today",
  },
  {
    id: "2",
    title: "Community Meeting",
    type: "Campaign",
    date: "Yesterday",
  },
  {
    id: "3",
    title: "Tribute Poster",
    type: "Tribute",
    date: "2 days ago",
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome */}
      <section className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6 sm:p-8 dark:border-emerald-500/10 dark:from-emerald-500/10 dark:via-zinc-900 dark:to-teal-500/10">
        <div className="relative z-10 max-w-2xl">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1.5 text-xs font-medium text-emerald-700 backdrop-blur dark:border-emerald-500/20 dark:bg-zinc-900/60 dark:text-emerald-400">
            <Sparkles className="h-3.5 w-3.5" />
            AI Poster Studio
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-zinc-950 sm:text-3xl dark:text-white">
            Create something powerful.
          </h1>

          <p className="mt-2 max-w-xl text-sm leading-6 text-zinc-600 dark:text-zinc-400">
            Design professional political posters with AI-assisted layouts,
            typography, imagery, and ready-to-print exports.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/create"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-zinc-950/10 transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              <Plus className="h-4 w-4" />
              Create Poster
            </Link>

            <Link
              href="/templates"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-5 py-3 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              Browse Templates
            </Link>
          </div>
        </div>

        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-32 right-20 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  <Icon className="h-5 w-5" />
                </div>

                <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                  {stat.change}
                </span>
              </div>

              <p className="mt-5 text-sm text-zinc-500 dark:text-zinc-400">
                {stat.title}
              </p>

              <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-950 dark:text-white">
                {stat.value}
              </p>
            </div>
          );
        })}
      </section>

      {/* Recent */}
      <section className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <div className="rounded-2xl border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-200 p-5 dark:border-zinc-800">
            <div>
              <h2 className="font-semibold text-zinc-950 dark:text-white">
                Recent Posters
              </h2>
              <p className="mt-1 text-xs text-zinc-500">
                Your latest poster designs
              </p>
            </div>

            <Link
              href="/posters"
              className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700"
            >
              View all
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {recentPosters.map((poster) => (
              <Link
                href={`/posters/${poster.id}`}
                key={poster.id}
                className="flex items-center gap-4 p-5 transition hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
              >
                <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 text-emerald-700 dark:from-emerald-500/10 dark:to-teal-500/10 dark:text-emerald-400">
                  <FileImage className="h-5 w-5" />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-zinc-900 dark:text-white">
                    {poster.title}
                  </h3>

                  <p className="mt-1 text-xs text-zinc-500">
                    {poster.type}
                  </p>
                </div>

                <div className="hidden items-center gap-1 text-xs text-zinc-400 sm:flex">
                  <Clock3 className="h-3.5 w-3.5" />
                  {poster.date}
                </div>

                <ArrowUpRight className="h-4 w-4 text-zinc-400" />
              </Link>
            ))}
          </div>
        </div>

        {/* Quick action */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20">
            <Sparkles className="h-5 w-5" />
          </div>

          <h2 className="mt-5 text-lg font-bold text-zinc-950 dark:text-white">
            Start a new design
          </h2>

          <p className="mt-2 text-sm leading-6 text-zinc-500 dark:text-zinc-400">
            Choose an occasion, add your information, upload photos, and let
            AI help you create the composition.
          </p>

          <Link
            href="/create"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            New Poster
          </Link>
        </div>
      </section>
    </div>
  );
}