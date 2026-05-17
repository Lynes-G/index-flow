import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { ProgressiveBlur } from "@/components/motion-primitives/progressive-blur";
import { AccentPill } from "@/components/marketing/accent-pill";
import { cn } from "@/lib/utils";
const marqueeItems = [
  "Creator Stack",
  "Studio Grid",
  "Launchboard",
  "Creator Stack",
  "Studio Grid",
  "Launchboard",
];

function MarqueeChip({ label }: { label: string }) {
  return (
    <div className="rounded-full border border-slate-200/80 bg-white/92 px-5 py-3 text-slate-700 shadow-[0_14px_35px_rgba(15,23,42,0.07)]">
      <span className="text-sm font-medium tracking-[0.01em]">{label}</span>
    </div>
  );
}

type LogoCloudProps = {
  className?: string;
  embedded?: boolean;
};

export default function LogoCloud({
  className,
  embedded = false,
}: LogoCloudProps) {
  return (
    <section
      className={cn(
        embedded ? "px-0 py-0" : "px-4 py-16 sm:px-6 lg:px-8 lg:py-20",
        className,
      )}
    >
      <div className={cn(embedded ? "max-w-none" : "mx-auto max-w-6xl")}>
        <div
          className={cn(
            "overflow-hidden rounded-[2.4rem] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.98))] px-6 py-8 shadow-[0_28px_90px_rgba(15,23,42,0.08)] sm:px-8 lg:px-10 lg:py-10",
            embedded && "rounded-[1.9rem] px-5 py-6 sm:px-6 lg:px-8 lg:py-8",
          )}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="md:max-w-52 md:border-r md:border-slate-200/80 md:pr-6">
              <AccentPill className="border-slate-200 bg-white/85 text-slate-700">
                Trusted stack
              </AccentPill>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Visual rhythm from a logo cloud, without relying on the blocked
                third-party registry.
              </p>
            </div>

            <div className="relative min-w-0 flex-1 py-2">
              <InfiniteSlider speedOnHover={20} speed={40} gap={20}>
                {marqueeItems.map((item, index) => (
                  <MarqueeChip key={`${item}-${index}`} label={item} />
                ))}
              </InfiniteSlider>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white via-white/80 to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white via-white/80 to-transparent"
              />
              <ProgressiveBlur
                className="pointer-events-none absolute top-0 left-0 h-full w-16"
                direction="left"
                blurIntensity={1}
              />
              <ProgressiveBlur
                className="pointer-events-none absolute top-0 right-0 h-full w-16"
                direction="right"
                blurIntensity={1}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
