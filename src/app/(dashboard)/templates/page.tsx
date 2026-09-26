"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, Palette } from "lucide-react";

import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api-url";

type Template = {
  _id: string;
  title: string;
  occasionType: string;
  description: string;
  theme: string;
  layoutConfig: { accent?: string; layout?: string };
};

const themeStyles: Record<string, string> = {
  green: "from-emerald-950 via-emerald-700 to-green-400",
  dark: "from-neutral-950 via-neutral-800 to-neutral-600",
  gold: "from-amber-950 via-amber-700 to-yellow-400",
  red: "from-red-950 via-red-700 to-orange-400",
  blue: "from-blue-950 via-blue-700 to-cyan-400",
};

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`${API_URL}/api/templates`, { signal: controller.signal })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) throw new Error(result.message || "Unable to load templates.");
        setTemplates(result.data);
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") setError(requestError.message || "Unable to load templates.");
      })
      .finally(() => setLoading(false));
    return () => controller.abort();
  }, []);

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="border-b pb-5">
        <p className="text-xs font-semibold uppercase text-emerald-700">Design library</p>
        <h1 className="mt-1 text-2xl font-bold">Poster Templates</h1>
        <p className="mt-1 text-sm text-muted-foreground">Choose a starting composition for your occasion.</p>
      </div>
      {error && <p role="alert" className="border-l-2 border-destructive pl-3 text-sm text-destructive">{error}</p>}
      {loading ? (
        <div className="flex min-h-48 items-center justify-center text-muted-foreground"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading templates</div>
      ) : templates.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <article key={template._id} className="overflow-hidden rounded-lg border bg-background">
              <div className={`relative flex aspect-[3/2] items-end overflow-hidden bg-gradient-to-br p-5 text-white ${themeStyles[template.theme] || themeStyles.green}`}>
                <div className="absolute inset-x-0 top-4 flex justify-center gap-2">
                  <span className="h-12 w-12 rounded-full border-2 border-white/80 bg-white/20" />
                  <span className="mt-2 h-10 w-10 rounded-full border-2 border-white/70 bg-white/15" />
                  <span className="h-12 w-12 rounded-full border-2 border-white/80 bg-white/20" />
                </div>
                <div className="relative w-full border-t border-white/30 pt-3 text-center">
                  <p className="text-xs font-semibold">{template.occasionType}</p>
                  <p className="mt-1 text-lg font-bold">{template.title}</p>
                  <p className="mt-1 text-[10px] opacity-80">প্রচারে: নাম · পদবি · সংগঠন</p>
                </div>
              </div>
              <div className="flex items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <h2 className="truncate text-sm font-semibold">{template.title}</h2>
                  <p className="mt-1 text-xs text-muted-foreground">{template.description}</p>
                </div>
                <Palette className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>
              <div className="border-t p-3">
                <Button asChild className="w-full" variant="outline">
                  <Link href={`/create?template=${encodeURIComponent(template._id)}`}>Use template <ArrowRight className="ml-2 h-4 w-4" /></Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="border-y py-12 text-center text-sm text-muted-foreground">No templates are seeded yet. Run the template seed command to publish the starter set.</div>
      )}
    </section>
  );
}
