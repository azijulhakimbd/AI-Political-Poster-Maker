import { motion } from "framer-motion";
import {
  ArrowRight,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { Card } from "../ui/card";
const posterTypes = [
  {
    title: "Campaign Poster",
    description: "Create clean campaign and public-awareness designs.",
    icon: MegaphoneIcon,
  },
  {
    title: "Victory Poster",
    description: "Celebrate election results and special occasions.",
    icon: Crown,
  },
  {
    title: "Tribute Poster",
    description: "Create respectful tribute and remembrance designs.",
    icon: HeartIcon,
  },
  {
    title: "Event Poster",
    description: "Promote meetings, programs and public events.",
    icon: CalendarIcon,
  },
];
export default function PosterTypes() {
  return (
    <section id="types" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Poster Types"
          title="Start with the poster you need"
          description="Choose a format and customize the content, imagery and visual style."
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {posterTypes.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
              >
                <Link href="/create">
                  <Card className="group h-full transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                    <div className="p-6">
                      <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                        <Icon className="size-5" />
                      </div>

                      <h3 className="font-semibold">{item.title}</h3>

                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>

                      <div className="mt-5 flex items-center text-sm font-medium text-primary">
                        Create
                        <ArrowRight className="ml-1 size-4 transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
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

function MegaphoneIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 11 18-5v12L3 14v-3Z" />
      <path d="M11.6 16.7 13 21" />
      <path d="M5 11v3" />
    </svg>
  );
}

function HeartIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.8 8.6c0 5.5-8.8 11-8.8 11s-8.8-5.5-8.8-11A4.6 4.6 0 0 1 12 6.2a4.6 4.6 0 0 1 8.8 2.4Z" />
    </svg>
  );
}

function CalendarIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      {...props}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}