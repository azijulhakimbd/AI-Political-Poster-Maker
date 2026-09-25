import { ArrowRight, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export default function CTA() {
  return (
    <section className="px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-primary px-6 py-16 text-primary-foreground sm:px-12">
        <div className="mx-auto max-w-3xl text-center">
          <Sparkles className="mx-auto mb-5 size-8" />

          <h2 className="text-3xl font-black tracking-tight sm:text-5xl">
            Ready to create your poster?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 opacity-80 sm:text-base">
            Start with your information, choose a visual style and build
            your poster in a simple guided workflow.
          </p>

          <Button
            size="lg"
            variant="secondary"
            className="mt-8"
            asChild
          >
            <Link href="/create">
              Create Poster
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}