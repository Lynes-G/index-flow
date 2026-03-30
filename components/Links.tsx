"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { trackLinkClick } from "@/lib/analytics";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { LayoutStyle, LinkStyle } from "@/lib/themePresets";

const layoutClassMap: Record<LayoutStyle, string> = {
  stacked: "space-y-4",
  cards: "space-y-4",
  grid: "grid grid-cols-1 gap-4 sm:grid-cols-2",
};

const linkStyleMap: Record<LinkStyle, string> = {
  pill: "rounded-full border border-slate-200/50 bg-white/85",
  rounded: "rounded-2xl border border-slate-200/50 bg-white/85",
  outline: "rounded-2xl border-2 border-slate-300/60 bg-white/70",
  shadow:
    "rounded-2xl border border-slate-200/40 bg-white/95 shadow-lg shadow-slate-900/5",
};

const Links = ({
  preloadedLinks,
  accentColor,
  layoutStyle = "stacked",
  linkStyle = "rounded",
}: {
  preloadedLinks: Preloaded<typeof api.lib.links.getLinksBySlug>;
  accentColor: string;
  layoutStyle?: LayoutStyle;
  linkStyle?: LinkStyle;
}) => {
  const links = usePreloadedQuery(preloadedLinks);
  const params = useParams();
  const username = params.username as string;

  const handleLinkClick = async (link: Doc<"links">) => {
    await trackLinkClick({
      profileUsername: username,
      linkId: link._id.toString(),
      linkTitle: link.title,
      linkUrl: link.url,
    });
  };

  if (links.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="mb-6 text-slate-300">
          <ArrowUpRight className="mx-auto size-16" />
        </div>
        <p className="text-xl font-medium text-slate-400">
          No links available yet.
        </p>
        <p className="mt-2 text-sm font-medium text-slate-300">
          Links will appear here once added.
        </p>
      </div>
    );
  }

  return (
    <div className={layoutClassMap[layoutStyle]}>
      {links.map((link, index) => (
        <Link
          key={link._id}
          href={link.url}
          className="group block w-full"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => handleLinkClick(link)}
        >
          <div
            className={cn(
              "relative p-5 transition-all duration-300 hover:-translate-y-0.5",
              linkStyleMap[linkStyle],
            )}
            style={{
              borderColor: `${accentColor}2e`,
              boxShadow:
                linkStyle === "shadow"
                  ? `0 18px 32px -24px ${accentColor}55`
                  : undefined,
            }}
          >
            <div className="absolute inset-0 rounded-[inherit] bg-linear-to-r from-transparent via-white/15 to-transparent opacity-0 transition-all duration-300 group-hover:opacity-100" />
            <div className="relative flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-base font-semibold text-slate-900 transition-colors duration-200">
                  {link.title}
                </h3>
                <p className="truncate text-xs font-normal text-slate-500 transition-colors duration-200">
                  {link.url.replace(/^https?:\/\//, "")}
                </p>
              </div>
              <div
                className="ml-4 transition-all duration-200 group-hover:translate-x-1"
                style={{ color: accentColor }}
              >
                <ArrowUpRight className="size-5" />
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Links;
