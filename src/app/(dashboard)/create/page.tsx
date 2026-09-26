
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  ArrowLeft,
  CalendarDays,
  ImagePlus,
  Loader2,
  MapPin,
  Sparkles,
  Upload,
  User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { API_URL } from "@/lib/api-url";

// =========================
// পোস্টারের উপলক্ষ
// =========================

const occasions = [
  "শুভেচ্ছা",
  "জন্মদিন",
  "বিজয় দিবস",
  "স্বাধীনতা দিবস",
  "শোকবার্তা",
  "স্মরণসভা",
  "দোয়া মাহফিল",
  "অন্যান্য",
];

// =========================
// পোস্টারের ডিজাইন
// =========================

const posterStyles = [
  {
    id: "classic",
    name: "ক্লাসিক",
    description: "ঐতিহ্যবাহী রাজনৈতিক পোস্টার ডিজাইন",
  },
  {
    id: "modern",
    name: "আধুনিক",
    description: "পরিষ্কার ও আধুনিক পোস্টার ডিজাইন",
  },
  {
    id: "premium",
    name: "প্রিমিয়াম",
    description: "আকর্ষণীয় টাইপোগ্রাফি ও প্রিমিয়াম ডিজাইন",
  },
];

const fallbackTemplates = [
  {
    _id: "victory-day",
    key: "victory-day",
    title: "বিজয় দিবস",
    occasionType: "বিজয় দিবস",
    description: "জাতীয় পতাকার রঙে স্মরণীয় দিবসের পোস্টার",
    theme: "green",
  },
  {
    _id: "tribute",
    key: "tribute",
    title: "শ্রদ্ধাঞ্জলি",
    occasionType: "শোক/স্মরণ",
    description: "সংযত রঙের স্মরণপোস্টার",
    theme: "dark",
  },
  {
    _id: "community-greeting",
    key: "community-greeting",
    title: "শুভেচ্ছা ও অভিনন্দন",
    occasionType: "শুভেচ্ছা",
    description: "ব্যক্তিগত ও সাংগঠনিক শুভেচ্ছার নকশা",
    theme: "gold",
  },
];

type PosterTemplate = (typeof fallbackTemplates)[number];
type SelectedPhoto = { file: File; previewUrl: string };

