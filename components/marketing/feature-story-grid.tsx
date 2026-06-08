import { AccentPill } from "@/components/marketing/accent-pill";
import { SectionShell } from "@/components/marketing/section-shell";
import {
  BarChart3,
  LayoutTemplate,
  MousePointerClick,
  Smartphone,
} from "lucide-react";

const featureCards = [
  {
    icon: LayoutTemplate,
    title: "Lead with one clear action.",
    description:
      "Put the launch, offer, or update that matters most at the top.",
  },
  {
    icon: BarChart3,
    title: "See what earns the click.",
    description: "Track top links, places, and traffic shifts after each push.",
  },
  {
    icon: Smartphone,
    title: "Designed for fast mobile scanning.",
    description:
      "Keep the page clean, fast, and easy to tap on the screens that matter.",
  },
];

function FeatureStoryGrid() {
  return (
    <SectionShell
      eyebrow="Product system"
      title="Simple enough to scan. Flexible enough to grow."
      description="Borrow the strongest idea from high-converting bio pages: make the next move obvious, then improve it with real feedback."
      className="landing-band-cool relative"
    >
      <div
        id="feature-story"
        className="grid scroll-mt-28 gap-6 lg:grid-cols-[1.02fr_0.98fr]"
      >
        <article className="template-accent-card rounded-lg p-6 sm:p-8">
          <AccentPill className="border-black/10 bg-white/25 text-(--brand-eggplant)">
            Conversion flow
          </AccentPill>
          <div className="mt-6 space-y-4">
            <h3 className="font-['Sora',sans-serif] text-3xl font-black tracking-normal uppercase sm:text-4xl">
              Start with one clear destination. Let the rest of the page support
              it.
            </h3>
            <p className="max-w-2xl text-base leading-7 text-[color-mix(in_srgb,var(--brand-eggplant)_82%,white)] sm:text-lg">
              Set the page, spotlight the priority, and use click data to make
              the next pass smarter instead of busier.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="marketing-feature-mini-card p-5">
              <p className="text-sm font-semibold">Promote the priority</p>
              <p className="mt-2 text-sm leading-6 text-[color-mix(in_srgb,var(--brand-eggplant)_78%,white)]">
                Move the current launch to the top without reshuffling
                everything else.
              </p>
            </div>
            <div className="marketing-feature-mini-card p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MousePointerClick className="size-4" />
                Measure the pull
              </div>
              <p className="mt-2 text-sm leading-6 text-[color-mix(in_srgb,var(--brand-eggplant)_78%,white)]">
                See whether visitors follow the spotlight, then adjust with
                confidence.
              </p>
            </div>
          </div>
        </article>

        <div className="grid gap-6">
          {featureCards.map((card) => {
            const Icon = card.icon;

            return (
              <article
                key={card.title}
                className="template-card rounded-lg p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="bg-brand-primary-soft text-brand-primary-ink shadow-brand-neon-sm border-brand-eggplant flex size-12 items-center justify-center rounded-lg border-2">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-['Sora',sans-serif] text-2xl font-black tracking-normal text-slate-900">
                      {card.title}
                    </h3>
                    <p className="text-sm leading-7 text-slate-600 sm:text-base">
                      {card.description}
                    </p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </SectionShell>
  );
}

export { FeatureStoryGrid };
