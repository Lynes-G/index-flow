"use client";

import { getAccentInkOnLight } from "@/lib/frontend/shared/accentColor";
import type { LinkStyle } from "@/lib/frontend/appearance/themePresets";
import { cn } from "@/lib/frontend/shared/utils";
import { ReactNode } from "react";

type PublicLinksSectionProps = {
  accentColor: string;
  linkStyle?: LinkStyle;
  children: ReactNode;
  forceMobileLayout?: boolean;
};

const PublicLinksSection = ({
  accentColor,
  linkStyle = "rounded",
  children,
  forceMobileLayout = false,
}: PublicLinksSectionProps) => {
  const accentInk = getAccentInkOnLight(accentColor);
  const isBrutalist = linkStyle === "brutalist";
  const isGlass = linkStyle === "glass";
  const sectionSurfaceClassName = isBrutalist
    ? "public-links-section-brutalist"
    : isGlass
      ? "public-links-section-glass"
      : "public-links-section";

  return (
    <div
      className={cn(
        "p-3.5",
        !forceMobileLayout && "sm:p-5 lg:p-6",
        sectionSurfaceClassName,
      )}
    >
      <div
        className={cn(
          "mb-3 flex items-center justify-between gap-4 px-1",
          !forceMobileLayout && "sm:mb-5",
        )}
      >
        <div className="space-y-1">
          <p
            className={cn(
              "text-[11px] font-semibold tracking-[0.24em] uppercase",
              isBrutalist ? "text-slate-900" : "text-slate-400",
            )}
          >
            My Links
          </p>
          <h2
            className={cn(
              "text-[1.05rem] font-semibold tracking-[-0.03em] text-slate-900",
              !forceMobileLayout && "sm:text-xl",
              isBrutalist && "tracking-[-0.05em] uppercase",
            )}
          >
            Everything in one place
          </h2>
        </div>
        <div
          className={cn(
            "px-3 py-1 text-[11px] font-semibold tracking-[0.12em] uppercase",
            isBrutalist
              ? "rounded-none border-2 border-slate-950"
              : "rounded-full",
          )}
          style={{
            color: isBrutalist ? "#111111" : accentInk,
            backgroundColor: isBrutalist ? "#FFE04B" : `${accentColor}14`,
          }}
        >
          Live now
        </div>
      </div>

      {children}
    </div>
  );
};

export default PublicLinksSection;
