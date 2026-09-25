import { Layers3, Palette, WandSparkles, Zap } from "lucide-react";
import { motion } from "framer-motion";
const features = [
  {
    icon: WandSparkles,
    title: "AI-Assisted Design",
    description:
      "Turn your information into a structured poster composition with AI assistance.",
  },
  {
    icon: Palette,
    title: "Professional Templates",
    description:
      "Start with polished layouts designed for common poster formats.",
  },
  {
    icon: Layers3,
    title: "Easy Editing",
    description:
      "Fine-tune text, photos, colors and layout before exporting.",
  },
  {
    icon: Zap,
    title: "Fast Export",
    description:
      "Prepare high-resolution designs suitable for digital sharing and printing.",
  },
];
export default function Features() {
  return (
    <section id="features" className="border-y bg-muted/30 py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Everything you need to build a poster"
          description="A focused workflow from idea to finished design."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className="flex gap-5 rounded-2xl border bg-background p-6"
              >
                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="size-5" />
                </div>

                <div>
                  <h3 className="font-semibold">{feature.title}</h3>

                  <p className="mt-2 text-sm leading-6 text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
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