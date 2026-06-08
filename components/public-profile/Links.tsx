"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { trackLinkClick } from "@/lib/frontend/analytics/analytics";
import { getAccentInkOnLight } from "@/lib/frontend/shared/accentColor";
import { normalizeExternalUrl } from "@/lib/frontend/shared/externalLinks";
import { LayoutStyle, LinkStyle } from "@/lib/frontend/appearance/themePresets";
import { cn } from "@/lib/frontend/shared/utils";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const layoutContainerClassNames: Record<LayoutStyle, string> = {
  classic: "mx-auto max-w-2xl space-y-3 sm:space-y-4",
  spotlight: "mx-auto max-w-3xl space-y-4 sm:space-y-5",
  editorial: "mx-auto max-w-3xl space-y-2.5 sm:space-y-3",
  grid: "mx-auto grid max-w-4xl gap-3 sm:grid-cols-2 sm:gap-4",
};

const mobileLayoutContainerClassNames: Record<LayoutStyle, string> = {
  classic: "mx-auto max-w-2xl space-y-3",
  spotlight: "mx-auto max-w-3xl space-y-4",
  editorial: "mx-auto max-w-3xl space-y-2.5",
  grid: "mx-auto grid max-w-4xl gap-3",
};

const getLayoutContainerClassName = ({
  forceMobileLayout,
  layoutStyle,
}: Pick<LinksProps, "forceMobileLayout" | "layoutStyle">) => {
  if (forceMobileLayout) {
    return mobileLayoutContainerClassNames[layoutStyle ?? "classic"];
  }

  return layoutContainerClassNames[layoutStyle ?? "classic"];
};

const linkStyleMap: Record<LinkStyle, string> = {
  pill: "public-link-pill",
  rounded: "public-link-rounded",
  outline: "public-link-outline",
  shadow: "public-link-shadow",
  brutalist: "public-link-brutalist",
  glass: "public-link-glass",
};

