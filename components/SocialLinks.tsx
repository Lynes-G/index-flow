"use client";

import Link from "next/link";
import type { ComponentType } from "react";
import {
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Github,
  Twitch,
  Facebook,
  Globe,
  Music,
} from "lucide-react";

const platformIcons: Record<string, ComponentType<{ className?: string }>> = {
  Instagram,
  TikTok: Music,
  YouTube: Youtube,
  X: Twitter,
  LinkedIn: Linkedin,
  GitHub: Github,
  Twitch,
  Facebook,
  Website: Globe,
};

const SocialLinks = ({
  socialLinks,
  accentColor,
}: {
  socialLinks: Array<{ platform: string; url: string }>;
  accentColor: string;
}) => {
  if (socialLinks.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
      {socialLinks.map((link, index) => {
        const Icon = platformIcons[link.platform] || Globe;
        return (
          <Link
            key={`${link.platform}-${index}`}
            href={link.url}
            className="group inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:-translate-y-0.5 hover:shadow-md"
            style={{ borderColor: `${accentColor}33` }}
          >
            <span className="inline-flex" style={{ color: accentColor }}>
              <Icon className="size-4" />
            </span>
            {link.platform}
          </Link>
        );
      })}
    </div>
  );
};

export default SocialLinks;
