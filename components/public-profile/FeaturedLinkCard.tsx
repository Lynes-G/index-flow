"use client";

import { trackLinkClick } from "@/lib/frontend/analytics/analytics";
import {
  getAccentForeground,
  getAccentInkOnLight,
  getAccentShadowOnBrutalistSurface,
} from "@/lib/frontend/shared/accentColor";
import { normalizeExternalUrl } from "@/lib/frontend/shared/externalLinks";
import type { LinkStyle } from "@/lib/frontend/appearance/themePresets";
import { cn } from "@/lib/frontend/shared/utils";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { LinkListItem } from "./Links";
import StarBorder from "@/components/shared/effects/StarBorder";
import type { CSSProperties } from "react";

type FeaturedLinkCardProps = {
  username: string;
  link: LinkListItem;
  accentColor: string;
  variant?: "top-bar" | "star-border" | "border-focus";
  linkStyle?: LinkStyle;
  demoLabel?: string;
  interactive?: boolean;
  compact?: boolean;
  forceMobileLayout?: boolean;
};

type FeaturedVariant = NonNullable<FeaturedLinkCardProps["variant"]>;

type FeaturedStyleOptions = {
  accentColor: string;
  accentForeground: string;
  accentInk: string;
  brutalistShadowColor: string;
  isBrutalist: boolean;
  isGlass: boolean;
  variant: FeaturedVariant;
};

const getFeaturedSurfaceStyle = ({
  accentColor,
  isBrutalist,
  isGlass,
  variant,
}: Pick<
  FeaturedStyleOptions,
  "accentColor" | "isBrutalist" | "isGlass" | "variant"
>): CSSProperties => {
  if (isBrutalist) {
    return {
      background: "#fff8e7",
      borderColor: "#111111",
      boxShadow: "12px 12px 0 0 rgba(15,23,42,1)",
    };
  }

  if (isGlass) {
    return {
      background: "rgba(255,255,255,0.2)",
      borderColor: "rgba(255,255,255,0.45)",
      boxShadow: `0 30px 52px -36px ${accentColor}80`,
    };
  }

  if (variant === "star-border") {
    return {
      background:
        "linear-gradient(180deg, rgba(255,255,255,0.97), rgba(255,255,255,0.92))",
      borderColor: "rgba(255,255,255,0.82)",
      boxShadow: `0 30px 54px -38px ${accentColor}8c`,
    };
  }

  if (variant === "border-focus") {
    return {
      background: "rgba(255,255,255,0.94)",
      borderColor: `${accentColor}4d`,
      boxShadow: `0 30px 52px -36px ${accentColor}66`,
    };
  }

  return {
    background: "rgba(255,255,255,0.88)",
    borderColor: "rgba(255,255,255,0.6)",
    boxShadow: `0 28px 48px -34px ${accentColor}70`,
  };
};

const getFeaturedGlowStyle = ({
  accentColor,
  isBrutalist,
  isGlass,
  variant,
}: Pick<
  FeaturedStyleOptions,
  "accentColor" | "isBrutalist" | "isGlass" | "variant"
>): CSSProperties => {
  if (isBrutalist) {
    return { background: "transparent" };
  }

  if (isGlass) {
    return {
      background: `radial-gradient(circle at top right, rgba(255,255,255,0.3), transparent 38%), radial-gradient(circle at bottom left, ${accentColor}16, transparent 40%)`,
    };
  }

  if (variant === "border-focus") {
    return {
      background: `radial-gradient(circle at top right, ${accentColor}22, transparent 40%), radial-gradient(circle at bottom left, ${accentColor}12, transparent 36%)`,
    };
  }

  if (variant === "star-border") {
    return {
      background: `radial-gradient(circle at top right, ${accentColor}20, transparent 42%), radial-gradient(circle at left center, rgba(255,255,255,0.8), transparent 30%)`,
    };
  }

  return {
    background: `radial-gradient(circle at top right, ${accentColor}18, transparent 42%)`,
  };
};

const getFeaturedBadgeStyle = ({
  accentColor,
  accentForeground,
  accentInk,
  isBrutalist,
  variant,
}: Pick<
  FeaturedStyleOptions,
  "accentColor" | "accentForeground" | "accentInk" | "isBrutalist" | "variant"
>): CSSProperties => {
  if (isBrutalist) {
    return { backgroundColor: accentColor, color: accentForeground };
  }

  return {
    backgroundColor:
      variant === "border-focus" ? `${accentColor}16` : `${accentColor}12`,
    color: accentInk,
  };
};

const getFeaturedButtonStyle = ({
  accentColor,
  brutalistShadowColor,
  isBrutalist,
  isGlass,
  variant,
}: Pick<
  FeaturedStyleOptions,
  "accentColor" | "brutalistShadowColor" | "isBrutalist" | "isGlass" | "variant"
>): CSSProperties => {
  if (isBrutalist) {
    return {
      background: "#111111",
      boxShadow: `6px 6px 0 0 ${brutalistShadowColor}`,
    };
  }

  if (isGlass) {
    return {
      background:
        "linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0.18))",
      boxShadow: `0 16px 32px -18px ${accentColor}`,
    };
  }

  if (variant === "border-focus" || variant === "star-border") {
    return {
      background: `linear-gradient(135deg, ${accentColor}, ${
        variant === "border-focus" ? `${accentColor}cc` : `${accentColor}dd`
      })`,
      boxShadow: `0 16px 32px -18px ${accentColor}`,
    };
  }

  return { backgroundColor: accentColor };
};

