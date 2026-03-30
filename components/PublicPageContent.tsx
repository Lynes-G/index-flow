"use client";

import { PublicPageContentProps } from "@/constants/constants";
import { usePreloadedQuery } from "convex/react";
import { User } from "lucide-react";
import Image from "next/image";
import Links from "./Links";
import SocialLinks from "./SocialLinks";
import PublicPageFooter from "./PublicPageFooter";
import { QRCodeSVG } from "qrcode.react";
import { getBaseUrl } from "@/lib/getBaseUrl";
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
    backgroundSolidColor: customizations?.backgroundSolidColor,
    patternOverlayEnabled: customizations?.patternOverlayEnabled,
    patternOverlayValue: customizations?.patternOverlayValue,
    backgroundImagePositionX: customizations?.backgroundImagePositionX,
    backgroundImagePositionY: customizations?.backgroundImagePositionY,
    preset,
  });

  const profileUrl = `${getBaseUrl()}/q/${username}`;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ ...backgroundStyle, fontFamily }}
    >
      <div className="flex-1">
        <div className="relative">
          <div
            className="relative h-48 sm:h-56"
            style={
              customizations?.bannerImageUrl
                ? {
                    backgroundImage: `url(${customizations.bannerImageUrl})`,
                    backgroundSize: "cover",
                    backgroundPosition: `${customizations?.bannerImagePositionX ?? 50}% ${customizations?.bannerImagePositionY ?? 50}%`,
                  }
                : {
                    background: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}bb 100%)`,
                  }
            }
          >
            <div className="absolute inset-0 bg-black/10" />
          </div>
        </div>

        <div className="relative mx-auto -mt-20 max-w-6xl px-6 pb-16">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:gap-12">
            <div className="lg:w-96 lg:shrink-0">
              <div className="rounded-3xl border border-white/40 bg-white/80 p-6 shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
                <div className="text-center lg:text-left">
                  <div className="mt-8 mb-6 flex justify-center lg:justify-start">
                    <div className="relative">
                      {customizations?.profilePictureUrl ? (
                        <div
                          className={`size-28 bg-white p-1 shadow-lg ${avatarShapeMap[avatarShape]}`}
                        >
                          <div
                            className={`h-full w-full overflow-hidden ${avatarShapeMap[avatarShape]}`}
                          >
                            <Image
                              src={customizations.profilePictureUrl}
                              alt={`${username}'s profile picture`}
                              width={112}
                              height={112}
                              className="h-full w-full object-cover"
                            />
                          </div>
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
                      <h1 className="text-3xl font-semibold text-slate-900 lg:text-4xl">
                        @{username}
                      </h1>
                      {customizations?.description && (
                        <p className="mt-3 text-sm leading-relaxed text-slate-600">
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
              <div className="rounded-3xl border border-white/30 bg-white/85 p-7 shadow-2xl shadow-slate-900/10 backdrop-blur-xl lg:p-9">
                <Links
                  preloadedLinks={preloadedLinks}
                  accentColor={accentColor}
                  layoutStyle={layoutStyle}
                  linkStyle={linkStyle}
                />
              </div>
            </div>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="w-full max-w-md rounded-3xl border border-white/40 bg-white/85 p-6 text-center shadow-2xl shadow-slate-900/10 backdrop-blur-xl">
              <p className="text-sm font-semibold text-slate-700">
                Share this profile
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Scan to open {username}&apos;s link hub
              </p>
              <div className="mt-4 flex justify-center">
                <div className="rounded-2xl bg-white/90 p-4 shadow-inner">
                  <QRCodeSVG value={profileUrl} size={150} />
                </div>
              </div>
              <div className="mt-3 rounded-full bg-slate-100/80 px-4 py-2 text-xs text-slate-600">
                {profileUrl}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto px-6 pb-10">
        <div className="mx-auto max-w-6xl">
          <PublicPageFooter
            accentColor={accentColor}
            backgroundType={customizations?.backgroundType as BackgroundType}
            backgroundValue={customizations?.backgroundValue}
            backgroundSolidColor={customizations?.backgroundSolidColor}
            backgroundImageUrl={customizations?.backgroundImageUrl}
            preset={preset}
          />
        </div>
      </div>
    </div>
  );
};

export default PublicPageContent;
