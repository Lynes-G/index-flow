import { AccentPill } from "@/components/marketing/accent-pill";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

function ClosingPanel() {
  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[2.5rem] border border-slate-200/80 bg-white/95 shadow-[0_30px_100px_rgba(15,23,42,0.08)]">
        <div className="template-noise relative overflow-hidden px-6 py-10 sm:px-8 sm:py-12 lg:px-12">
          <div className="template-glow-ring template-pulse top-10 right-[10%] h-52 w-52 bg-[rgba(251,176,59,0.25)]" />
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-5">
              <AccentPill>Start your journey</AccentPill>
              <div className="max-w-3xl space-y-3">
                <h2 className="max-w-3xl font-['Sora',sans-serif] text-4xl leading-[0.95] font-semibold tracking-[-0.07em] text-slate-900 sm:text-5xl lg:text-[3.6rem]">
                  Build a bio page people want to tap.
                </h2>
                <p className="max-w-xl text-lg leading-8 text-slate-600">
                  Launch fast, feature the right link, and see what gets the
                  click.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                {[
                  "Free to start",
                  "Themes included",
                  "Live click tracking",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-(--brand-accent)" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              asChild
              size="lg"
              className="h-auto rounded-full bg-(--brand-accent) px-6 py-4 text-base font-semibold text-[#111216] hover:bg-[#ffc868]"
            >
              <Link href="/dashboard">
                Start your page
                <ArrowRight className="size-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { ClosingPanel };
