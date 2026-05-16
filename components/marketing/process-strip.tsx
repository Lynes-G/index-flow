import { SectionShell } from "@/components/marketing/section-shell";
import { BarChart3, Link2, Sparkles } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Shape the page",
    description: "Set the look, headline, and first link.",
    icon: Sparkles,
  },
  {
    number: "02",
    title: "Route every audience touchpoint",
    description: "Send socials, campaigns, and QR traffic to one clean page.",
    icon: Link2,
  },
  {
    number: "03",
    title: "Read the response and tighten it",
    description: "Check what earns attention, then tighten the next pass.",
    icon: BarChart3,
  },
];

function ProcessStrip() {
  return (
    <div id="how-it-works" className="scroll-mt-24">
      <SectionShell
        eyebrow="How it works"
        title="Three moves. One sharper page."
        description="Build it, send traffic, tune the next pass."
        className="relative"
      >
        <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <div className="space-y-5">
            <div className="template-card rounded-[2rem] p-6">
              <p className="text-sm leading-7 text-slate-600">
                IndexFlow gives you one place to present the page, direct the
                click, and read the response.
              </p>
              <div className="mt-5 inline-flex rounded-full bg-[color:var(--brand-accent)] px-4 py-2 text-sm font-semibold text-[#111216]">
                Product-focused workflow
              </div>
            </div>
          </div>

          <div className="template-line relative space-y-5 pl-8">
            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.number}
                  className="template-card rounded-[2rem] p-6"
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-full bg-[color:var(--brand-accent)] text-sm font-semibold text-[#111216]">
                      {step.number}
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-2xl bg-[rgba(251,176,59,0.12)] text-[color:var(--brand-accent)]">
                      <Icon className="size-4" />
                    </div>
                  </div>
                  <h3 className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.05em] text-slate-900">
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
