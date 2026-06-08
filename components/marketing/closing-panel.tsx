import { AccentPill } from "@/components/marketing/accent-pill";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const closingBenefits = [
  "Free to start",
  "Themes included",
  "Live click tracking",
];

const closingPanelClassName =
  "riso-rough-border mx-auto max-w-6xl overflow-hidden rounded-lg bg-[linear-gradient(135deg,#2a0f1f,#3b152a_48%,#b1407f)] shadow-[10px_10px_0_var(--brand-neon)]";

const closingActionClassName =
  "shadow-brand-purple-lg w-full border-white font-black uppercase sm:w-auto";

function ClosingPanel() {
  return (
    <section className="landing-band-warm px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className={closingPanelClassName}>
        <div className="template-noise relative overflow-hidden px-5 py-9 sm:px-8 sm:py-12 lg:px-12">
          <div className="relative grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <div className="space-y-5">
              <AccentPill className="border-white/20 bg-white/10 text-white">
                Ready to launch
              </AccentPill>
              <div className="max-w-3xl space-y-3">
                <h2 className="max-w-3xl font-['Sora',sans-serif] text-[2.55rem] leading-[0.95] font-black tracking-normal text-white uppercase sm:text-5xl lg:text-[3.6rem]">
                  Build one page that brings your links together.
                </h2>
                <p className="max-w-xl text-lg leading-8 text-white/78">
                  Launch fast, guide the next action clearly, and learn what
                  people actually tap.
                </p>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-white/78">
                {closingBenefits.map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckCircle2 className="text-brand-primary size-4" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button
              asChild
              size="hero"
              variant="secondary"
              className={closingActionClassName}
            >
              <Link href="/dashboard">
                Start for free
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
