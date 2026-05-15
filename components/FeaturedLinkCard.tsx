"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { trackLinkClick } from "@/lib/analytics";
import { normalizeExternalUrl } from "@/lib/externalLinks";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import StarBorder from "./StarBorder";

type FeaturedLinkCardProps = {
  username: string;
  link: Doc<"links">;
  accentColor: string;
  variant?: "top-bar" | "star-border" | "border-focus";
  demoLabel?: string;
};

const FeaturedLinkCard = ({
  username,
  link,
  accentColor,
  variant = "top-bar",
  demoLabel,
}: FeaturedLinkCardProps) => {
  const handleClick = async () => {
    await trackLinkClick({
      profileUsername: username,
      linkId: link._id.toString(),
    });
  };
  const safeHref = normalizeExternalUrl(link.url);

  const surfaceStyle =
    variant === "star-border"
      ? {
          background: "linear-gradient(180deg, rgba(255,255,255,0.97), rgba(255,255,255,0.92))",
          borderColor: "rgba(255,255,255,0.82)",
          boxShadow: `0 30px 54px -38px ${accentColor}8c`,
        }
      : variant === "border-focus"
        ? {
            background: "rgba(255,255,255,0.94)",
            borderColor: `${accentColor}4d`,
            boxShadow: `0 30px 52px -36px ${accentColor}66`,
          }
        : {
            background: "rgba(255,255,255,0.88)",
            borderColor: "rgba(255,255,255,0.6)",
            boxShadow: `0 28px 48px -34px ${accentColor}70`,
          };

  const topAccentStyle =
    variant === "top-bar"
      ? {
          background: `linear-gradient(90deg, ${accentColor}, #ffffff, ${accentColor})`,
        }
      : null;

  const glowStyle =
    variant === "border-focus"
      ? {
          background: `radial-gradient(circle at top right, ${accentColor}22, transparent 40%), radial-gradient(circle at bottom left, ${accentColor}12, transparent 36%)`,
        }
      : variant === "star-border"
        ? {
            background: `radial-gradient(circle at top right, ${accentColor}20, transparent 42%), radial-gradient(circle at left center, rgba(255,255,255,0.8), transparent 30%)`,
          }
      : {
          background: `radial-gradient(circle at top right, ${accentColor}18, transparent 42%)`,
        };

  const badgeStyle =
    variant === "border-focus"
      ? { backgroundColor: `${accentColor}16`, color: accentColor }
      : { backgroundColor: `${accentColor}12` };

  const buttonStyle =
    variant === "border-focus"
      ? {
          background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
          boxShadow: `0 16px 32px -18px ${accentColor}`,
        }
      : variant === "star-border"
        ? {
            background: `linear-gradient(135deg, ${accentColor}, ${accentColor}dd)`,
            boxShadow: `0 16px 32px -18px ${accentColor}`,
          }
      : { backgroundColor: accentColor };

  const card = (
    <div
      className="relative overflow-hidden rounded-[1.75rem] border p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 sm:rounded-[2rem] sm:p-6"
      style={surfaceStyle}
    >
      {topAccentStyle ? (
        <div className="absolute inset-x-0 top-0 h-1.5" style={topAccentStyle} />
      ) : null}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={glowStyle}
      />

      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-3">
          <div className="space-y-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              {demoLabel ?? "Featured"}
            </p>
            <h2 className="text-2xl font-semibold tracking-[-0.03em] text-slate-900 sm:text-[1.85rem]">
              {link.title}
            </h2>
          </div>
          <p className="max-w-2xl text-sm leading-6 text-slate-600 sm:text-[15px]">
            Start here for the main action on this page.
          </p>
          <div
            className="inline-flex max-w-full rounded-full px-3 py-1.5 text-xs font-medium text-slate-600"
            style={badgeStyle}
          >
            <span className="truncate">{link.url.replace(/^https?:\/\//, "")}</span>
          </div>
        </div>

        <div
          className="inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform duration-300 group-hover:translate-x-1"
          style={buttonStyle}
        >
          Open link
          <ArrowUpRight className="size-4" />
        </div>
      </div>
    </div>
  );

  const wrappedCard =
    variant === "star-border" ? (
      <StarBorder
        className="block rounded-[1.75rem] sm:rounded-[2rem]"
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

  return (
    <Link href={safeHref} className="group block w-full" onClick={handleClick}>
      {wrappedCard}
    </Link>
  );
};

export default FeaturedLinkCard;
