"use client";

import { normalizeSocialUrl } from "@/lib/socialLinks";
import { getSocialPlatformIcon } from "@/lib/socialPlatforms";
import Link from "next/link";

const SocialLinks = ({
  socialLinks,
  accentColor,
  compact = false,
}: {
  socialLinks: Array<{ platform: string; url: string }>;
  accentColor: string;
  compact?: boolean;
}) => {
  if (socialLinks.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-center">
      {socialLinks.map((link, index) => {
        const Icon = getSocialPlatformIcon(link.platform);
        const href = normalizeSocialUrl(link.url, link.platform);
        return (
          <Link
            key={`${link.platform}-${index}`}
            href={href}
            className={`group inline-flex items-center rounded-full border border-white/70 text-slate-700 shadow-sm shadow-slate-950/5 backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:border-white hover:bg-white ${
              compact
                ? "gap-1.5 bg-white/80 px-2.5 py-1.5 text-[11px] font-medium"
                : "gap-2 bg-white/80 px-3 py-1.5 text-xs font-semibold"
            }`}
            style={{ borderColor: `${accentColor}26` }}
          >
            <Icon
              className={`shrink-0 ${compact ? "size-3.5" : "size-4"}`}
              style={{ color: accentColor }}
            />
            {link.platform}
          </Link>
        );
      })}
    </div>
  );
};

export default SocialLinks;
