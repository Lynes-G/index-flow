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
    title: "Lead with the right link.",
    description: "Pin the launch, offer, or update you want seen first.",
  },
  {
    icon: BarChart3,
    title: "See what gets the click.",
    description: "Track top links, regions, and shifts after every push.",
  },
  {
    icon: Smartphone,
    title: "Built for the mobile tap.",
    description: "Stay fast, clean, and easy to scan on the screens that matter.",
  },
];

function FeatureStoryGrid() {
  return (
    <SectionShell
      eyebrow="Product system"
      title="Highlight. Learn. Adjust."
      description="Keep the page focused, the links organized, and the next move obvious."
      className="relative"
    >
      <div
        id="feature-story"
        className="scroll-mt-28 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]"
      >
        <article className="template-accent-card rounded-[2rem] p-6 sm:p-8">
          <AccentPill className="border-black/10 bg-black/6 text-[#2a1d08]">
            Featured workflow
          </AccentPill>
          <div className="mt-6 space-y-4">
            <h3 className="font-['Sora',sans-serif] text-3xl font-semibold tracking-[-0.06em] sm:text-4xl">
              Start with one clear destination. Refine it as traffic comes in.
            </h3>
            <p className="max-w-2xl text-base leading-7 text-[#2b1d07] sm:text-lg">
              Set the page, spotlight the priority, and use click data to tune
              what comes next.
            </p>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-[1.5rem] bg-black/8 p-5">
              <p className="text-sm font-semibold">Promote the priority</p>
              <p className="mt-2 text-sm leading-6 text-[#3d2a0d]">
                Move the current launch to the top without reshuffling
                everything else.
              </p>
            </div>
            <div className="rounded-[1.5rem] bg-black/8 p-5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <MousePointerClick className="size-4" />
                Measure the pull
              </div>
              <p className="mt-2 text-sm leading-6 text-[#3d2a0d]">
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
                className="template-card rounded-[2rem] p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-[rgba(251,176,59,0.12)] text-[color:var(--brand-accent)]">
                    <Icon className="size-5" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.05em] text-slate-900">
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
