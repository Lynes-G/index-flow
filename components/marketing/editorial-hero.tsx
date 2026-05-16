import { AccentPill } from "@/components/marketing/accent-pill";
import RippleGrid from "@/components/marketing/ripple-grid";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BarChart3,
  Globe2,
  Link2,
  Palette,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode } from "react";

const logos = [
  "Creator Stack",
  "Studio Grid",
  "Launchboard",
  "Signal Loop",
  "Campaign Kit",
  "Audience Lab",
];

const trustChips = ["Custom themes", "Featured links", "Live analytics"];

const audienceItems = [
  { label: "United States", value: "44%" },
  { label: "United Kingdom", value: "18%" },
  { label: "Germany", value: "12%" },
];

const featuredLinks = [
  "Shop the featured drop",
  "Watch the 40-sec walkthrough",
  "Book a brand collab",
];

const bentoCardClassName =
  "group relative overflow-hidden rounded-[1.7rem] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] p-5 shadow-[0_24px_60px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_30px_70px_rgba(15,23,42,0.12)] motion-reduce:transition-none motion-reduce:hover:translate-y-0";

function InsightCard({
  icon,
  title,
  children,
  className = "",
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`${bentoCardClassName} ${className}`}>
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(251,176,59,0.55),transparent)] opacity-60" />
      <div className="flex items-center gap-3 text-[color:var(--brand-accent-ink)]">
        {icon}
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function EditorialHero() {
  return (
    <section className="template-shell template-noise relative overflow-hidden px-4 pt-10 pb-16 sm:px-6 lg:px-8 lg:pt-30 lg:pb-24">
      <div className="absolute inset-0 z-0">
        <RippleGrid
          className="motion-reduce:hidden"
          gridColor="#f6c266"
          rippleIntensity={0.01}
          gridSize={45}
          gridThickness={22}
          fadeDistance={0.2}
          vignetteStrength={4.4}
          glowIntensity={4.8}
          opacity={0.25}
          gridRotation={0}
          mouseInteraction
          mouseInteractionRadius={2.1}
          enableRainbow
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto flex max-w-4xl flex-col items-start gap-8 lg:items-center lg:text-center">
          <div className="space-y-5">
            <AccentPill>Now shipping a sharper public profile</AccentPill>
            <div className="space-y-5">
              <h1 className="max-w-3xl font-['Sora',sans-serif] text-5xl leading-[0.94] font-semibold tracking-[-0.07em] text-slate-900 sm:text-6xl lg:text-[4.75rem]">
                Build a bio page
                <span className="block text-[color:var(--brand-accent)]">
                  people want to tap.
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl lg:mx-auto">
                Launch featured links, shape the vibe, and track every click in
                one playful profile.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center lg:items-center">
            <Button
              asChild
              size="lg"
              className="h-auto rounded-full bg-[color:var(--brand-accent)] px-6 py-4 text-base font-semibold text-[#111216] shadow-[0_18px_40px_rgba(251,176,59,0.28)] hover:bg-[#ffc868]"
            >
              <Link href="/dashboard">
                Start your page
                <ArrowRight className="size-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-auto rounded-full border-slate-200 bg-white px-6 py-4 text-base font-semibold text-slate-700 hover:border-[color:var(--brand-accent)] hover:bg-[rgba(251,176,59,0.08)] hover:text-slate-900"
            >
              <Link href="#how-it-works">See how it works</Link>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 lg:justify-center">
            {trustChips.map((item) => (
              <div
                key={item}
                className="rounded-full border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.98))] px-4 py-2 text-sm text-slate-700 shadow-[0_12px_30px_rgba(15,23,42,0.05)]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 lg:mt-20">
          <div className="mx-auto max-w-3xl text-left lg:text-center">
            <p className="text-xs font-semibold tracking-[0.24em] text-[color:var(--brand-accent-ink)] uppercase">
              Dashboard showcase
            </p>
            <h2 className="mt-4 font-['Sora',sans-serif] text-3xl font-semibold tracking-[-0.06em] text-slate-900 sm:text-4xl">
              Give the product room to sell itself.
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 lg:mx-auto">
              Your hero makes the promise. This preview becomes the proof with a
              clearer story, stronger hierarchy, and a calmer layout.
            </p>
          </div>

          <div className="template-float editorial-surface relative mt-8 overflow-hidden rounded-[2.25rem] p-4 motion-reduce:animate-none sm:p-6 lg:mt-10 lg:p-7">
            <div className="editorial-grid absolute inset-0 opacity-30" />
            <div className="relative overflow-hidden rounded-[1.85rem] border border-slate-200/80 bg-white shadow-[0_32px_110px_rgba(15,23,42,0.12)]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 px-5 py-5 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[rgba(251,176,59,0.12)] p-2">
                    <Image
                      src="/indexflow-light-icon.svg"
                      alt="IndexFlow"
                      width={24}
                      height={24}
                      className="size-6"
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      Dashboard preview
                    </p>
                    <p className="text-xs tracking-[0.18em] text-slate-500 uppercase">
                      IndexFlow control surface
                    </p>
                  </div>
                </div>
                <div className="rounded-full bg-[rgba(251,176,59,0.12)] px-3 py-1 text-xs font-semibold text-[color:var(--brand-accent-ink)]">
                  Live
                </div>
              </div>

              <div className="grid gap-6 p-5 lg:grid-cols-[1.05fr_0.95fr] lg:gap-7 lg:p-7">
                <div className="template-card relative rounded-[1.9rem] p-5 text-slate-900 shadow-[0_28px_70px_rgba(15,23,42,0.08)] transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:p-6 lg:min-h-[34rem]">
                  <div className="absolute top-5 right-5 rounded-full bg-[rgba(251,176,59,0.14)] px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[color:var(--brand-accent-ink)] uppercase">
                    Featured
                  </div>
                  <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
                    Public profile
                  </p>
                  <h3 className="mt-3 font-['Sora',sans-serif] text-3xl font-semibold tracking-[-0.05em]">
                    @indexflow
                  </h3>
                  <p className="mt-3 max-w-sm text-base leading-7 text-slate-600">
                    One bright page for new drops, top links, and the next step
                    you want visitors to take.
                  </p>

                  <div className="mt-7 rounded-[1.6rem] bg-[linear-gradient(135deg,#fff8e6,#fffdf8_55%,#f7fafc)] p-5 sm:p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-13 items-center justify-center rounded-[1.35rem] bg-[linear-gradient(135deg,#fbb03b,#ffdf9d)] text-[#111216] shadow-[0_12px_30px_rgba(251,176,59,0.28)]">
                          <Sparkles className="size-5" />
                        </div>
                        <div>
                          <p className="text-lg font-medium">
                            Spring launch pack
                          </p>
                          <p className="text-sm text-slate-500">
                            Put your biggest link first.
                          </p>
                        </div>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm">
                        3 links live
                      </div>
                    </div>

                    <div className="mt-6 space-y-3">
                      {featuredLinks.map((item, index) => (
                        <div
                          key={item}
                          className={`rounded-2xl border px-4 py-3.5 text-sm shadow-sm transition-colors ${
                            index === 0
                              ? "border-[rgba(251,176,59,0.38)] bg-white font-semibold text-slate-900"
                              : "border-slate-200/80 bg-white/85 text-slate-700"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4 rounded-2xl bg-white/80 px-4 py-3.5 text-sm text-slate-600">
                      <span>Tap flow tuned for mobile visitors</span>
                      <span className="font-semibold text-slate-900">Fast</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                  <InsightCard
                    icon={<Palette className="size-4" />}
                    title="Theme switch"
                    className="min-h-56"
                  >
                    <p className="text-sm leading-7 text-slate-600">
                      Swap colors and mood without touching your links.
                    </p>
                    <div className="mt-6 flex gap-3">
                      {["#fbb03b", "#111216", "#ffedd1", "#f8fafc"].map(
                        (color) => (
                          <span
                            key={color}
                            className="size-10 rounded-full border border-slate-200 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ),
                      )}
                    </div>
                  </InsightCard>

                  <InsightCard
                    icon={<BarChart3 className="size-4" />}
                    title="Live clicks"
                    className="min-h-56"
                  >
                    <p className="text-4xl font-semibold tracking-[-0.05em] text-slate-900">
                      2,481
                    </p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      This week across featured links.
                    </p>
                    <div className="mt-6 flex h-24 items-end gap-2">
                      {[18, 34, 28, 45, 52, 40].map((height) => (
                        <span
                          key={height}
                          className="flex-1 rounded-t-full bg-[linear-gradient(180deg,#fbb03b,#e18c1d)]"
                          style={{ height }}
                        />
                      ))}
                    </div>
                  </InsightCard>

                  <InsightCard
                    icon={<Globe2 className="size-4" />}
                    title="Audience pulse"
                    className="min-h-60"
                  >
                    <div className="space-y-4">
                      {audienceItems.map((item) => (
                        <div key={item.label} className="space-y-2">
                          <div className="flex justify-between gap-4 text-sm text-slate-600">
                            <span>{item.label}</span>
                            <span>{item.value}</span>
                          </div>
                          <div className="h-2 rounded-full bg-slate-200">
                            <div
                              className="h-2 rounded-full bg-[linear-gradient(90deg,#fbb03b,#ffde9c)]"
                              style={{ width: item.value }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </InsightCard>

                  <div className="template-accent-card relative overflow-hidden rounded-[1.7rem] p-5 shadow-[0_28px_65px_rgba(251,176,59,0.28)] transition-transform duration-300 ease-out hover:-translate-y-1 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:min-h-60">
                    <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.8),transparent)]" />
                    <div className="flex items-center gap-3">
                      <Link2 className="size-4" />
                      <span className="text-sm font-semibold">
                        Product-led first impression
                      </span>
                    </div>
                    <p className="mt-4 text-base leading-8 text-[#2b1d07]">
                      Guide visitors to the one action that matters, then let
                      the rest of your links support the story.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mx-auto mt-10 max-w-6xl overflow-hidden lg:mt-14">
          <div className="template-marquee flex min-w-max gap-3 motion-reduce:animate-none">
            {[...logos, ...logos].map((logo, index) => (
              <div
                key={`${logo}-${index}`}
                className="template-card rounded-full px-5 py-2.5 text-sm font-medium text-slate-700"
              >
                {logo}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export { EditorialHero };
