import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
            <Sparkles className="size-5" />
          </div>

          <div>
            <p className="font-bold leading-none">
              Poster<span className="text-primary">AI</span>
            </p>
            <p className="mt-1 text-[10px] text-muted-foreground">
              AI Poster Maker
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 text-sm md:flex">
          <Link
            href="#templates"
            className="text-muted-foreground transition hover:text-foreground"
          >
            Templates
          </Link>

          <Link
            href="#features"
            className="text-muted-foreground transition hover:text-foreground"
          >
            Features
          </Link>

          <Link
            href="#types"
            className="text-muted-foreground transition hover:text-foreground"
          >
            Poster Types
          </Link>
        </nav>

        <Button asChild>
          <Link href="/create">
            Create Poster
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </header>
  );
}