import { SectionShell } from "@/components/marketing/section-shell";
import { BarChart3, Link2, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create the page",
    description:
      "Add your headline, featured link, and the core links people expect.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Share it everywhere",
    description:
      "Use one page across socials, campaigns, and offline touchpoints.",
    icon: Link2,
  },
  {
    number: "03",
    title: "Track what works",
    description:
      "See what gets attention, then tighten the page with confidence.",
    icon: BarChart3,
  },
];

function ProcessStrip() {
  return (
    <div id="how-it-works" className="scroll-mt-24">
      <SectionShell
        eyebrow="How it works"
        title="Create it. Share it. Track it."
        description="A simple flow that feels familiar to visitors and easy to manage for you."
        className="landing-band-mint relative"
      >
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="space-y-5">
            <div className="template-card rounded-lg p-6">
              <p className="text-sm leading-7 text-slate-600">
                IndexFlow gives you one place to present the page, direct the
                next click, and learn from the response.
              </p>
              <div className="shadow-brand-neon-md border-brand-eggplant bg-brand-eggplant mt-5 inline-flex rounded-lg border-2 px-4 py-2 text-sm font-black text-white uppercase">
                Link-in-bio, simplified
              </div>
            </div>
          </div>

          <div className="template-line relative space-y-5 pl-8">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="template-card rounded-lg p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="shadow-brand-purple-sm border-brand-eggplant bg-brand-lime text-button-secondary-foreground flex size-10 items-center justify-center rounded-lg border-2 text-sm font-black">
                      {step.number}
                    </div>
                    <div className="border-brand-eggplant bg-brand-accent-soft text-brand-accent-ink flex size-10 items-center justify-center rounded-lg border-2">
                      <Icon className="size-4" />
                    </div>
                  </div>
                  <h3 className="font-['Sora',sans-serif] text-2xl font-black tracking-normal text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">
                    {step.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </SectionShell>
    </div>
  );
}

export { ProcessStrip };
