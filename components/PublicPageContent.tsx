"use client";

import { PublicPageContentProps } from "@/constants/constants";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { usePreloadedQuery } from "convex/react";
import { User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Links from "./Links";
import SocialLinks from "./SocialLinks";
import { QRCodeSVG } from "qrcode.react";
import {
  AvatarShape,
  BackgroundType,
  LayoutStyle,
  LinkStyle,
  getBackgroundStyle,
  resolveThemePreset,
} from "@/lib/themePresets";

const avatarShapeMap: Record<AvatarShape, string> = {
  circle: "rounded-full",
  rounded: "rounded-2xl",
  square: "rounded-none",
};

const PublicPageContent = ({
  username,
  preloadedLinks,
  preloadedCustomization,
}: PublicPageContentProps) => {
  const customizations = usePreloadedQuery(preloadedCustomization);
  const preset = resolveThemePreset(customizations?.themePreset);
  const accentColor = customizations?.accentColor || preset.accentColor;
  const fontFamily = customizations?.fontFamily || preset.fontFamily;
  const layoutStyle =
    (customizations?.layoutStyle as LayoutStyle) || preset.layoutStyle;
  const linkStyle =
    (customizations?.linkStyle as LinkStyle) || preset.linkStyle;
  const avatarShape = (customizations?.avatarShape as AvatarShape) || "circle";

  const backgroundStyle = getBackgroundStyle({
    backgroundType: customizations?.backgroundType as BackgroundType,
    backgroundValue: customizations?.backgroundValue,
    backgroundImageUrl: customizations?.backgroundImageUrl,
    preset,
  });

  const profileUrl = `${getBaseUrl()}/q/${username}`;

  return (
    <div className="min-h-screen" style={{ ...backgroundStyle, fontFamily }}>
      <div className="relative">
        <div
          className="relative h-56"
          style={
            customizations?.bannerImageUrl
              ? {
                  backgroundImage: `url(${customizations.bannerImageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : {
                  background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}bb 100%)`,
                }
          }
        >
          <div className="absolute inset-0 bg-black/15" />
        </div>
      </div>

      <div className="relative mx-auto -mt-24 max-w-5xl px-6 pb-16">
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          <div className="lg:w-80 lg:shrink-0">
            <div className="rounded-3xl border border-white/30 bg-white/85 p-6 shadow-xl backdrop-blur">
              <div className="text-center lg:text-left">
                <div className="mt-10 mb-6 flex justify-center lg:justify-start">
                  <div className="relative">
                    {customizations?.profilePictureUrl ? (
                      <div
                        className={`size-28 overflow-hidden bg-white p-1 shadow-lg ${avatarShapeMap[avatarShape]}`}
                      >
                        <Image
                          src={customizations.profilePictureUrl}
                          alt={`${username}'s profile picture`}
                          width={112}
                          height={112}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    ) : (
                      <div
                        className={`flex size-28 items-center justify-center bg-white shadow-lg ${avatarShapeMap[avatarShape]}`}
                      >
                        <User className="size-12 text-gray-600" />
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 lg:text-4xl">
                      @{username}
                    </h1>
                    {customizations?.description && (
                      <p className="mt-3 text-base leading-relaxed text-gray-700">
                        {customizations.description}
                      </p>
                    )}
                  </div>

                  <SocialLinks
                    socialLinks={customizations?.socialLinks || []}
                    accentColor={accentColor}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="min-w-0 flex-1">
            <div className="rounded-3xl border border-white/20 bg-white/90 p-8 shadow-xl backdrop-blur-xl lg:p-10">
              <Links
                preloadedLinks={preloadedLinks}
                accentColor={accentColor}
                layoutStyle={layoutStyle}
                linkStyle={linkStyle}
              />
            </div>
          </div>
        </div>

        <div className="mt-14 flex justify-center">
          <div className="w-full max-w-md rounded-3xl border border-white/40 bg-white/90 p-6 text-center shadow-xl backdrop-blur-xl">
            <p className="text-sm font-semibold text-gray-700">
              Share this profile
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Scan to open {username}&apos;s link hub
            </p>
            <div className="mt-4 flex justify-center">
              <div className="rounded-2xl bg-white p-4 shadow-inner">
                <QRCodeSVG value={profileUrl} size={150} />
              </div>
            </div>
            <div className="mt-3 rounded-full bg-gray-100 px-4 py-2 text-xs text-gray-600">
              {profileUrl}
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200/60 pt-8 text-center">
          <p className="text-sm text-gray-600">
            Powered by{" "}
            <Link
              href={getBaseUrl() + "/"}
              className="hover:underline"
              style={{ color: accentColor }}
            >
              IndexFlow
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PublicPageContent;
