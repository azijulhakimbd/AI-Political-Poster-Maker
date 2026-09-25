import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import HeroPoster from "./HeroPoster";

export default function Hero() {
  return (
    <section className="relative isolate border-b">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/0.15),transparent_45%)]" />

      <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-20 sm:px-6 md:py-28 lg:grid-cols-2 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Badge variant="secondary" className="mb-6 gap-2 px-3 py-1">
            <Sparkles className="size-3.5" />
            AI-assisted poster creation
          </Badge>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight sm:text-5xl lg:text-7xl">
            Create professional posters
            <span className="block text-primary">
              with AI assistance.
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
            Build campaign, event, victory and tribute posters using
            structured templates, your own content and AI-assisted
            composition.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button size="lg" asChild>
              <Link href="/create">
                Start Creating
                <ArrowRight />
              </Link>
            </Button>

            <Button size="lg" variant="outline" asChild>
              <Link href="#templates">
                Explore Templates
              </Link>
            </Button>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              Easy to use
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              Editable layouts
            </span>

            <span className="flex items-center gap-2">
              <CheckCircle2 className="size-4 text-primary" />
              Export ready
            </span>
          </div>
        </motion.div>

        <HeroPoster />
      </div>
    </section>
  );
}