export default function CreatePosterPage() {
  const router = useRouter();
  const { data: session } = useSession();

  // =========================
  // এআই জেনারেশন স্টেট
  // =========================

  const [isGenerating, setIsGenerating] = useState(false);

  // =========================
  // ব্যক্তির তথ্য
  // =========================

  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [organization, setOrganization] = useState("");

  // =========================
  // অতিরিক্ত তথ্য
  // =========================

  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");
  const [headline, setHeadline] = useState("");

  // =========================
  // পোস্টার অপশন
  // =========================

  const [occasion, setOccasion] = useState("");
  const [style, setStyle] = useState("classic");

  // =========================
  // ছবি
  // =========================

  const [photos, setPhotos] = useState<SelectedPhoto[]>([]);
  const [templates, setTemplates] = useState<PosterTemplate[]>(fallbackTemplates);
  const [templateId, setTemplateId] = useState("victory-day");
  const selectedTemplate = templates.find(
    (template) => template._id === templateId || template.key === templateId
  ) || templates[0];

  useEffect(() => {
    const controller = new AbortController();
    const requestedTemplate = new URLSearchParams(window.location.search).get("template");

    fetch(`${API_URL}/api/templates`, { signal: controller.signal })
      .then((response) => response.json())
      .then((result) => {
        if (result.success && Array.isArray(result.data) && result.data.length) {
          setTemplates(result.data);
          const selected = result.data.find(
            (template: PosterTemplate) => template._id === requestedTemplate || template.key === requestedTemplate
          );
          setTemplateId(selected?._id || result.data[0]._id);
        }
      })
      .catch(() => undefined);

    return () => controller.abort();
  }, []);

  // =========================
  // ছবি আপলোড
  // =========================

  const handlePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files || []);
    if (!files.length) return;

    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (files.length > 3) {
      alert("সর্বোচ্চ ৩টি ছবি আপলোড করুন।");
      event.target.value = "";
      return;
    }

    if (files.some((file) => !allowedTypes.includes(file.type))) {
      alert("অনুগ্রহ করে PNG, JPG অথবা WEBP ছবি আপলোড করুন।");
      event.target.value = "";
      return;
    }

    if (files.some((file) => file.size > 5 * 1024 * 1024)) {
      alert("প্রতিটি ছবির আকার ৫ MB-এর কম হতে হবে।");
      event.target.value = "";
      return;
    }

    photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    setPhotos(files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    })));
  };

  // =========================
  // ছবি মুছে ফেলা
  // =========================

  const removePhoto = () => {
    photos.forEach((photo) => URL.revokeObjectURL(photo.previewUrl));
    setPhotos([]);
  };

  // =========================
  // জেমিনি দিয়ে পোস্টার তৈরি
  // =========================

  const handleGeneratePoster = async () => {
    // একই সময়ে একাধিক অনুরোধ বন্ধ
    if (isGenerating) return;

    // নাম যাচাই
    if (!name.trim()) {
      alert("অনুগ্রহ করে ব্যক্তির নাম লিখুন।");
      return;
    }

    // উপলক্ষ যাচাই
    if (!occasion) {
      alert("অনুগ্রহ করে একটি উপলক্ষ নির্বাচন করুন।");
      return;
    }

    try {
      setIsGenerating(true);

      if (!session?.accessToken) {
        throw new Error("অনুগ্রহ করে আবার সাইন ইন করুন।");
      }

      let uploadedPhotos: Array<{ url: string; publicId: string }> = [];

      if (photos.length) {
        const uploadBody = new FormData();
        photos.forEach(({ file }) => uploadBody.append("photos", file));

        const uploadResponse = await fetch(`${API_URL}/api/upload`, {
          method: "POST",
          headers: { Authorization: `Bearer ${session.accessToken}` },
          body: uploadBody,
        });
        const uploadResult = await uploadResponse.json();

        if (!uploadResponse.ok || !uploadResult.success) {
          throw new Error(uploadResult.message || "ছবি আপলোড করা যায়নি।");
        }
        uploadedPhotos = uploadResult.data;
      }

      const response = await fetch("/api/ai/generate", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: name.trim(),
          designation: designation.trim(),
          organization: organization.trim(),
          occasion,
          headline: headline.trim(),
          date,
          location: location.trim(),
          message: message.trim(),
          templateName: selectedTemplate.title,
          style,

          // বাংলা ভাষায় কনটেন্ট তৈরি
          language: "bn",
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error ||
            "পোস্টারের তথ্য তৈরি করতে সমস্যা হয়েছে।",
        );
      }

      // =========================
      // পোস্টার ডেটা
      // =========================

      const posterData = {
        name: name.trim() || "আপনার নাম",

        designation:
          designation.trim() || "সভাপতি, স্থানীয় কমিটি",

        organization: organization.trim(),

        occasion: occasion || "শুভেচ্ছা",
        headline: result.data.headline,

        date,

        location: location.trim(),

        message:
          message.trim() ||
          "আপনাকে আন্তরিক শুভেচ্ছা ও অভিনন্দন",

        style,

        photo: uploadedPhotos[0]?.url || null,
        photos: uploadedPhotos,
        templateId: selectedTemplate._id,
        posterId: "",

        // জেমিনি থেকে তৈরি তথ্য
        ai: result.data,
      };

      const saveResponse = await fetch(`${API_URL}/api/posters`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          formData: {
            name: posterData.name,
            designation: posterData.designation,
            organization: posterData.organization,
            occasion: posterData.occasion,
            headline: posterData.headline,
            date: posterData.date,
            location: posterData.location,
            message: posterData.message,
            style: posterData.style,
            language: "bn",
          },
          aiContent: result.data,
          uploadedPhotoUrls: uploadedPhotos,
          templateId: selectedTemplate._id,
        }),
      });
      const savedResult = await saveResponse.json();

      if (!saveResponse.ok || !savedResult.success) {
        throw new Error(savedResult.message || "পোস্টার সংরক্ষণ করা যায়নি।");
      }
      posterData.posterId = savedResult.data._id;

      // এডিটর পেজের জন্য ডেটা সংরক্ষণ
      sessionStorage.setItem(
        "poster-data",
        JSON.stringify(posterData),
      );

      // এডিটর পেজে যাওয়া
      router.push("/editor");
    } catch (error) {
      console.error("পোস্টার তৈরি করার সময় সমস্যা:", error);

      alert(
        error instanceof Error
          ? error.message
          : "পোস্টার তৈরি করার সময় একটি সমস্যা হয়েছে।",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* =========================
          হেডার
      ========================== */}

      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* হোমে ফিরে যান */}

          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />

            <span className="hidden sm:inline">
              হোমে ফিরে যান
            </span>

            <span className="sm:hidden">ফিরে যান</span>
          </Link>

          {/* ব্র্যান্ড */}

          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>

            <span className="hidden font-semibold sm:block">
              এআই পোস্টার মেকার
            </span>
          </div>

          {/* স্ট্যাটাস */}

          <Badge variant="secondary">
            পোস্টার তৈরি করুন
          </Badge>
        </div>
      </header>

      {/* =========================
          মূল অংশ
      ========================== */}

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* শিরোনাম */}

        <div className="mx-auto mb-10 max-w-3xl text-center">
          <Badge className="mb-4 gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            কৃত্রিম বুদ্ধিমত্তা চালিত
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            আপনার পোস্টার তৈরি করুন
          </h1>

          <p className="mt-4 text-muted-foreground">
            পোস্টারের তথ্য দিন, ছবি আপলোড করুন, ডিজাইন নির্বাচন
            করুন এবং এআই দিয়ে পোস্টার তৈরি করুন।
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* =========================
              মূল ফর্ম
          ========================== */}

          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>পোস্টারের তথ্য</CardTitle>
            </CardHeader>

            <CardContent className="space-y-7">
              {/* ব্যক্তির তথ্য */}

              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">
                    ব্যক্তির তথ্য
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    পোস্টারে যে ব্যক্তির তথ্য দেখাতে চান তা লিখুন।
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* নাম */}

                  <div className="space-y-2">
                    <Label htmlFor="name">নাম</Label>

                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="name"
                        value={name}
                        onChange={(event) =>
                          setName(event.target.value)
                        }
                        placeholder="পূর্ণ নাম লিখুন"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* পদবি */}

                  <div className="space-y-2">
                    <Label htmlFor="designation">
                      পদবি
                    </Label>

                    <Input
                      id="designation"
                      value={designation}
                      onChange={(event) =>
                        setDesignation(event.target.value)
                      }
                      placeholder="যেমন: সভাপতি"
                    />
                  </div>
                </div>

                {/* সংগঠন */}

                <div className="space-y-2">
                  <Label htmlFor="organization">
                    সংগঠন / দল
                  </Label>

                  <Input
                    id="organization"
                    value={organization}
                    onChange={(event) =>
                      setOrganization(event.target.value)
                    }
                    placeholder="সংগঠন বা দলের নাম লিখুন"
                  />
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* =========================
                  উপলক্ষ
              ========================== */}

              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">
                    উপলক্ষ
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    পোস্টারের জন্য একটি উপলক্ষ নির্বাচন করুন।
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {occasions.map((item) => {
                    const selected = occasion === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setOccasion(item)}
                        aria-pressed={selected}
                        className={`rounded-xl border px-3 py-3 text-sm font-medium transition-all ${
                          selected
                            ? "border-primary bg-primary text-primary-foreground shadow-sm"
                            : "border-border bg-background hover:border-primary/50 hover:bg-muted"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-border" />

              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">টেমপ্লেট</h2>
                  <p className="text-sm text-muted-foreground">
                    উপলক্ষ অনুযায়ী একটি পোস্টার বিন্যাস বেছে নিন।
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {templates.map((template) => {
                    const selected =
                      templateId === template._id || templateId === template.key;

                    return (
                      <button
                        key={template._id}
                        type="button"
                        onClick={() => setTemplateId(template._id)}
                        aria-pressed={selected}
                        className={`rounded-lg border p-4 text-left transition ${
                          selected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/40 hover:bg-muted/40"
                        }`}
                      >
                        <span className="block text-sm font-semibold">
                          {template.title}
                        </span>
                        <span className="mt-1 block text-xs leading-5 text-muted-foreground">
                          {template.description}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* =========================
                  অতিরিক্ত তথ্য
              ========================== */}

              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">
                    অতিরিক্ত তথ্য
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* তারিখ */}

                  <div className="space-y-2">
                    <Label htmlFor="date">
                      তারিখ
                    </Label>

                    <div className="relative">
                      <CalendarDays className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="date"
                        type="date"
                        value={date}
                        onChange={(event) =>
                          setDate(event.target.value)
                        }
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* স্থান */}

                  <div className="space-y-2">
                    <Label htmlFor="location">
                      স্থান
                    </Label>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="location"
                        value={location}
                        onChange={(event) =>
                          setLocation(event.target.value)
                        }
                        placeholder="যেমন: নালিতাবাড়ী, শেরপুর"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* বার্তা */}

                <div className="space-y-2">
                  <Label htmlFor="headline">পোস্টারের প্রধান শিরোনাম</Label>
                  <Input
                    id="headline"
                    value={headline}
                    onChange={(event) => setHeadline(event.target.value)}
                    placeholder="যেমন: মহান বিজয় দিবস"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">
                    বার্তা / স্লোগান
                  </Label>

                  <Textarea
                    id="message"
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    placeholder="পোস্টারে যে বার্তা বা স্লোগান দেখাতে চান তা লিখুন..."
                    className="min-h-28 resize-none"
                  />
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* =========================
                  ছবি আপলোড
              ========================== */}

              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">
                    ব্যক্তির ছবি
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    পোস্টারের জন্য একটি পরিষ্কার ছবি আপলোড করুন।
                  </p>
                </div>

                {!photos.length ? (
                  <label
                    htmlFor="photo-upload"
                    className="group flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 px-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/40"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ImagePlus className="h-6 w-6" />
                    </div>

                    <p className="font-medium">
                      ছবি আপলোড করুন
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      PNG, JPG অথবা WEBP • সর্বোচ্চ ৩টি ছবি • প্রতিটি ৫ MB
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium">
                      <Upload className="h-4 w-4" />
                      ছবি নির্বাচন করুন
                    </span>

                    <input
                      id="photo-upload"
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                ) : (
                  <div className="space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      {photos.map((photo, index) => (
                        <div key={photo.previewUrl} className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
                          <Image
                            src={photo.previewUrl}
                            alt={`আপলোড করা ছবি ${index + 1}`}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <label htmlFor="photo-upload" className="cursor-pointer text-sm font-medium text-primary hover:underline">
                        ছবি পরিবর্তন করুন
                      </label>
                      <button type="button" onClick={removePhoto} className="text-sm text-muted-foreground hover:text-destructive">
                        সব ছবি সরান
                      </button>
                    </div>
                    <input
                      id="photo-upload"
                      type="file"
                      multiple
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </div>
                )}
              </div>

              <div className="h-px bg-border" />

              {/* =========================
                  পোস্টারের ডিজাইন
              ========================== */}

              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">
                    পোস্টারের ডিজাইন
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    আপনার পছন্দের পোস্টার ডিজাইন নির্বাচন করুন।
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {posterStyles.map((item) => {
                    const selected = style === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setStyle(item.id)}
                        aria-pressed={selected}
                        className={`rounded-xl border p-4 text-left transition-all ${
                          selected
                            ? "border-primary bg-primary/5 ring-1 ring-primary"
                            : "border-border hover:border-primary/40 hover:bg-muted/40"
                        }`}
                      >
                        <div className="mb-2 font-semibold">
                          {item.name}
                        </div>

                        <p className="text-xs leading-5 text-muted-foreground">
                          {item.description}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* =========================
                  অ্যাকশন
              ========================== */}

              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  asChild
                >
                  <Link href="/">
                    বাতিল করুন
                  </Link>
                </Button>

                <Button
                  type="button"
                  size="lg"
                  className="gap-2"
                  onClick={handleGeneratePoster}
                  disabled={isGenerating}
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      জেমিনি দিয়ে তৈরি হচ্ছে...
                    </>
                  ) : (
                    <>
                      জেমিনি দিয়ে পোস্টার তৈরি করুন
                      <Sparkles className="h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* =========================
              ডান পাশের অংশ
          ========================== */}

          <div className="space-y-6">
            {/* এআই প্রিভিউ */}

            <Card className="overflow-hidden border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  এআই পোস্টার
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="rounded-2xl border bg-muted/30 p-6">
                  <div className="mx-auto flex aspect-4/5 max-w-60 flex-col items-center justify-center rounded-xl border bg-background p-6 text-center shadow-sm">
                    {photos[0] ? (
                      <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-primary/20">
                        <Image
                          src={photos[0].previewUrl}
                          alt="পোস্টারের ছবি"
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                        <ImagePlus className="h-7 w-7 text-primary" />
                      </div>
                    )}

                    <p className="font-semibold">
                      {name || "পোস্টারের প্রিভিউ"}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {occasion
                        ? `${occasion} পোস্টার`
                        : "আপনার পোস্টারের প্রিভিউ এখানে দেখা যাবে।"}
                    </p>

                    {isGenerating && (
                      <div className="mt-4 flex items-center gap-2 text-xs text-primary">
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        পোস্টার তৈরি হচ্ছে...
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* টিপস */}

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">
                  ভালো পোস্টারের জন্য পরামর্শ
                </CardTitle>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    পরিষ্কার ও উচ্চমানের ছবি ব্যবহার করুন।
                  </li>

                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    মূল বার্তা সংক্ষিপ্ত ও সহজপাঠ্য রাখুন।
                  </li>

                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    প্রয়োজন অনুযায়ী সঠিক তারিখ ও স্থান যোগ করুন।
                  </li>

                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    পোস্টার তৈরি হওয়ার পর এডিটর থেকে ডিজাইন পরিবর্তন করতে পারবেন।
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* বর্তমান নির্বাচন */}

            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">
                  বর্তমান নির্বাচন
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    উপলক্ষ
                  </span>

                  <span className="font-medium">
                    {occasion || "নির্বাচন করা হয়নি"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    ডিজাইন
                  </span>

                  <span className="font-medium">
                    {posterStyles.find(
                      (item) => item.id === style,
                    )?.name || "ক্লাসিক"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    ছবি
                  </span>

                  <span className="font-medium">
                    {photos.length
                      ? "আপলোড করা হয়েছে"
                      : "আপলোড করা হয়নি"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    এআই
                  </span>

                  <span
                    className={
                      isGenerating
                        ? "font-medium text-primary"
                        : "font-medium"
                    }
                  >
                    {isGenerating
                      ? "তৈরি হচ্ছে..."
                      : "প্রস্তুত"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}