const FeaturedLinkCard = ({
  username,
  link,
  accentColor,
  variant = "top-bar",
  linkStyle = "rounded",
  demoLabel,
  interactive = true,
  compact = false,
  forceMobileLayout = false,
}: FeaturedLinkCardProps) => {
  const accentInk = getAccentInkOnLight(accentColor);
  const accentForeground = getAccentForeground(accentColor);
  const brutalistShadowColor = getAccentShadowOnBrutalistSurface(accentColor);
  const isBrutalist = linkStyle === "brutalist";
  const isGlass = linkStyle === "glass";

  const handleClick = async () => {
    if (!interactive) {
      return;
    }

    await trackLinkClick({
      profileUsername: username,
      linkId: link._id,
    });
  };
  const safeHref = normalizeExternalUrl(link.url);

  const surfaceStyle = getFeaturedSurfaceStyle({
    accentColor,
    isBrutalist,
    isGlass,
    variant,
  });

  const topAccentStyle = isBrutalist
    ? { background: accentColor }
    : variant === "top-bar"
      ? { background: accentColor }
      : null;

  const glowStyle = getFeaturedGlowStyle({
    accentColor,
    isBrutalist,
    isGlass,
    variant,
  });

  const badgeStyle = getFeaturedBadgeStyle({
    accentColor,
    accentForeground,
    accentInk,
    isBrutalist,
    variant,
  });

  const buttonStyle = getFeaturedButtonStyle({
    accentColor,
    brutalistShadowColor,
    isBrutalist,
    isGlass,
    variant,
  });

  const card = (
    <div
      className={cn(
        "relative overflow-hidden border shadow-2xl shadow-slate-900/10 transition-all duration-300 hover:-translate-y-1",
        isBrutalist
          ? "backdrop-blur-0 rounded-none"
          : cn(
              "rounded-[1.75rem] backdrop-blur-xl",
              !forceMobileLayout && "sm:rounded-4xl",
            ),
        compact
          ? cn("p-4", !forceMobileLayout && "sm:p-5")
          : cn("p-5", !forceMobileLayout && "sm:p-6"),
      )}
      style={surfaceStyle}
    >
      {topAccentStyle ? (
        <div className="absolute top-4 right-4 flex gap-1.5" aria-hidden="true">
          <span className="size-2 rounded-full" style={topAccentStyle} />
          <span className="size-2 rounded-full" style={topAccentStyle} />
          <span className="size-2 rounded-full" style={topAccentStyle} />
        </div>
      ) : null}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={glowStyle}
      />

      <div
        className={cn(
          "relative flex flex-col gap-4 pt-2",
          !forceMobileLayout && "sm:flex-row sm:items-end sm:justify-between",
        )}
      >
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold tracking-[0.24em] text-slate-400 uppercase">
              {demoLabel ?? "Featured"}
            </p>
            <h2
              className={cn(
                "font-semibold tracking-[-0.03em] wrap-break-word text-slate-900",
                compact
                  ? cn("text-xl", !forceMobileLayout && "sm:text-2xl")
                  : cn("text-2xl", !forceMobileLayout && "sm:text-[1.85rem]"),
                isBrutalist && "font-black tracking-[-0.06em] uppercase",
              )}
            >
              {link.title}
            </h2>
          </div>
          <p
            className={cn(
              "max-w-2xl text-slate-600",
              compact
                ? cn("text-xs leading-5", !forceMobileLayout && "sm:text-sm")
                : cn(
                    "text-sm leading-6",
                    !forceMobileLayout && "sm:text-[15px]",
                  ),
              isBrutalist &&
                "font-medium tracking-[0.08em] text-slate-800 uppercase",
              isGlass && "text-slate-700/88",
            )}
          >
            Start here for the main action on this page.
          </p>
          <div
            className={cn(
              "inline-flex max-w-full font-medium text-slate-600",
              compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs",
              isBrutalist
                ? "rounded-none border-2 border-slate-950"
                : "rounded-full",
            )}
            style={badgeStyle}
          >
            <span className="break-all">
              {link.url.replace(/^https?:\/\//, "")}
            </span>
          </div>
        </div>

        <div
          className={cn(
            "inline-flex w-full items-center justify-center gap-2 self-start font-semibold shadow-lg transition-transform duration-300 group-hover:translate-x-1",
            !forceMobileLayout && "sm:w-auto",
            compact ? "px-3 py-1.5 text-xs" : "px-4 py-2 text-sm",
            isBrutalist
              ? "rounded-none border-2 border-slate-950"
              : "rounded-full",
            isGlass && "border border-white/35 backdrop-blur-lg",
          )}
          style={{
            ...buttonStyle,
            color: isBrutalist ? "#ffffff" : accentForeground,
          }}
        >
          Open link
          <ArrowUpRight className={compact ? "size-3.5" : "size-4"} />
        </div>
      </div>
    </div>
  );

  const wrappedCard =
    !isBrutalist && variant === "star-border" ? (
      <StarBorder
        className={cn(
          "block rounded-[1.75rem]",
          !forceMobileLayout && "sm:rounded-4xl",
        )}
        color={accentColor}
        speed="8s"
        thickness={3}
        glowOpacity={0.72}
      >
        {card}
      </StarBorder>
    ) : (
      card
    );

  if (!safeHref) {
    return <div className="group block w-full opacity-70">{wrappedCard}</div>;
  }

  if (!interactive) {
    return <div className="group block w-full">{wrappedCard}</div>;
  }

  return (
    <Link href={safeHref} className="group block w-full" onClick={handleClick}>
      {wrappedCard}
    </Link>
  );
};

export default FeaturedLinkCard;
