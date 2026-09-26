
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  ImagePlus,
  MapPin,
  Sparkles,
  Upload,
  User,
  X,
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

const posterStyles = [
  {
    id: "classic",
    name: "Classic",
    description: "Traditional political poster layout",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean and contemporary design",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Bold typography with premium composition",
  },
];

export default function CreatePosterPage() {
  const router = useRouter();

  // Poster fields
  const [name, setName] = useState("");
  const [designation, setDesignation] = useState("");
  const [organization, setOrganization] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [message, setMessage] = useState("");

  // Poster options
  const [occasion, setOccasion] = useState("");
  const [style, setStyle] = useState("classic");

  // Uploaded photo
  const [photo, setPhoto] = useState<string | null>(null);

  const handlePhotoUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    // Basic validation
    const allowedTypes = [
      "image/png",
      "image/jpeg",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a PNG, JPG, or WEBP image.");
      return;
    }

    // 5MB limit
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setPhoto(imageUrl);
  };

  const removePhoto = () => {
    if (photo) {
      URL.revokeObjectURL(photo);
    }

    setPhoto(null);
  };

  const handleGeneratePoster = () => {
    const posterData = {
      name: name.trim() || "আপনার নাম",
      designation:
        designation.trim() || "সভাপতি, স্থানীয় কমিটি",
      organization: organization.trim(),
      occasion: occasion || "শুভেচ্ছা",
      date,
      location: location.trim(),
      message:
        message.trim() ||
        "আপনাকে আন্তরিক শুভেচ্ছা ও অভিনন্দন",
      style,
      photo,
    };

    sessionStorage.setItem(
      "poster-data",
      JSON.stringify(posterData)
    );

    router.push("/editor");
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Back */}
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">
              Back to Home
            </span>
            <span className="sm:hidden">Back</span>
          </Link>

          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </div>

            <span className="hidden font-semibold sm:block">
              AI Poster Maker
            </span>
          </div>

          {/* Status */}
          <Badge variant="secondary">
            Create Poster
          </Badge>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <Badge className="mb-4 gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            AI Powered
          </Badge>

          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Create Your Poster
          </h1>

          <p className="mt-4 text-muted-foreground">
            Add your poster information, upload a photo,
            choose a style, and generate your design.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          {/* =========================
              FORM
          ========================== */}
          <Card className="border-border/60 shadow-sm">
            <CardHeader>
              <CardTitle>
                Poster Information
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-7">
              {/* Person Information */}
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">
                    Person Details
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Enter the information you want to appear
                    on the poster.
                  </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Name
                    </Label>

                    <div className="relative">
                      <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="name"
                        value={name}
                        onChange={(event) =>
                          setName(event.target.value)
                        }
                        placeholder="Enter full name"
                        className="pl-10"
                      />
                    </div>
                  </div>

                  {/* Designation */}
                  <div className="space-y-2">
                    <Label htmlFor="designation">
                      Designation
                    </Label>

                    <Input
                      id="designation"
                      value={designation}
                      onChange={(event) =>
                        setDesignation(
                          event.target.value
                        )
                      }
                      placeholder="e.g. Chairman"
                    />
                  </div>
                </div>

                {/* Organization */}
                <div className="space-y-2">
                  <Label htmlFor="organization">
                    Organization / Party
                  </Label>

                  <Input
                    id="organization"
                    value={organization}
                    onChange={(event) =>
                      setOrganization(
                        event.target.value
                      )
                    }
                    placeholder="Enter organization or party name"
                  />
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* =========================
                  OCCASION
              ========================== */}
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">
                    Occasion
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Select the occasion for your poster.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {occasions.map((item) => {
                    const selected =
                      occasion === item;

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setOccasion(item)
                        }
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

              {/* =========================
                  DATE & LOCATION
              ========================== */}
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">
                    Additional Information
                  </h2>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  {/* Date */}
                  <div className="space-y-2">
                    <Label htmlFor="date">
                      Date
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

                  {/* Location */}
                  <div className="space-y-2">
                    <Label htmlFor="location">
                      Location
                    </Label>

                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                      <Input
                        id="location"
                        value={location}
                        onChange={(event) =>
                          setLocation(
                            event.target.value
                          )
                        }
                        placeholder="e.g. Nalitabari, Sherpur"
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <Label htmlFor="message">
                    Message / Slogan
                  </Label>

                  <Textarea
                    id="message"
                    value={message}
                    onChange={(event) =>
                      setMessage(event.target.value)
                    }
                    placeholder="Write the message you want to display on the poster..."
                    className="min-h-28 resize-none"
                  />
                </div>
              </div>

              <div className="h-px bg-border" />

              {/* =========================
                  PHOTO UPLOAD
              ========================== */}
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">
                    Person Photo
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Upload a clear portrait photo for the
                    poster.
                  </p>
                </div>

                {!photo ? (
                  <label
                    htmlFor="photo-upload"
                    className="group flex min-h-52 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/20 px-6 text-center transition-colors hover:border-primary/50 hover:bg-muted/40"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <ImagePlus className="h-6 w-6" />
                    </div>

                    <p className="font-medium">
                      Upload your photo
                    </p>

                    <p className="mt-1 text-sm text-muted-foreground">
                      PNG, JPG or WEBP • Max 5MB
                    </p>

                    <span className="mt-4 inline-flex items-center gap-2 rounded-lg border bg-background px-4 py-2 text-sm font-medium">
                      <Upload className="h-4 w-4" />
                      Choose Photo
                    </span>

                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      className="hidden"
                      onChange={handlePhotoUpload}
                    />
                  </label>
                ) : (
                  <div className="relative overflow-hidden rounded-2xl border">
                    <div className="relative aspect-[16/9] bg-muted">
                      <Image
                        src={photo}
                        alt="Uploaded poster photo"
                        fill
                        unoptimized
                        className="object-contain"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur transition hover:bg-black"
                      aria-label="Remove photo"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div className="h-px bg-border" />

              {/* =========================
                  POSTER STYLE
              ========================== */}
              <div className="space-y-4">
                <div>
                  <h2 className="font-semibold">
                    Poster Style
                  </h2>

                  <p className="text-sm text-muted-foreground">
                    Choose the visual direction for your
                    poster.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {posterStyles.map((item) => {
                    const selected =
                      style === item.id;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setStyle(item.id)
                        }
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
                  ACTION
              ========================== */}
              <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  asChild
                >
                  <Link href="/">
                    Cancel
                  </Link>
                </Button>

                <Button
                  size="lg"
                  className="gap-2"
                  onClick={handleGeneratePoster}
                >
                  Generate Poster
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* =========================
              RIGHT SIDEBAR
          ========================== */}
          <div className="space-y-6">
            {/* AI Preview */}
            <Card className="overflow-hidden border-border/60">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  AI Generation
                </CardTitle>
              </CardHeader>

              <CardContent>
                <div className="rounded-2xl border bg-muted/30 p-6">
                  <div className="mx-auto flex aspect-[4/5] max-w-[240px] flex-col items-center justify-center rounded-xl border bg-background p-6 text-center shadow-sm">
                    {photo ? (
                      <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-4 border-primary/20">
                        <Image
                          src={photo}
                          alt="Poster preview"
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
                      {name || "Poster Preview"}
                    </p>

                    <p className="mt-2 text-xs leading-5 text-muted-foreground">
                      {occasion
                        ? `${occasion} poster`
                        : "Your generated poster preview will appear here."}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">
                  Tips for a better poster
                </CardTitle>
              </CardHeader>

              <CardContent>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Use a clear, high-resolution portrait
                    photo.
                  </li>

                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Keep the main message short and
                    readable.
                  </li>

                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    Add the correct date and location when
                    relevant.
                  </li>

                  <li className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    You can refine the generated design
                    before exporting.
                  </li>
                </ul>
              </CardContent>
            </Card>

            {/* Current Selection */}
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">
                  Current Selection
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    Occasion
                  </span>

                  <span className="font-medium">
                    {occasion || "Not selected"}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    Style
                  </span>

                  <span className="font-medium capitalize">
                    {style}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-muted-foreground">
                    Photo
                  </span>

                  <span className="font-medium">
                    {photo ? "Uploaded" : "Not uploaded"}
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
