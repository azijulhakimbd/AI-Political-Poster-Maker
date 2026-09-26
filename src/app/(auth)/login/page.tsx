"use client";

import {
  FormEvent,
  Suspense,
  useState,
} from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
  Sparkles,
} from "lucide-react";

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
          <div className="flex min-h-screen items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-emerald-600" />
          </div>
        </main>
      }
    >
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const callbackUrl =
    searchParams.get("callbackUrl") || "/dashboard";

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData(event.currentTarget);

    const email = String(formData.get("email") || "");
    const password = String(formData.get("password") || "");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (!result || result.error) {
      setError("Invalid email or password.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="grid min-h-screen lg:grid-cols-2">
        {/* Brand panel */}
        <section className="relative hidden overflow-hidden bg-zinc-950 lg:flex">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(20,184,166,0.15),transparent_35%)]" />

          <div className="relative z-10 flex w-full flex-col justify-between p-12 xl:p-16">
            <Link
              href="/"
              className="flex items-center gap-3 text-white"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 shadow-lg shadow-emerald-500/20">
                <Sparkles className="h-5 w-5" />
              </div>

              <div>
                <p className="font-bold">PosterAI</p>
                <p className="text-xs text-zinc-400">
                  Political Poster Studio
                </p>
              </div>
            </Link>

            <div className="max-w-lg">
              <p className="mb-4 text-sm font-medium text-emerald-400">
                AI-POWERED DESIGN
              </p>

              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white">
                Turn ideas into
                <span className="block text-emerald-400">
                  powerful posters.
                </span>
              </h1>

              <p className="mt-6 text-base leading-7 text-zinc-400">
                Create, customize and export professional poster
                designs from one intelligent workspace.
              </p>
            </div>

            <p className="text-xs text-zinc-600">
              AI Political Poster Maker
            </p>
          </div>
        </section>

        {/* Form */}
        <section className="flex items-center justify-center px-6 py-12 sm:px-10">
          <div className="w-full max-w-md">
            <div className="mb-10 lg:hidden">
              <Link
                href="/"
                className="flex items-center gap-3"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>

                <span className="font-bold text-zinc-950 dark:text-white">
                  PosterAI
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-950 dark:text-white">
                Welcome back
              </h2>

              <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-400">
                Sign in to continue to your poster workspace.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-500/20 dark:bg-red-500/10 dark:text-red-400">
                {error}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="h-12 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />

                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-zinc-200 bg-white pl-11 pr-11 text-sm outline-none transition focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 dark:border-zinc-800 dark:bg-zinc-900 dark:text-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((value) => !value)
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-zinc-500">
                  <input
                    type="checkbox"
                    className="rounded border-zinc-300 text-emerald-500 focus:ring-emerald-500"
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  className="font-medium text-emerald-600 hover:text-emerald-700"
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 text-sm font-semibold text-white shadow-lg shadow-zinc-950/10 transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-zinc-500">
              Do not have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-emerald-600 hover:text-emerald-700"
              >
                Create account
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}