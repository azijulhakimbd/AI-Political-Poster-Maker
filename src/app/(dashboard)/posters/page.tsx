"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Clock3, FileImage, Loader2, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { API_URL } from "@/lib/api-url";

type PosterListItem = {
  _id: string;
  title: string;
  formData: { name: string; occasion: string };
  uploadedPhotoUrls: Array<{ url: string; publicId: string }>;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export default function PostersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [posters, setPosters] = useState<PosterListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (status === "loading") return;
    if (!session?.accessToken || !session.user.id) {
      return;
    }

    const controller = new AbortController();
    fetch(`${API_URL}/api/posters/user/${encodeURIComponent(session.user.id)}`, {
      headers: { Authorization: `Bearer ${session.accessToken}` },
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Unable to load poster history.");
        }
        setPosters(result.data);
      })
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message || "Unable to load poster history.");
        }
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, [session?.accessToken, session?.user.id, status]);

  const visibleError = error || (
    status !== "loading" && !session?.accessToken
      ? "Sign in to view your posters."
      : ""
  );

  const openPoster = async (posterId: string) => {
    if (!session?.accessToken) return;
    setBusyId(posterId);

    try {
      const response = await fetch(`${API_URL}/api/posters/${posterId}`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
        cache: "no-store",
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to open this poster.");
      }

      const poster = result.data;
      const photos = poster.uploadedPhotoUrls || [];
      sessionStorage.setItem("poster-data", JSON.stringify({
        ...poster.formData,
        posterId: poster._id,
        templateId: poster.templateId || "",
        photos,
        photo: photos[0]?.url || null,
        ai: poster.aiContent,
        background: poster.aiContent?.theme || poster.formData.background || poster.formData.style,
      }));
      router.push("/editor");
    } catch (openError) {
      setError(openError instanceof Error ? openError.message : "Unable to open this poster.");
    } finally {
      setBusyId("");
    }
  };

  const deletePoster = async (posterId: string) => {
    if (!session?.accessToken) return;
    setBusyId(posterId);

    try {
      const response = await fetch(`${API_URL}/api/posters/${posterId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to delete this poster.");
      }
      setPosters((current) => current.filter((poster) => poster._id !== posterId));
    } catch (deleteError) {
      setError(deleteError instanceof Error ? deleteError.message : "Unable to delete this poster.");
    } finally {
      setBusyId("");
    }
  };

  return (
    <section className="mx-auto max-w-6xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b pb-5">
        <div>
          <p className="text-xs font-semibold uppercase text-emerald-700">Workspace</p>
          <h1 className="mt-1 text-2xl font-bold">My Posters</h1>
          <p className="mt-1 text-sm text-muted-foreground">Saved designs, ready to reopen and export.</p>
        </div>
        <Button asChild>
          <Link href="/create"><Plus className="mr-2 h-4 w-4" />Create poster</Link>
        </Button>
      </div>

      {visibleError && <p role="alert" className="rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">{visibleError}</p>}

      {loading && status === "loading" ? (
        <div className="flex min-h-48 items-center justify-center text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading posters
        </div>
      ) : posters.length ? (
        <div className="divide-y rounded-lg border">
          {posters.map((poster) => (
            <article key={poster._id} className="flex items-center gap-4 p-4 sm:p-5">
              <button type="button" onClick={() => openPoster(poster._id)} className="flex min-w-0 flex-1 items-center gap-4 text-left" disabled={busyId === poster._id}>
                <div className="relative flex aspect-3/4 w-14 shrink-0 items-center justify-center overflow-hidden rounded border bg-muted">
                  {poster.uploadedPhotoUrls?.[0]?.url ? (
                    <Image src={poster.uploadedPhotoUrls[0].url} alt="" fill unoptimized className="object-cover" />
                  ) : (
                    <FileImage className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold">{poster.title}</span>
                  <span className="mt-1 block truncate text-xs text-muted-foreground">{poster.formData?.occasion} · {poster.formData?.name}</span>
                  <span className="mt-2 flex items-center gap-1 text-xs text-muted-foreground"><Clock3 className="h-3 w-3" />{new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(poster.updatedAt || poster.createdAt))}</span>
                </span>
                {busyId === poster._id && <Loader2 className="h-4 w-4 animate-spin" />}
              </button>
              <Button variant="ghost" size="icon" aria-label={`Delete ${poster.title}`} title="Delete poster" onClick={() => deletePoster(poster._id)} disabled={busyId === poster._id}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <div className="flex min-h-56 flex-col items-center justify-center border-y text-center">
          <FileImage className="h-8 w-8 text-muted-foreground" />
          <h2 className="mt-3 font-semibold">No saved posters yet</h2>
          <p className="mt-1 text-sm text-muted-foreground">Create a design to start your history.</p>
        </div>
      )}
    </section>
  );
}
