import { InfiniteSlider } from "@/components/motion-primitives/infinite-slider";
import { AccentPill } from "@/components/marketing/accent-pill";
import { cn } from "@/lib/frontend/shared/utils";
import type { CSSProperties } from "react";

const marqueeItems = [
  "Creators",
  "Freelancers",
  "Studios",
  "Podcasters",
  "Shops",
  "Small brands",
];

const marqueeChipTreatments = [
  {
    className: "marketing-marquee-chip-coral",
    rotation: "-2.2deg",
    offsetX: "4px",
    offsetY: "5px",
  },
  {
    className: "marketing-marquee-chip-mint",
    rotation: "1.6deg",
    offsetX: "-4px",
    offsetY: "4px",
  },
  {
    className: "marketing-marquee-chip-sun",
    rotation: "-1.1deg",
    offsetX: "5px",
    offsetY: "-4px",
  },
  {
    className: "marketing-marquee-chip-lilac",
    rotation: "2.4deg",
    offsetX: "-5px",
    offsetY: "-3px",
  },
  {
    className: "marketing-marquee-chip-paper",
    rotation: "0.9deg",
    offsetX: "3px",
    offsetY: "5px",
  },
  {
    className: "marketing-marquee-chip-blue",
    rotation: "-1.8deg",
    offsetX: "-3px",
    offsetY: "4px",
  },
] as const;

function MarqueeChip({ label, index }: { label: string; index: number }) {
  const treatment = marqueeChipTreatments[index % marqueeChipTreatments.length];

  return (
    <div
      className={cn("marketing-marquee-chip px-5 py-3", treatment.className)}
      style={
        {
          "--chip-rotation": treatment.rotation,
          "--chip-offset-x": treatment.offsetX,
          "--chip-offset-y": treatment.offsetY,
        } as CSSProperties
      }
    >
      <span className="text-sm font-black tracking-[0.08em] uppercase">
        {label}
      </span>
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
            "marketing-logo-panel overflow-hidden px-6 py-8 sm:px-8 lg:px-10 lg:py-10",
            embedded && "px-5 py-6 sm:px-6 lg:px-8 lg:py-8",
          )}
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="md:border-brand-eggplant relative md:max-w-52 md:border-r-2 md:pr-6">
              <AccentPill className="bg-brand-neon text-brand-eggplant">
                Made for
              </AccentPill>
              <p className="mt-4 text-sm leading-6 font-semibold text-[color-mix(in_srgb,var(--brand-eggplant)_78%,white)]">
                A bio page is most useful when many different kinds of people
                can make it theirs quickly.
              </p>
            </div>

            <div className="marketing-marquee-track relative min-w-0 flex-1 overflow-hidden py-2">
              <InfiniteSlider speed={36} gap={18} autoFill className="py-2">
                {marqueeItems.map((item, index) => (
                  <MarqueeChip
                    key={`${item}-${index}`}
                    label={item}
                    index={index}
                  />
                ))}
              </InfiniteSlider>

              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 left-0 w-14 bg-linear-to-r from-(--riso-paper) via-[color-mix(in_srgb,var(--riso-paper)_78%,transparent)] to-transparent"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 right-0 w-14 bg-linear-to-l from-(--riso-paper) via-[color-mix(in_srgb,var(--riso-paper)_78%,transparent)] to-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
