"use client";

import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { trackLinkClick } from "@/lib/analytics";
import { Preloaded, usePreloadedQuery } from "convex/react";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

const Links = ({
  preloadedLinks,
}: {
  preloadedLinks: Preloaded<typeof api.lib.links.getLinksBySlug>;
}) => {
  const links = usePreloadedQuery(preloadedLinks);
  const params = useParams();
  const username = params.username as string;
  const handleLinkClick = async (link: Doc<"links">) => {
    // Track the click before navigating
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
    <div className="space-y-4">
      {links.map((link, index) => (
        <Link
          key={link._id}
          href={link.url}
          className="group block w-full"
          style={{ animationDelay: `${index * 50}ms` }}
          onClick={() => handleLinkClick(link)}
        >
          <div className="relative rounded-2xl border border-slate-200/50 bg-white/70 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-slate-300/50 hover:bg-white/90 hover:shadow-lg hover:shadow-slate-900/5">
            {/* Subtle hover gradient */}
            <div className="absolute inset-0 rounded-2xl bg-linear-to-r from-blue-50/0 via-purple-50/0 to-blue-50/0 transition-all duration-300 group-hover:from-blue-50/30 group-hover:via-purple-50/20 group-hover:to-blue-50/30" />
            <div className="relative flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="mb-1 text-lg font-bold text-slate-900 transition-colors duration-200 group-hover:text-slate-800">
                  {link.title}
                </h3>
                <p className="truncate text-xs font-normal text-slate-400 italic transition-colors duration-200 group-hover:text-slate-500">
                  {link.url.replace(/^https?:\/\//, "")}
                </p>
              </div>
              <div className="ml-4 text-slate-400 transition-all duration-200 group-hover:translate-x-1 group-hover:text-slate-500">
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
