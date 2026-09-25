import { ImageIcon, Sparkles, WandSparkles } from "lucide-react";
import { motion } from "framer-motion";
export default function HeroPoster() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, rotate: 2 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.15 }}
      className="relative mx-auto w-full max-w-md"
    >
      <div className="absolute -inset-10 -z-10 rounded-full bg-primary/15 blur-3xl" />

      <div className="overflow-hidden rounded-[2rem] border bg-card p-3 shadow-2xl">
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem] bg-gradient-to-br from-emerald-950 via-emerald-700 to-lime-500">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,white/20%,transparent_25%),radial-gradient(circle_at_80%_80%,black/20%,transparent_30%)]" />

          <div className="relative flex h-full flex-col justify-between p-7 text-white">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/75">
                <Sparkles className="size-4" />
                AI Poster Studio
              </div>

              <div className="mt-14">
                <p className="text-sm font-medium text-white/75">
                  আপনার বার্তা
                </p>

                <h2 className="mt-2 text-4xl font-black leading-none sm:text-5xl">
                  জনগণের
                  <br />
                  পাশে
                </h2>

                <p className="mt-4 max-w-[220px] text-sm leading-6 text-white/80">
                  আধুনিক ডিজাইন, পরিষ্কার বার্তা এবং সহজ সম্পাদনা।
                </p>
              </div>
            </div>

            <div className="flex items-end justify-between">
              <div>
                <p className="text-lg font-bold">আপনার নাম</p>
                <p className="text-xs text-white/70">
                  সংগঠন / পদবি
                </p>
              </div>

              <div className="flex size-20 items-center justify-center rounded-full border-4 border-white/50 bg-white/15 backdrop-blur">
                <ImageIcon className="size-8 text-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute -right-4 top-16 hidden rounded-2xl border bg-card p-3 shadow-xl sm:block">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10">
            <WandSparkles className="size-5 text-primary" />
          </div>

          <div>
            <p className="text-xs font-semibold">AI Composition</p>
            <p className="text-[11px] text-muted-foreground">
              Layout ready
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
