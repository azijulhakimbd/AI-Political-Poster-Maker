import Link from "next/link";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";


const templates = [
  {
    id: "modern-green",
    name: "Modern Green",
    type: "Campaign",
    className:
      "from-emerald-950 via-emerald-700 to-lime-500",
    accent: "জনগণের পাশে",
  },
  {
    id: "tribute-dark",
    name: "Tribute Dark",
    type: "Tribute",
    className:
      "from-zinc-950 via-zinc-800 to-zinc-600",
    accent: "শ্রদ্ধাঞ্জলি",
  },
  {
    id: "victory-red",
    name: "Victory",
    type: "Victory",
    className:
      "from-red-950 via-red-700 to-orange-500",
    accent: "অভিনন্দন",
  },
];
export default function TemplateSection() {
  return (
    <section id="templates" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <SectionHeading
            eyebrow="Templates"
            title="Designed to get you started"
            description="Choose a visual direction and customize it with your own information."
          />

          <Button variant="outline" asChild>
            <Link href="/templates">
              View all templates
              <ArrowRight />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {templates.map((template, index) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href="/create">
                <Card className="group overflow-hidden">
                  <div
                    className={`relative aspect-[4/5] bg-gradient-to-br ${template.className}`}
                  >
                    <div className="absolute inset-0 bg-black/10" />

                    <div className="relative flex h-full flex-col justify-between p-6 text-white">
                      <div className="flex justify-between">
                        <Badge className="border-white/20 bg-white/15 text-white backdrop-blur">
                          {template.type}
                        </Badge>

                        <Sparkles className="size-5 text-white/80" />
                      </div>

                      <div>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                          AI Poster Studio
                        </p>

                        <h3 className="mt-2 text-3xl font-black">
                          {template.accent}
                        </h3>

                        <div className="mt-5 flex items-center gap-3">
                          <div className="size-14 rounded-full border-2 border-white/50 bg-white/15" />

                          <div>
                            <p className="font-bold">আপনার নাম</p>
                            <p className="text-xs text-white/70">
                              আপনার পদবি
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-5">
                    <div>
                      <h3 className="font-semibold">
                        {template.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground">
                        4:5 poster format
                      </p>
                    </div>

                    <div className="flex size-9 items-center justify-center rounded-full border transition group-hover:bg-primary group-hover:text-primary-foreground">
                      <ArrowRight className="size-4" />
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="max-w-2xl">
      <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
        {eyebrow}
      </p>

      <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
        {title}
      </h2>

      <p className="mt-4 text-sm leading-6 text-muted-foreground sm:text-base">
        {description}
      </p>
    </div>
  );
}