const formatLinkLabel = (url: string) => url.replace(/^https?:\/\//, "");

export type LinkListItem = Pick<Doc<"links">, "title" | "url" | "order"> & {
  _id: string;
};

type LinksProps = {
  preloadedLinks?: Preloaded<typeof api.lib.links.getLinksBySlug>;
  links?: LinkListItem[];
  username?: string;
  accentColor: string;
  layoutStyle?: LayoutStyle;
  linkStyle?: LinkStyle;
  interactive?: boolean;
  compact?: boolean;
  forceMobileLayout?: boolean;
};

type LinksListProps = Omit<LinksProps, "preloadedLinks"> & {
  links: LinkListItem[];
};

type LinkCardProps = {
  accentColor: string;
  accentInk: string;
  compact: boolean;
  forceMobileLayout: boolean;
  href: string | null;
  link: LinkListItem;
  layoutStyle: LayoutStyle;
  linkStyle: LinkStyle;
};

const getLinkCardStyle = ({
  accentColor,
  linkStyle,
}: Pick<LinkCardProps, "accentColor" | "linkStyle">) => ({
  borderColor:
    linkStyle === "brutalist"
      ? "#111111"
      : linkStyle === "glass"
        ? `${accentColor}22`
        : `${accentColor}30`,
  boxShadow:
    linkStyle === "shadow"
      ? `0 22px 38px -28px ${accentColor}66`
      : linkStyle === "glass"
        ? `0 22px 42px -28px ${accentColor}88`
        : undefined,
});

const getLinkIconStyle = ({
  accentColor,
  accentInk,
  linkStyle,
}: Pick<LinkCardProps, "accentColor" | "accentInk" | "linkStyle">) => ({
  color: linkStyle === "brutalist" ? "#111111" : accentInk,
  backgroundColor:
    linkStyle === "glass"
      ? `${accentColor}1f`
      : linkStyle === "brutalist"
        ? "#FFE04B"
        : `${accentColor}14`,
});

const LinkCard = ({
  accentColor,
  accentInk,
  compact,
  forceMobileLayout,
  href,
  link,
  layoutStyle,
  linkStyle,
}: LinkCardProps) => {
  const isEditorial = layoutStyle === "editorial";
  const isBrutalist = linkStyle === "brutalist";
  const isGlass = linkStyle === "glass";

  return (
    <div
      className={cn(
        "group relative overflow-hidden transition-all duration-200 active:scale-[0.985] sm:hover:-translate-y-0.5",
        compact
          ? "px-4 py-3"
          : cn("px-5 py-4", !forceMobileLayout && "sm:px-6 sm:py-5"),
        linkStyleMap[linkStyle],
        isEditorial && !isBrutalist && !isGlass && "public-link-editorial",
        isBrutalist && "-rotate-1 sm:hover:rotate-0",
        isGlass && "border-white/45 bg-white/20",
        href ? "cursor-pointer" : "cursor-not-allowed opacity-70",
      )}
      style={{
        ...getLinkCardStyle({ accentColor, linkStyle }),
      }}
    >
      {isGlass ? (
        <>
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.34),rgba(255,255,255,0.08))]" />
          <div className="absolute -top-10 right-6 h-24 w-24 rounded-full bg-white/28 blur-2xl" />
        </>
      ) : (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_82%_18%,rgba(255,255,255,0.34),transparent_34%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      )}

      <div className="relative flex items-center justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3
            className={cn(
              "font-semibold text-slate-900 transition-colors duration-200",
              compact
                ? "text-sm"
                : isEditorial
                  ? cn("text-base", !forceMobileLayout && "sm:text-lg")
                  : cn("text-[15px]", !forceMobileLayout && "sm:text-base"),
              isBrutalist && "font-black tracking-[-0.03em] uppercase",
              isGlass && "text-slate-950/90",
            )}
          >
            {link.title}
          </h3>
          <p
            className={cn(
              "mt-1 truncate font-normal tracking-[0.01em] text-slate-500 transition-colors duration-200",
              compact
                ? "text-[11px]"
                : cn("text-[11px]", !forceMobileLayout && "sm:text-xs"),
              isBrutalist &&
                "font-semibold tracking-[0.16em] text-slate-700 uppercase",
              isGlass && "text-slate-700/80",
            )}
          >
            {formatLinkLabel(link.url)}
          </p>
        </div>

        <div
          className={cn(
            "shrink-0 rounded-full border border-white/60 bg-white/72 transition-all duration-200 sm:group-hover:translate-x-1",
            compact ? "p-1.5" : "p-2",
            isBrutalist &&
              "rounded-none border-2 border-slate-900 bg-[#FFE04B]",
            isGlass && "border-white/45 bg-white/28 backdrop-blur-md",
          )}
          style={getLinkIconStyle({ accentColor, accentInk, linkStyle })}
        >
          <ArrowUpRight className={compact ? "size-3.5" : "size-4"} />
        </div>
      </div>
    </div>
  );
};

const mapPreloadedLink = (link: Doc<"links">): LinkListItem => ({
  _id: link._id.toString(),
  title: link.title,
  url: link.url,
  order: link.order,
});

const LinksList = ({
  links,
  username: providedUsername,
  accentColor,
  layoutStyle = "classic",
  linkStyle = "rounded",
  interactive = true,
  compact = false,
  forceMobileLayout = false,
}: LinksListProps) => {
  const params = useParams();
  const username = providedUsername ?? (params.username as string);
  const accentInk = getAccentInkOnLight(accentColor);

  // This component is reused in the public page and in previews,
  // so click tracking needs an escape hatch for non-interactive contexts.
  const handleLinkClick = async (link: LinkListItem) => {
    if (!interactive) {
      return;
    }

    await trackLinkClick({
      profileUsername: username,
      linkId: link._id,
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
    <div
      className={getLayoutContainerClassName({
        forceMobileLayout,
        layoutStyle,
      })}
    >
      {links.map((link, index) => {
        const safeHref = normalizeExternalUrl(link.url);
        const card = (
          <LinkCard
            accentColor={accentColor}
            accentInk={accentInk}
            compact={compact}
            forceMobileLayout={forceMobileLayout}
            href={safeHref}
            link={link}
            layoutStyle={layoutStyle}
            linkStyle={linkStyle}
          />
        );

        if (!safeHref || !interactive) {
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
            target="_blank"
            rel="noopener noreferrer"
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

  return <LinksList {...props} links={links.map(mapPreloadedLink)} />;
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
