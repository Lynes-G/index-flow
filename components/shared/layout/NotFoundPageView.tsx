import { BrandLogo } from "@/components/shared/brand/BrandLogo";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, Search, Sparkles } from "lucide-react";
import Link from "next/link";

type NotFoundPageViewProps = {
  badge: string;
  title: string;
  description: string;
  primaryAction: {
    href: string;
    label: string;
  };
  secondaryAction: {
    href: string;
    label: string;
  };
  helperTitle: string;
  helperDescription: string;
  helperItems: string[];
};

const orbitChips = [
  { label: "Broken route?", icon: Search },
  { label: "Fresh start", icon: Sparkles },
  { label: "Keep exploring", icon: Compass },
];

const heroDotClassNames = [
  "bg-(--brand-lime)",
  "bg-(--brand-neon)",
  "bg-(--brand-purple)",
];

const notFoundBadgeClassName =
  "rounded-full border border-[color-mix(in_srgb,var(--brand-eggplant)_12%,transparent)] bg-white/80 px-3 py-1 text-[11px] font-semibold tracking-[0.22em] text-slate-600 uppercase";

const orbitChipClassName =
  "flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--brand-eggplant)_10%,transparent)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(255,251,239,0.98))] px-4 py-2 text-sm text-slate-700 shadow-[0_12px_30px_rgba(59,21,42,0.05)]";

const primaryActionClassName =
  "h-auto rounded-full px-6 py-4 text-base font-semibold shadow-[0_18px_40px_rgba(59,21,42,0.24)]";

const secondaryActionClassName =
  "h-auto rounded-full px-6 py-4 text-base font-semibold shadow-[0_18px_40px_rgba(208,212,23,0.2)]";

const helperIconShellClassName =
  "inline-flex rounded-[1.6rem] bg-brand-purple p-4 shadow-[0_24px_60px_rgba(59,21,42,0.18)]";

const helperItemClassName =
  "rounded-[1.35rem] border border-[color-mix(in_srgb,var(--brand-eggplant)_8%,transparent)] bg-white/80 p-4 shadow-[0_12px_28px_rgba(59,21,42,0.05)] backdrop-blur-sm";

const NotFoundPageView = ({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  helperTitle,
  helperDescription,
  helperItems,
}: NotFoundPageViewProps) => {
  return (
    <main className="template-shell template-noise relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="template-glow-ring top-14 left-[10%] h-36 w-36 bg-[radial-gradient(circle,var(--brand-lime),transparent_70%)]" />
      <div className="template-glow-ring right-[8%] bottom-20 h-44 w-44 bg-[radial-gradient(circle,rgba(177,64,127,0.7),transparent_72%)]" />

      <div className="relative mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-center">
          <section className="template-card relative h-full items-center overflow-hidden rounded-4xl p-6 sm:p-8 lg:p-10">
            <div
              className="absolute top-5 right-5 flex gap-1.5"
              aria-hidden="true"
            >
              {heroDotClassNames.map((className) => (
                <span
                  key={className}
                  className={`size-2.5 rounded-full border border-(--brand-eggplant) ${className}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <BrandLogo
                tone="light"
                width={152}
                height={34}
                className="h-auto w-32 sm:w-38"
                priority
              />
              <span className={notFoundBadgeClassName}>{badge}</span>
            </div>

            <div className="mt-8 max-w-2xl space-y-5 md:mt-12">
              <div className="space-y-3">
                <p className="text-brand-primary-ink text-sm font-semibold tracking-[0.28em] uppercase">
                  Detour detected
                </p>
                <h1 className="font-['Sora',sans-serif] text-4xl leading-[0.95] font-semibold tracking-[-0.07em] text-slate-900 sm:text-5xl lg:text-6xl">
                  {title}
                </h1>
                <p className="max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
                  {description}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                {orbitChips.map(({ label, icon: Icon }) => (
                  <div key={label} className={orbitChipClassName}>
                    <Icon className="size-4 text-(--brand-purple)" />
                    <span>{label}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className={primaryActionClassName}>
                  <Link href={primaryAction.href}>
                    {primaryAction.label}
                    <ArrowRight className="size-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className={secondaryActionClassName}
                >
                  <Link href={secondaryAction.href}>
                    {secondaryAction.label}
                  </Link>
                </Button>
              </div>
            </div>
          </section>

          <aside className="editorial-surface editorial-grid relative overflow-hidden rounded-4xl p-6 sm:p-8">
            <div className="text-brand-primary-ink bg-brand-primary-soft absolute top-5 right-5 rounded-full px-3 py-1 text-[11px] font-semibold tracking-[0.18em] uppercase">
              404
            </div>

            <div className="relative space-y-5">
              <div className={helperIconShellClassName}>
                <div className="template-accent-card flex h-16 w-16 items-center justify-center rounded-[1.2rem] text-3xl font-black">
                  ?
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.05em] text-slate-900">
                  {helperTitle}
                </h2>
                <p className="text-sm leading-6 text-slate-600 sm:text-base">
                  {helperDescription}
                </p>
              </div>

              <div className="space-y-3">
                {helperItems.map((item, index) => (
                  <div key={item} className={helperItemClassName}>
                    <div className="flex items-start gap-3">
                      <div className="template-accent-card mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold">
                        {index + 1}
                      </div>
                      <p className="text-sm leading-6 text-slate-700">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default NotFoundPageView;
