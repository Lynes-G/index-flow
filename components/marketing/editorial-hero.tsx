import LogoCloud from "@/components/marketing/logo-cloud";
import { AccentPill } from "@/components/marketing/accent-pill";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { AppDashboardPreview } from "./app-dashboard-preview";

const trustChips = ["Custom themes", "Featured links", "Built-in analytics"];

const trustChipClassName =
  "text-brand-eggplant rounded-lg border border-[color:color-mix(in_srgb,var(--brand-eggplant)_24%,transparent)] bg-white/80 px-4 py-2 text-center text-sm font-semibold shadow-sm";

const secondaryHeroButtonClassName =
  "shadow-brand-purple-lg bg-button-secondary text-button-secondary-foreground hover:bg-button-secondary-hover w-full border-2 font-black uppercase sm:w-auto";

function EditorialHero() {
  return (
    <section className="landing-hero-band relative overflow-hidden px-4 pt-26 pb-16 sm:px-6 sm:pt-30 lg:px-8 lg:pt-35 lg:pb-24">
      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto flex w-full max-w-4xl min-w-0 flex-col items-start gap-8 overflow-hidden lg:items-center lg:text-center">
          <div className="w-full min-w-0 space-y-8 py-2">
            <AccentPill className="w-full max-w-[calc(100vw-2rem)] sm:w-fit">
              Built for creators, freelancers, and small brands
            </AccentPill>
            <div className="space-y-5">
              <h1 className="riso-offset-text max-w-[calc(100vw-2rem)] font-['Sora',sans-serif] text-[1.78rem] leading-[1.16] font-black tracking-normal text-wrap text-slate-950 uppercase min-[430px]:text-[2.25rem] sm:max-w-3xl sm:text-6xl sm:leading-[0.96] lg:text-[4.75rem]">
                <span className="block sm:inline">Everything you</span>{" "}
                <span className="block sm:inline">share,</span>
                <span className="text-brand-purple block sm:mt-0">
                  in one bold
                </span>
                <span className="text-brand-purple block">page.</span>
              </h1>
              <p className="w-full max-w-[calc(100vw-2rem)] text-lg leading-8 font-medium text-[color-mix(in_srgb,var(--brand-eggplant)_82%,white)] sm:max-w-2xl sm:text-xl lg:mx-auto">
                IndexFlow gives you one clean bio page for socials, offers,
                products, and updates, then shows which links actually move
                people forward.
              </p>
            </div>
          </div>

          <div className="flex w-full max-w-[calc(100vw-2rem)] flex-col items-stretch gap-3 sm:w-auto sm:max-w-none sm:flex-row sm:items-center lg:items-center">
            <Button
              asChild
              size="hero"
              className="w-full font-black uppercase sm:w-auto"
            >
              <Link href="/dashboard">
                Start for free
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="hero"
              variant="outline"
              className={secondaryHeroButtonClassName}
            >
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          <div className="grid w-full max-w-[calc(100vw-2rem)] grid-cols-1 gap-3 py-4 sm:w-auto sm:max-w-full sm:grid-cols-3 lg:flex lg:flex-wrap lg:justify-center">
            {trustChips.map((item) => (
              <div key={item} className={trustChipClassName}>
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 lg:mt-20">
          <div className="mx-auto max-w-3xl text-left lg:text-center">
            <p className="text-brand-primary-ink text-xs font-semibold tracking-[0.24em] uppercase">
              Product preview
            </p>
            <h2 className="mt-4 max-w-full font-['Sora',sans-serif] text-2xl font-black tracking-normal text-wrap text-slate-950 uppercase sm:text-4xl">
              Show the page first, then show the control.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 lg:mx-auto">
              A strong landing page answers two fast questions: what your
              audience sees, and how easily you can manage it.
            </p>
          </div>
        </div>
        <AppDashboardPreview />
        <LogoCloud embedded className="mx-auto mt-10 max-w-6xl lg:mt-14" />
      </div>
    </section>
  );
}

export { EditorialHero };
