"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { trackLinkClick } from "@/lib/analytics";
import { normalizeExternalUrl } from "@/lib/externalLinks";
import { LayoutStyle, LinkStyle } from "@/lib/themePresets";
import { cn } from "@/lib/utils";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const layoutClassMap: Record<LayoutStyle, string> = {
  stacked: "space-y-4 lg:space-y-5",
  cards: "space-y-4 lg:space-y-5",
  grid: "grid grid-cols-1 gap-4 sm:grid-cols-2",
};

const linkStyleMap: Record<LinkStyle, string> = {
  pill: "rounded-full border border-slate-200/50 bg-white/85",
  rounded: "rounded-2xl border border-slate-200/50 bg-white/85",
  outline: "rounded-2xl border-2 border-slate-300/60 bg-white/70",
  shadow:
    "rounded-2xl border border-slate-200/40 bg-white/95 shadow-lg shadow-slate-900/5",
};

type LinksProps = {
  preloadedLinks?: Preloaded<typeof api.lib.links.getLinksBySlug>;
  links?: Doc<"links">[];
  username?: string;
  accentColor: string;
  layoutStyle?: LayoutStyle;
  linkStyle?: LinkStyle;
};

type LinksListProps = Omit<LinksProps, "preloadedLinks"> & {
  links: Doc<"links">[];
};

const LinksList = ({
  links,
  username: providedUsername,
  accentColor,
  layoutStyle = "stacked",
  linkStyle = "rounded",
}: LinksListProps) => {
  const params = useParams();
  const username = providedUsername ?? (params.username as string);

  const handleLinkClick = async (link: Doc<"links">) => {
    await trackLinkClick({
      profileUsername: username,
      linkId: link._id.toString(),
    });
  };

  if (links.length === 0) {
    return (
      <div className="py-16 text-center">
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
      {links.map((link, index) => {
        const safeHref = normalizeExternalUrl(link.url);
        const card = (
          <div
            className={cn(
              "relative px-5 py-4 transition-all duration-300 hover:-translate-y-0.5 lg:px-6 lg:py-5",
              linkStyleMap[linkStyle],
              safeHref ? "cursor-pointer" : "cursor-not-allowed opacity-70",
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
                <h3 className="mb-1 text-[15px] font-semibold text-slate-900 transition-colors duration-200 lg:text-base">
                  {link.title}
                </h3>
                <p className="truncate text-xs font-normal tracking-[0.01em] text-slate-500 transition-colors duration-200">
                  {link.url.replace(/^https?:\/\//, "")}
                </p>
              </div>
              <div
                className="ml-4 rounded-full p-2 transition-all duration-200 group-hover:translate-x-1"
                style={{ color: accentColor }}
              >
                <ArrowUpRight className="size-4" />
              </div>
            </div>
          </div>
        );

        if (!safeHref) {
          return (
            <div
              key={link._id}
              className="group block w-full"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {card}
            </div>
          );
        }

        return (
          <Link
            key={link._id}
            href={safeHref}
            className="group block w-full"
            style={{ animationDelay: `${index * 50}ms` }}
            onClick={() => handleLinkClick(link)}
          >
            {card}
          </Link>
        );
      })}
    </div>
  );
};

const PreloadedLinksList = ({
  preloadedLinks,
  ...props
}: LinksProps & {
  preloadedLinks: Preloaded<typeof api.lib.links.getLinksBySlug>;
}) => {
  const links = usePreloadedQuery(preloadedLinks);

  return <LinksList {...props} links={links} />;
};

const Links = ({ links, preloadedLinks, ...props }: LinksProps) => {
  if (links !== undefined) {
    return <LinksList {...props} links={links} />;
  }

  if (preloadedLinks) {
    return <PreloadedLinksList {...props} preloadedLinks={preloadedLinks} />;
  }

  return <LinksList {...props} links={[]} />;
};

export default Links;
