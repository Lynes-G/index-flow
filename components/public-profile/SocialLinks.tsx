"use client";

import { getAccentInkOnLight } from "@/lib/frontend/shared/accentColor";
import { normalizeSocialUrl } from "@/lib/frontend/profile/socialLinks";
import { getSocialPlatformIcon } from "@/lib/frontend/profile/socialPlatforms";
import { cn } from "@/lib/frontend/shared/utils";
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

  const accentInk = getAccentInkOnLight(accentColor);

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {socialLinks.map((link, index) => {
        const Icon = getSocialPlatformIcon(link.platform);
        const href = normalizeSocialUrl(link.url, link.platform);
        return (
          <Link
            key={`${link.platform}-${index}`}
            href={href}
            className={cn(
              "public-social-link group inline-flex items-center text-slate-700",
              compact
                ? "gap-1.5 px-2.5 py-1.5 text-center text-[11px] font-medium whitespace-normal"
                : "gap-2 px-3 py-1.5 text-xs font-semibold",
            )}
            style={{ borderColor: `${accentColor}26` }}
          >
            <Icon
              className={`shrink-0 ${compact ? "size-3.5" : "size-4"}`}
              style={{ color: accentInk }}
            />
            {link.platform}
          </Link>
        );
      })}
    </div>
  );
};

export default SocialLinks;
