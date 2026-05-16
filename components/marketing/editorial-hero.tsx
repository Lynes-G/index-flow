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

const logos = [
  "Creator Stack",
  "Studio Grid",
  "Launchboard",
  "Signal Loop",
  "Campaign Kit",
  "Audience Lab",
];

const trustChips = [
  "Custom themes",
  "Featured links",
  "Live analytics",
];

function EditorialHero() {
  return (
    <section className="template-shell template-noise relative overflow-hidden px-4 pt-10 pb-16 sm:px-6 lg:px-8 lg:pt-16 lg:pb-24">
      <div className="absolute inset-0 opacity-70">
        <RippleGrid
          className="motion-reduce:hidden"
          gridColor="#f6c266"
          rippleIntensity={0.04}
          gridSize={19}
          gridThickness={18}
          fadeDistance={1.9}
          vignetteStrength={2.4}
          glowIntensity={0.12}
          opacity={0.65}
          gridRotation={0}
          mouseInteraction={true}
          mouseInteractionRadius={1.1}
        />
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(255,255,255,0.08)_42%,rgba(255,248,235,0.58)_100%)]" />
      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
        <div className="space-y-8">
          <div className="space-y-5">
            <AccentPill>Now shipping a sharper public profile</AccentPill>
            <div className="space-y-5">
              <h1 className="max-w-3xl font-['Sora',sans-serif] text-5xl leading-[0.94] font-semibold tracking-[-0.07em] text-slate-900 sm:text-6xl lg:text-[4.75rem]">
                Build a bio page
                <span className="block text-[color:var(--brand-accent)]">
                  people want to tap.
                </span>
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-slate-600 sm:text-xl">
                Launch featured links, shape the vibe, and track every click in
                one playful profile.
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
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

          <div className="flex flex-wrap gap-3">
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

        <div className="relative">
          <div className="template-float motion-reduce:animate-none editorial-surface relative overflow-hidden rounded-[2rem] p-4 sm:p-5">
            <div className="editorial-grid absolute inset-0 opacity-30" />
            <div className="relative overflow-hidden rounded-[1.6rem] border border-slate-200/80 bg-white shadow-[0_24px_90px_rgba(15,23,42,0.12)]">
              <div className="flex items-center justify-between border-b border-slate-200/80 px-4 py-4 sm:px-5">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-[rgba(251,176,59,0.12)] p-2">
                    <Image
                      src="/indexflow-dark-icon.svg"
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
                <div className="rounded-full bg-[rgba(251,176,59,0.12)] px-3 py-1 text-xs font-semibold text-[color:var(--brand-accent-strong)]">
                  Live
                </div>
              </div>

              <div className="grid gap-4 p-4 sm:grid-cols-[0.8fr_1.2fr] sm:p-5">
                <div className="template-card relative rounded-[1.65rem] p-4 text-slate-900 sm:p-5">
                  <div className="absolute top-4 right-4 rounded-full bg-[rgba(251,176,59,0.14)] px-3 py-1 text-[11px] font-semibold tracking-[0.18em] text-[color:var(--brand-accent-strong)] uppercase">
                    Featured
                  </div>
                  <p className="text-xs tracking-[0.2em] text-slate-500 uppercase">
                    Public profile
                  </p>
                  <h2 className="mt-3 font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.05em]">
                    @indexflow
                  </h2>
                  <p className="mt-2 max-w-xs text-sm leading-6 text-slate-600">
                    One bright page for new drops, top links, and the next step
                    you want visitors to take.
                  </p>

                  <div className="mt-5 rounded-[1.35rem] bg-[linear-gradient(135deg,#fff8e6,#fffdf8_55%,#f7fafc)] p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-12 items-center justify-center rounded-[1.25rem] bg-[linear-gradient(135deg,#fbb03b,#ffdf9d)] text-[#111216] shadow-[0_12px_30px_rgba(251,176,59,0.28)]">
                          <Sparkles className="size-5" />
                        </div>
                        <div>
                          <p className="font-medium">Spring launch pack</p>
                          <p className="text-sm text-slate-500">
                            Put your biggest link first.
                          </p>
                        </div>
                      </div>
                      <div className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm">
                        3 links live
                      </div>
                    </div>

                    <div className="mt-4 space-y-2.5">
                      {[
                        "Shop the featured drop",
                        "Watch the 40-sec walkthrough",
                        "Book a brand collab",
                      ].map((item, index) => (
                        <div
                          key={item}
                          className={`rounded-2xl border px-4 py-3 text-sm shadow-sm ${
                            index === 0
                              ? "border-[rgba(251,176,59,0.38)] bg-white font-semibold text-slate-900"
                              : "border-slate-200/80 bg-white/80 text-slate-700"
                          }`}
                        >
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 flex items-center justify-between rounded-2xl bg-white/80 px-4 py-3 text-sm text-slate-600">
                      <span>Tap flow tuned for mobile visitors</span>
                      <span className="font-semibold text-slate-900">Fast</span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 content-start">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-[1.5rem] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                      <div className="flex items-center gap-3 text-[color:var(--brand-accent-strong)]">
                        <Palette className="size-4" />
                        <span className="text-sm font-semibold">
                          Theme switch
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-slate-600">
                        Swap colors and mood without touching your links.
                      </p>
                      <div className="mt-4 flex gap-2">
                        {["#fbb03b", "#111216", "#ffedd1", "#f8fafc"].map(
                          (color) => (
                            <span
                              key={color}
                              className="size-8 rounded-full border border-slate-200"
                              style={{ backgroundColor: color }}
                            />
                          ),
                        )}
                      </div>
                    </div>

                    <div className="rounded-[1.5rem] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                      <div className="flex items-center gap-3 text-[color:var(--brand-accent-strong)]">
                        <BarChart3 className="size-4" />
                        <span className="text-sm font-semibold">
                          Live clicks
                        </span>
                      </div>
                      <p className="mt-3 text-3xl font-semibold tracking-[-0.04em] text-slate-900">
                        2,481
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        This week across featured links.
                      </p>
                      <div className="mt-4 flex h-18 items-end gap-2">
                        {[18, 34, 28, 45, 52, 40].map((height) => (
                          <span
                            key={height}
                            className="flex-1 rounded-t-full bg-[linear-gradient(180deg,#fbb03b,#e18c1d)]"
                            style={{ height }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
                    <div className="rounded-[1.5rem] border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] p-4 shadow-[0_20px_50px_rgba(15,23,42,0.08)]">
                      <div className="flex items-center gap-3 text-[color:var(--brand-accent-strong)]">
                        <Globe2 className="size-4" />
                        <span className="text-sm font-semibold">
                          Audience pulse
                        </span>
                      </div>
                      <div className="mt-4 space-y-3">
                        {[
                          { label: "United States", value: "44%" },
                          { label: "United Kingdom", value: "18%" },
                          { label: "Germany", value: "12%" },
                        ].map((item) => (
                          <div key={item.label} className="space-y-1.5">
                            <div className="flex justify-between text-sm text-slate-600">
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
                    </div>

                    <div className="template-accent-card rounded-[1.5rem] p-4">
                      <div className="flex items-center gap-3">
                        <Link2 className="size-4" />
                        <span className="text-sm font-semibold">
                          Product-led first impression
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-6 text-[#2b1d07]">
                        Guide visitors to the one action that matters, then let
                        the rest of your links support the story.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative mx-auto mt-10 max-w-6xl overflow-hidden">
        <div className="template-marquee motion-reduce:animate-none flex min-w-max gap-3">
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
    </section>
  );
}

export { EditorialHero };
