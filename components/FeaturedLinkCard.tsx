"use client";

import { Doc } from "@/convex/_generated/dataModel";
import { trackLinkClick } from "@/lib/analytics";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type FeaturedLinkCardProps = {
  username: string;
  link: Doc<"links">;
  accentColor: string;
};

const FeaturedLinkCard = ({
  username,
  link,
  accentColor,
}: FeaturedLinkCardProps) => {
  const handleClick = async () => {
    await trackLinkClick({
      profileUsername: username,
      linkId: link._id.toString(),
      linkTitle: link.title,
      linkUrl: link.url,
    });
  };

  return (
    <Link href={link.url} className="group block w-full" onClick={handleClick}>
      <div
        className="relative overflow-hidden rounded-[1.75rem] border border-white/60 bg-white/88 p-5 shadow-2xl shadow-slate-900/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 sm:rounded-[2rem] sm:p-6"
        style={{ boxShadow: `0 28px 48px -34px ${accentColor}70` }}
      >
        <div
          className="absolute inset-x-0 top-0 h-1.5"
          style={{
            background: `linear-gradient(90deg, ${accentColor}, ${accentColor}88)`,
          }}
        />
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at top right, ${accentColor}18, transparent 42%)`,
          }}
        />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-3">
            <div className="space-y-1">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
                Featured
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
              style={{ backgroundColor: `${accentColor}12` }}
            >
              <span className="truncate">
                {link.url.replace(/^https?:\/\//, "")}
              </span>
            </div>
          </div>

          <div
            className="inline-flex items-center gap-2 self-start rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition-transform duration-300 group-hover:translate-x-1"
            style={{ backgroundColor: accentColor }}
          >
            Open link
            <ArrowUpRight className="size-4" />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeaturedLinkCard;
