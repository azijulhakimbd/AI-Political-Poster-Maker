
"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { toJpeg, toPng } from "html-to-image";
import jsPDF from "jspdf";

import {
  ArrowLeft,
  Download,
  ImagePlus,
  Layers3,
  Minus,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Type,
  Upload,
  X,
  ZoomIn,
  ZoomOut,
  MapPin,
  CalendarDays,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/lib/api-url";
import type { PosterResponse } from "@/lib/poster-schema";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PosterData {
  posterId?: string;
  templateId?: string;
  headline?: string;
  ai?: PosterResponse;
  photos?: Array<{ url: string; publicId: string }>;
  background?: string;
  name: string;
  designation: string;
  organization: string;
  occasion: string;
  date: string;
  location: string;
  message: string;
  style: string;
  photo: string | null;
}

type ExportFormat = "png" | "jpg";

const defaultPosterData: PosterData = {
  name: "আপনার নাম",
  designation: "সভাপতি, স্থানীয় কমিটি",
  organization: "",
  occasion: "শুভেচ্ছা",
  headline: "",
  date: "",
  location: "",
  message: "আপনাকে আন্তরিক শুভেচ্ছা ও অভিনন্দন",
  style: "classic",
  photo: null,
  photos: [],
};

const backgrounds = [
  {
    id: "green",
    name: "Emerald",
    className:
      "bg-gradient-to-br from-emerald-950 via-emerald-700 to-green-400",
  },
  {
    id: "red",
    name: "Red",
    className:
      "bg-gradient-to-br from-red-950 via-red-700 to-orange-400",
  },
  {
    id: "blue",
    name: "Blue",
    className:
      "bg-gradient-to-br from-blue-950 via-blue-700 to-cyan-400",
  },
  {
    id: "dark",
    name: "Dark",
    className:
      "bg-gradient-to-br from-neutral-950 via-neutral-800 to-neutral-600",
  },
  {
    id: "gold",
    name: "Gold",
    className:
      "bg-gradient-to-br from-amber-950 via-amber-700 to-yellow-400",
  },
  {
    id: "minimal",
    name: "Minimal",
    className:
      "bg-gradient-to-br from-zinc-900 via-zinc-700 to-stone-500",
  },
];

function getBackgroundFromStyle(style: string) {
  if (backgrounds.some((item) => item.id === style)) return style;

  switch (style) {
    case "modern":
      return "blue";

    case "premium":
      return "dark";

    case "classic":
    default:
      return "green";
  }
}

function formatDate(date: string) {
  if (!date) return "";

  try {
    return new Intl.DateTimeFormat("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));
  } catch {
    return date;
  }
}

function sanitizeFileName(value: string) {
  return (
    value
      .trim()
      .replace(/[<>:"/\\|?*\x00-\x1F]/g, "")
      .replace(/\s+/g, "-")
      .slice(0, 80) || "poster"
  );
}

function subscribeToPosterData(onChange: () => void) {
  if (typeof window === "undefined") return () => undefined;
  window.addEventListener("poster-data-updated", onChange);
  return () => window.removeEventListener("poster-data-updated", onChange);
}

function getPosterDataSnapshot() {
  return window.sessionStorage.getItem("poster-data") || "";
}

function getServerPosterDataSnapshot() {
  return "";
}

function parsePosterData(value: string): PosterData | null {
  if (!value) return null;

  try {
    return JSON.parse(value) as PosterData;
  } catch (error) {
    console.error("Failed to load poster data:", error);
    return null;
  }
}

export default function EditorPage() {
  const serializedPosterData = useSyncExternalStore(
    subscribeToPosterData,
    getPosterDataSnapshot,
    getServerPosterDataSnapshot
  );

  return (
    <EditorWorkspace
      key={serializedPosterData}
      initialPosterData={parsePosterData(serializedPosterData)}
    />
  );
}

function EditorWorkspace({
  initialPosterData,
}: {
  initialPosterData: PosterData | null;
}) {
  const { data: session } = useSession();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * IMPORTANT:
   *
   * This ref points ONLY to the actual poster.
   *
   * The zoom transform is applied to the parent wrapper.
   * Therefore editor zoom does not affect export dimensions.
   */
  const posterRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState(
    initialPosterData?.name || defaultPosterData.name
  );

  const [posterId, setPosterId] = useState(
    initialPosterData?.posterId || ""
  );

  const [templateId] = useState(
    initialPosterData?.templateId || ""
  );

  const [headline, setHeadline] = useState(
    initialPosterData?.headline || initialPosterData?.ai?.headline || ""
  );

  const [aiContent, setAiContent] = useState<PosterResponse | null>(
    initialPosterData?.ai || null
  );

  const [designation, setDesignation] = useState(
    initialPosterData?.designation ||
      defaultPosterData.designation
  );

  const [organization, setOrganization] = useState(
    initialPosterData?.organization ||
      defaultPosterData.organization
  );

  const [occasion, setOccasion] = useState(
    initialPosterData?.occasion || defaultPosterData.occasion
  );

  const [date, setDate] = useState(
    initialPosterData?.date || defaultPosterData.date
  );

  const [location, setLocation] = useState(
    initialPosterData?.location || defaultPosterData.location
  );

  const [message, setMessage] = useState(
    initialPosterData?.ai?.message ||
      initialPosterData?.message ||
      defaultPosterData.message
  );

  const [background, setBackground] = useState(
    initialPosterData?.ai?.theme ||
      initialPosterData?.background ||
      getBackgroundFromStyle(initialPosterData?.style || defaultPosterData.style)
  );

  const [photo, setPhoto] = useState<string | null>(
    initialPosterData?.photos?.[0]?.url || initialPosterData?.photo || null
  );

  const [photoAssets, setPhotoAssets] = useState(
    initialPosterData?.photos || []
  );

  const [zoom, setZoom] = useState(100);

  const [showLayers, setShowLayers] = useState(false);

  const [saved, setSaved] = useState(false);

  const [exporting, setExporting] = useState(false);
  const [isImproving, setIsImproving] = useState(false);

  const posterPhotoUrls = photoAssets.length
    ? photoAssets.map((asset) => asset.url)
    : photo
      ? [photo]
      : [];

  const posterDimensions = aiContent?.layout === "square"
    ? { width: 1600, height: 1600, aspectClass: "aspect-square" }
    : aiContent?.layout === "landscape"
      ? { width: 1600, height: 1200, aspectClass: "aspect-4/3" }
      : { width: 1200, height: 1600, aspectClass: "aspect-3/4" };

  const headlineFontClass = aiContent?.headlineStyle === "elegant" || aiContent?.headlineStyle === "traditional"
    ? "font-serif"
    : "font-sans";

  const selectedBackground =
    backgrounds.find((item) => item.id === background) ??
    backgrounds[0];

  /**
   * Convert uploaded image to Data URL.
   */
  const handlePhoto = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Please upload a PNG, JPG, or WEBP image."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");

      event.target.value = "";
      return;
    }

    if (!session?.accessToken) {
      alert("Please sign in again before uploading a photo.");
      return;
    }

    try {
      const uploadBody = new FormData();
      uploadBody.append("photos", file);
      const response = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${session.accessToken}` },
        body: uploadBody,
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to upload this image.");
      }

      const asset = result.data[0];
      setPhotoAssets((current) => [...current.slice(0, 2), asset]);
      setPhoto(asset.url);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to upload this image.");
    } finally {
      event.target.value = "";
    }
  };

  /**
   * Remove uploaded photo.
   */
  const removePhoto = () => {
    setPhoto(null);
    setPhotoAssets([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Reset editor.
   */
  const resetEditor = () => {
    setName(defaultPosterData.name);

    setDesignation(
      defaultPosterData.designation
    );

    setOrganization("");

    setOccasion(defaultPosterData.occasion);

    setDate("");

    setLocation("");

    setMessage(defaultPosterData.message);
    setHeadline("");
    setAiContent(null);

    setBackground("green");

    setPhoto(null);

    setZoom(100);

    setSaved(false);

    sessionStorage.removeItem("poster-data");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /**
   * Save current editor state.
   */
  const savePoster = async (overrides: Partial<PosterData> = {}) => {
    if (!session?.accessToken) {
      alert("Please sign in again before saving this poster.");
      return false;
    }

    const values: PosterData = {
      name,
      designation,
      organization,
      headline,
      occasion,
      date,
      location,
      message,
      style: background,
      background,
      photo,
      photos: photoAssets,
      ai: aiContent || undefined,
      posterId,
      templateId,
      ...overrides,
    };

    const savedAI = values.ai
      ? {
          ...values.ai,
          headline: values.headline || values.ai.headline,
          message: values.message,
          name: values.name,
          designation: values.designation,
          organization: values.organization,
          date: values.date,
          location: values.location,
          theme: backgrounds.some((item) => item.id === values.background)
            ? values.background as PosterResponse["theme"]
            : values.ai.theme,
          footer: `প্রচারে: ${values.name}${values.designation ? `, ${values.designation}` : ""}${values.organization ? `, ${values.organization}` : ""}`,
        }
      : null;

    try {
      const response = await fetch(
        values.posterId
          ? `${API_URL}/api/posters/${encodeURIComponent(values.posterId)}`
          : `${API_URL}/api/posters`,
        {
          method: values.posterId ? "PATCH" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify({
            formData: {
              name: values.name,
              designation: values.designation,
              organization: values.organization,
              occasion: values.occasion,
              headline: values.headline,
              date: values.date,
              location: values.location,
              message: values.message,
              style: values.style,
              background: values.background,
            },
            aiContent: savedAI,
            uploadedPhotoUrls: values.photos || [],
            templateId: values.templateId,
          }),
        }
      );
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Unable to save this poster.");
      }

      values.posterId = result.data._id;
      values.ai = savedAI || undefined;
      setPosterId(result.data._id);
      sessionStorage.setItem("poster-data", JSON.stringify(values));
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to save this poster.");
      return false;
    }

    setSaved(true);

    window.setTimeout(() => {
      setSaved(false);
    }, 2000);
    return true;
  };

  const improveWithAI = async () => {
    if (isImproving) return;
    setIsImproving(true);

    try {
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          posterId: posterId || undefined,
          name,
          designation,
          organization,
          occasion,
          headline,
          date,
          location,
          message,
          style: "classic",
          templateName: "Saved poster",
          language: "bn",
        }),
      });
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Unable to regenerate poster copy.");
      }

      const generated = result.data as PosterResponse;
      setAiContent(generated);
      setHeadline(generated.headline);
      setMessage(generated.message);
      setBackground(generated.theme);
      await savePoster({
        ai: generated,
        headline: generated.headline,
        message: generated.message,
        background: generated.theme,
        style: generated.theme,
      });
    } catch (error) {
      alert(error instanceof Error ? error.message : "Unable to regenerate poster copy.");
    } finally {
      setIsImproving(false);
    }
  };

  /**
   * Wait for all images inside poster.
   */
  const waitForImages = async (
    element: HTMLElement
  ) => {
    const images = Array.from(
      element.querySelectorAll("img")
    );

    await Promise.all(
      images.map(async (image) => {
        try {
          if (!image.complete) {
            await new Promise<void>((resolve) => {
              const done = () => resolve();

              image.onload = done;
              image.onerror = done;
            });
          }

          if (typeof image.decode === "function") {
            await image.decode().catch(() => {});
          }
        } catch {
          // Ignore individual image failures.
        }
      })
    );
  };

  /**
   * Prepare poster before export.
   */
  const preparePosterForExport = async (
    poster: HTMLElement
  ) => {
    if (document.fonts?.ready) {
      await document.fonts.ready;
    }

    await waitForImages(poster);

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  };

  /**
   * Generate poster image.
   *
   * The exported poster is always rendered at:
   *
  * The selected AI layout's print dimensions.
   */
  const generatePosterImage = async (
    format: ExportFormat | "pdf"
  ) => {
    if (!posterRef.current) {
      throw new Error("Poster element not found.");
    }

    const poster = posterRef.current;

    await preparePosterForExport(poster);

    const options = {
      cacheBust: true,

      /**
      * PDF uses the selected layout's exact raster dimensions.
       *
       * PNG/JPG use 2x resolution for better quality.
       */
      pixelRatio: format === "pdf" ? 1 : 2,

      backgroundColor: "#ffffff",

      width: posterDimensions.width,

      height: posterDimensions.height,

      style: {
        width: `${posterDimensions.width}px`,
        height: `${posterDimensions.height}px`,
        transform: "none",
        transformOrigin: "top left",
        margin: "0",
      },

      filter: (node: HTMLElement) => {
        if (
          node.dataset?.exportIgnore === "true" ||
          node.classList?.contains("export-ignore")
        ) {
          return false;
        }

        return true;
      },
    };

    if (format === "png") {
      return await toPng(poster, options);
    }

    return await toJpeg(poster, {
      ...options,
      quality: 0.95,
    });
  };

  /**
   * PNG / JPG export.
   */
  const exportPoster = async (
    format: ExportFormat
  ) => {
    if (!posterRef.current || exporting) {
      return;
    }

    setExporting(true);

    try {
      console.log("Exporting poster:", {
        width: posterDimensions.width,
        height: posterDimensions.height,
        format,
        hasPhoto: Boolean(photo),
      });

      const dataUrl = await generatePosterImage(
        format
      );

      if (
        !dataUrl ||
        !dataUrl.startsWith("data:image/")
      ) {
        throw new Error(
          "The generated image is empty."
        );
      }

      const fileName =
        sanitizeFileName(name || "ai-poster");

      const link = document.createElement("a");

      link.download = `${fileName}-poster.${format}`;

      link.href = dataUrl;

      document.body.appendChild(link);

      link.click();

      link.remove();

      console.log(
        `Poster exported successfully as ${format.toUpperCase()}`
      );
    } catch (error) {
      console.error(
        "Poster export failed:",
        error
      );

      let errorMessage =
        "Unable to export the poster.";

      if (error instanceof Error) {
        errorMessage += `\n\n${error.message}`;
      } else if (typeof error === "string") {
        errorMessage += `\n\n${error}`;
      }

      alert(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  /**
   * PDF EXPORT
   *
   * Poster image:
   *
  * 1200 × 1600 or larger, based on the selected layout.
   *
   * PDF page:
   *
  * Matches the selected poster dimensions.
   *
  * This keeps the exact poster composition.
   */
  const handlePdfExport = async () => {
    if (!posterRef.current || exporting) {
      return;
    }

    setExporting(true);

    try {
      console.log("Generating PDF:", {
        width: posterDimensions.width,
        height: posterDimensions.height,
      });

      const dataUrl =
        await generatePosterImage("pdf");

      if (
        !dataUrl ||
        !dataUrl.startsWith("data:image/")
      ) {
        throw new Error(
          "Unable to generate poster image for PDF."
        );
      }

      /**
      * Create a custom page matching the selected poster layout.
       *
       * Using px here keeps the PDF page dimensions
       * aligned with the poster canvas dimensions.
       */
      const pdf = new jsPDF({
        orientation: posterDimensions.width > posterDimensions.height ? "landscape" : "portrait",
        unit: "px",
        format: [
          posterDimensions.width,
          posterDimensions.height,
        ],
        compress: true,
      });

      /**
       * Add poster image exactly edge-to-edge.
       */
      pdf.addImage(
        dataUrl,
        "JPEG",
        0,
        0,
        posterDimensions.width,
        posterDimensions.height,
        undefined,
        "FAST"
      );

      const fileName =
        sanitizeFileName(name || "ai-poster");

      pdf.save(
        `${fileName}-poster-${posterDimensions.width}x${posterDimensions.height}.pdf`
      );

      console.log(
        "PDF exported successfully."
      );
    } catch (error) {
      console.error(
        "PDF export failed:",
        error
      );

      let errorMessage =
        "Unable to export PDF.";

      if (error instanceof Error) {
        errorMessage += `\n\n${error.message}`;
      } else if (typeof error === "string") {
        errorMessage += `\n\n${error}`;
      }

      alert(errorMessage);
    } finally {
      setExporting(false);
    }
  };

  /**
   * Header PNG export.
   */
  const handleExport = () => {
    exportPoster("png");
  };

  return (
    <main className="min-h-screen bg-muted/30">
      {/* =========================================
          HEADER
      ========================================== */}

      <header className="sticky top-0 z-50 border-b bg-background/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-4 lg:px-6">
          {/* Left */}

          <div className="flex items-center gap-4">
            <Link
              href="/create"
              className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />

              <span className="hidden sm:inline">
                Back to Create
              </span>

              <span className="sm:hidden">
                Back
              </span>
            </Link>

            <div className="hidden h-6 w-px bg-border sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </div>

              <span className="font-semibold">
                Poster Editor
              </span>
            </div>
          </div>

          {/* Right */}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={resetEditor}
              className="hidden gap-2 sm:flex"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => void savePoster()}
            >
              <Save className="mr-2 h-4 w-4" />

              {saved ? "Saved" : "Save"}
            </Button>

            <Button
              size="sm"
              onClick={handleExport}
              disabled={exporting}
            >
              <Download className="mr-2 h-4 w-4" />

              {exporting
                ? "Exporting..."
                : "Export PNG"}
            </Button>
          </div>
        </div>
      </header>

      {/* =========================================
          WORKSPACE
      ========================================== */}

      <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-[280px_1fr_300px]">
        {/* =======================================
            LEFT SIDEBAR
        ======================================== */}

        <aside className="hidden border-r bg-background lg:block">
          <div className="h-full overflow-y-auto p-5">
            <div className="mb-6">
              <Badge
                variant="secondary"
                className="mb-3"
              >
                Design
              </Badge>

              <h2 className="text-lg font-semibold">
                Poster Controls
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Customize your poster design.
              </p>
            </div>

            {/* Background */}

            <div className="space-y-4">
              <Label>Background</Label>

              <div className="grid grid-cols-2 gap-3">
                {backgrounds.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() =>
                      setBackground(item.id)
                    }
                    aria-pressed={
                      background === item.id
                    }
                    className={`group overflow-hidden rounded-xl border transition ${
                      background === item.id
                        ? "border-primary ring-2 ring-primary/20"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <div
                      className={`h-16 ${item.className}`}
                    />

                    <div className="bg-background p-2 text-xs font-medium">
                      {item.name}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="my-6 h-px bg-border" />

            {/* Photo */}

            <div className="space-y-3">
              <Label>Person Photo</Label>

              <Button
                variant="outline"
                className="w-full"
                onClick={() =>
                  fileInputRef.current?.click()
                }
              >
                <Upload className="mr-2 h-4 w-4" />

                {photo
                  ? "Replace Photo"
                  : "Upload Photo"}
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                className="hidden"
                onChange={handlePhoto}
              />

              {photo && (
                <div className="relative overflow-hidden rounded-xl border">
                      <Image
                    src={photo}
                    alt="Uploaded person"
                    width={480}
                    height={480}
                    className="aspect-square w-full object-cover"
                    unoptimized
                  />

                  <button
                    type="button"
                    onClick={removePhoto}
                    aria-label="Remove photo"
                    className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="my-6 h-px bg-border" />

            {/* Zoom */}

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Canvas Zoom</Label>

                <span className="text-xs text-muted-foreground">
                  {zoom}%
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setZoom((value) =>
                      Math.max(50, value - 10)
                    )
                  }
                >
                  <Minus className="h-4 w-4" />
                </Button>

                <div className="flex-1 text-center text-sm font-medium">
                  {zoom}%
                </div>

                <Button
                  size="icon"
                  variant="outline"
                  onClick={() =>
                    setZoom((value) =>
                      Math.min(150, value + 10)
                    )
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="my-6 h-px bg-border" />

            {/* Poster Information */}

            <div className="space-y-3">
              <Label>
                Poster Information
              </Label>

              <div className="rounded-xl border bg-muted/40 p-4 text-xs">
                <div className="space-y-2">
                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      Occasion
                    </span>

                    <span className="font-medium">
                      {occasion || "—"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      Style
                    </span>

                    <span className="font-medium capitalize">
                      {background}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      Photo
                    </span>

                    <span className="font-medium">
                      {photo
                        ? "Uploaded"
                        : "Not uploaded"}
                    </span>
                  </div>

                  <div className="flex justify-between gap-3">
                    <span className="text-muted-foreground">
                      Canvas
                    </span>

                    <span className="font-medium">
                      {posterDimensions.width} × {posterDimensions.height}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* =======================================
            CANVAS AREA
        ======================================== */}

        <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-auto bg-muted/50 p-6 pb-24 sm:p-10">
          {/* Canvas Toolbar */}

          <div className="absolute left-1/2 top-5 z-20 flex -translate-x-1/2 items-center gap-1 rounded-xl border bg-background/95 p-1 shadow-lg backdrop-blur">
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setZoom((value) =>
                  Math.max(50, value - 10)
                )
              }
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>

            <span className="min-w-14 text-center text-xs font-medium">
              {zoom}%
            </span>

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setZoom((value) =>
                  Math.min(150, value + 10)
                )
              }
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>

            <div className="mx-1 h-5 w-px bg-border" />

            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                setShowLayers((value) => !value)
              }
            >
              <Layers3 className="mr-2 h-4 w-4" />
              Layers
            </Button>
          </div>

          {/* =====================================
              POSTER ZOOM WRAPPER
          ====================================== */}

          <div
            className="relative mt-8 transition-transform duration-200"
            style={{
              transform: `scale(${zoom / 100})`,
            }}
          >
            {/* =================================
                ACTUAL EXPORTABLE POSTER

                Design ratio = 3:4
                Export ratio = 1200 × 1600
            ================================== */}

            <div
              ref={posterRef}
              className={`relative ${posterDimensions.aspectClass} w-[min(72vw,560px)] overflow-hidden rounded-sm bg-white shadow-2xl ${selectedBackground.className}`}
            >
              {/* Background */}

              <div
                className={`absolute inset-0 ${selectedBackground.className}`}
              />

              {/* Decorative overlay */}

              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.2),transparent_40%)]" />

              {/* Decorative circles */}

              <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full border border-white/10" />

              <div className="absolute -bottom-20 -left-20 h-56 w-56 rounded-full border border-white/10" />

              {/* Header */}

              <div className="relative z-10 px-[8%] pt-[7%] text-center text-white">
                <p className="text-[clamp(14px,2vw,24px)] font-bold opacity-95">
                  {occasion ||
                    "শুভেচ্ছা ও অভিনন্দন"}
                </p>

                <div className="mx-auto mt-3 h-1 w-16 rounded-full bg-white/80" />
              </div>

              {/* Photo */}

              <div className="absolute left-1/2 top-[18%] z-10 -translate-x-1/2">
                {posterPhotoUrls.length ? (
                  <div className="flex items-center justify-center gap-2">
                    {posterPhotoUrls.slice(0, 3).map((photoUrl) => (
                      <div
                        key={photoUrl}
                        className={`relative aspect-square overflow-hidden rounded-full border-[5px] border-white/90 bg-white/20 shadow-2xl ${
                          posterPhotoUrls.length === 1 ? "h-36 w-36" : "h-24 w-24"
                        }`}
                      >
                        <Image
                          src={photoUrl}
                          alt={name}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center rounded-full border-[6px] border-white/90 bg-white/15 shadow-2xl">
                    <ImagePlus className="h-10 w-10 text-white/70" />
                  </div>
                )}
              </div>

              {/* Main Text */}

              <div
                className="absolute inset-x-[7%] top-[48%] z-10 text-center text-white"
                style={{ textAlign: aiContent?.textAlignment || "center" }}
              >
                {(headline || aiContent?.headline) && (
                  <p className={`mb-3 wrap-break-word text-[clamp(20px,3.2vw,38px)] ${headlineFontClass} font-bold leading-tight drop-shadow-lg`}>
                    {headline || aiContent?.headline}
                  </p>
                )}

                <h1 className="wrap-break-word text-[clamp(22px,4vw,48px)] font-black leading-tight drop-shadow-lg">
                  {name}
                </h1>

                {aiContent?.subheadline && (
                  <p className="mt-2 text-[clamp(10px,1.5vw,18px)] font-medium opacity-95">
                    {aiContent.subheadline}
                  </p>
                )}

                {designation && (
                  <p className="mt-2 text-[clamp(10px,1.5vw,18px)] font-medium opacity-95">
                    {designation}
                  </p>
                )}

                {organization && (
                  <p className="mt-1 text-[clamp(9px,1.2vw,15px)] font-medium opacity-85">
                    {organization}
                  </p>
                )}

                <div className="mx-auto my-5 h-px w-24 bg-white/60" />

                <p className="wrap-break-word text-[clamp(11px,1.5vw,18px)] font-semibold leading-relaxed">
                  {message}
                </p>

                {aiContent?.suggestedSlogan && (
                  <p className="mt-3 text-[clamp(9px,1.2vw,14px)] font-medium opacity-90">
                    {aiContent.suggestedSlogan}
                  </p>
                )}
              </div>

              {/* Date / Location */}

              {(date || location) && (
                <div className="absolute inset-x-[8%] bottom-[13%] z-10 flex flex-wrap justify-center gap-3 text-white">
                  {date && (
                    <div className="flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1.5 text-[clamp(7px,0.9vw,12px)] backdrop-blur-sm">
                      <CalendarDays className="h-3 w-3" />

                      <span>
                        {formatDate(date)}
                      </span>
                    </div>
                  )}

                  {location && (
                    <div className="flex items-center gap-1.5 rounded-full bg-black/20 px-3 py-1.5 text-[clamp(7px,0.9vw,12px)] backdrop-blur-sm">
                      <MapPin className="h-3 w-3" />

                      <span>
                        {location}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* Footer */}

              <div className="absolute inset-x-0 bottom-0 z-10 bg-black/25 px-[8%] py-[3.5%] text-center text-white backdrop-blur-sm">
                <p className="text-[clamp(8px,1vw,13px)] font-medium">
                  {aiContent?.footer || `প্রচারে: ${name}${designation ? `, ${designation}` : ""}${organization ? `, ${organization}` : ""}`}
                </p>

                <p className="mt-1 text-[clamp(7px,0.8vw,11px)] opacity-80">
                  AI Poster Maker
                </p>
              </div>
            </div>
          </div>

          {/* =====================================
              LAYERS POPUP
          ====================================== */}

          {showLayers && (
            <div className="absolute right-5 top-20 z-30 w-64 rounded-2xl border bg-background p-4 shadow-xl">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="font-semibold">
                  Layers
                </h3>

                <button
                  type="button"
                  onClick={() =>
                    setShowLayers(false)
                  }
                  className="text-muted-foreground transition hover:text-foreground"
                  aria-label="Close layers"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="rounded-lg bg-muted p-3">
                  Footer
                </div>

                <div className="rounded-lg bg-muted p-3">
                  Date & Location
                </div>

                <div className="rounded-lg bg-muted p-3">
                  Message
                </div>

                <div className="rounded-lg bg-muted p-3">
                  Person Details
                </div>

                <div className="rounded-lg bg-muted p-3">
                  Person Photo
                </div>

                <div className="rounded-lg bg-muted p-3">
                  Background
                </div>
              </div>
            </div>
          )}
        </section>

        {/* =======================================
            RIGHT SIDEBAR
        ======================================== */}

        <aside className="border-l bg-background">
          <div className="h-full overflow-y-auto p-5">
            <div className="mb-6">
              <Badge
                variant="secondary"
                className="mb-3"
              >
                Content
              </Badge>

              <h2 className="text-lg font-semibold">
                Edit Content
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Update the text shown on your poster.
              </p>
            </div>

            <div className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="editor-headline">Poster Headline</Label>
                <Input
                  id="editor-headline"
                  value={headline}
                  onChange={(event) => setHeadline(event.target.value)}
                  placeholder="Poster headline"
                />
              </div>

              {/* Name */}

              <div className="space-y-2">
                <Label htmlFor="editor-name">
                  <span className="flex items-center gap-2">
                    <Type className="h-3.5 w-3.5" />
                    Name
                  </span>
                </Label>

                <Input
                  id="editor-name"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Person name"
                />
              </div>

              {/* Designation */}

              <div className="space-y-2">
                <Label htmlFor="editor-designation">
                  Designation
                </Label>

                <Input
                  id="editor-designation"
                  value={designation}
                  onChange={(event) =>
                    setDesignation(
                      event.target.value
                    )
                  }
                  placeholder="Designation"
                />
              </div>

              {/* Organization */}

              <div className="space-y-2">
                <Label htmlFor="editor-organization">
                  Organization / Party
                </Label>

                <Input
                  id="editor-organization"
                  value={organization}
                  onChange={(event) =>
                    setOrganization(
                      event.target.value
                    )
                  }
                  placeholder="Organization"
                />
              </div>

              {/* Occasion */}

              <div className="space-y-2">
                <Label htmlFor="editor-occasion">
                  Occasion
                </Label>

                <Input
                  id="editor-occasion"
                  value={occasion}
                  onChange={(event) =>
                    setOccasion(
                      event.target.value
                    )
                  }
                  placeholder="Occasion"
                />
              </div>

              {/* Message */}

              <div className="space-y-2">
                <Label htmlFor="editor-message">
                  Main Message
                </Label>

                <Textarea
                  id="editor-message"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  className="min-h-28 resize-none"
                  placeholder="Poster message"
                />
              </div>

              {/* Date */}

              <div className="space-y-2">
                <Label htmlFor="editor-date">
                  Date
                </Label>

                <Input
                  id="editor-date"
                  type="date"
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                />
              </div>

              {/* Location */}

              <div className="space-y-2">
                <Label htmlFor="editor-location">
                  Location
                </Label>

                <Input
                  id="editor-location"
                  value={location}
                  onChange={(event) =>
                    setLocation(event.target.value)
                  }
                  placeholder="Location"
                />
              </div>

              {/* AI Assistant */}

              <Card className="border-border/60 bg-muted/30">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="flex items-center gap-2 text-sm">
                    <Sparkles className="h-4 w-4 text-primary" />
                    AI Assistant
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-4 pt-2">
                  <p className="text-xs leading-5 text-muted-foreground">
                    Use AI to generate layout suggestions,
                    typography combinations, and visual
                    arrangements.
                  </p>

                  <Button
                    className="mt-4 w-full"
                    variant="outline"
                    onClick={improveWithAI}
                    disabled={isImproving}
                  >
                    <Sparkles className="mr-2 h-4 w-4" />
                    {isImproving ? "Regenerating..." : "Regenerate with AI"}
                  </Button>
                </CardContent>
              </Card>

              {/* Export Format */}

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>
                    Export Format
                  </Label>

                  <span className="text-xs text-muted-foreground">
                    1200 × 1600
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      exportPoster("png")
                    }
                    disabled={exporting}
                  >
                    PNG
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      exportPoster("jpg")
                    }
                    disabled={exporting}
                  >
                    JPG
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePdfExport}
                    disabled={exporting}
                  >
                    {exporting
                      ? "..."
                      : "PDF"}
                  </Button>
                </div>
              </div>

              {/* Save */}

              <Button
                variant="outline"
                className="w-full"
                onClick={() => void savePoster()}
              >
                <Save className="mr-2 h-4 w-4" />

                {saved
                  ? "Poster Saved"
                  : "Save Poster"}
              </Button>

              {/* Export */}

              <Button
                className="w-full"
                size="lg"
                onClick={handleExport}
                disabled={exporting}
              >
                <Download className="mr-2 h-4 w-4" />

                {exporting
                  ? "Exporting Poster..."
                  : "Export PNG"}
              </Button>

              {/* PDF */}

              <Button
                variant="secondary"
                className="w-full"
                size="lg"
                onClick={handlePdfExport}
                disabled={exporting}
              >
                <Download className="mr-2 h-4 w-4" />

                {exporting
                  ? "Generating PDF..."
                  : "Export PDF"}
              </Button>
            </div>
          </div>
        </aside>
      </div>

      {/* =========================================
          MOBILE BOTTOM CONTROLS
      ========================================== */}

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 p-3 backdrop-blur lg:hidden">
        <div className="grid grid-cols-4 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              fileInputRef.current?.click()
            }
          >
            <Upload className="mr-1 h-4 w-4" />
            Photo
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setZoom((value) =>
                Math.min(150, value + 10)
              )
            }
          >
            <ZoomIn className="mr-1 h-4 w-4" />
            Zoom
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={resetEditor}
          >
            <RotateCcw className="mr-1 h-4 w-4" />
            Reset
          </Button>

          <Button
            size="sm"
            onClick={handleExport}
            disabled={exporting}
          >
            <Download className="mr-1 h-4 w-4" />

            {exporting ? "..." : "Export"}
          </Button>
        </div>
      </div>
    </main>
  );
}
