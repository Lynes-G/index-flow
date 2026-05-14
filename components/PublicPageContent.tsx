"use client";

import { PublicPageContentProps } from "@/constants/constants";
import { splitPublicProfileLinks } from "@/lib/publicProfileLinks";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { usePreloadedQuery } from "convex/react";
import Links from "./Links";
import FeaturedLinkCard from "./FeaturedLinkCard";
import ProfileQrCard from "./ProfileQrCard";
import PublicLinksSection from "./PublicLinksSection";
import PublicPageFooter from "./PublicPageFooter";
import PublicProfileHero from "./PublicProfileHero";
import {
  AvatarShape,
  BackgroundType,
  LayoutStyle,
  LinkStyle,
  getBackgroundStyle,
  resolveThemePreset,
} from "@/lib/themePresets";

const PublicPageContent = ({
  username,
  preloadedLinks,
  preloadedCustomization,
}: PublicPageContentProps) => {
  const links = usePreloadedQuery(preloadedLinks);
  const customizations = usePreloadedQuery(preloadedCustomization);
  const preset = resolveThemePreset(customizations?.themePreset);
  const accentColor = customizations?.accentColor || preset.accentColor;
  const fontFamily = customizations?.fontFamily || preset.fontFamily;
  const layoutStyle =
    (customizations?.layoutStyle as LayoutStyle) || preset.layoutStyle;
  const linkStyle =
    (customizations?.linkStyle as LinkStyle) || preset.linkStyle;
  const avatarShape = (customizations?.avatarShape as AvatarShape) || "circle";
  const featuredLinkId = customizations?.featuredLinkId?.toString();

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

  const { featuredLink } = splitPublicProfileLinks(
    links.map((link) => ({
      _id: link._id.toString(),
      title: link.title,
      url: link.url,
      order: link.order,
    })),
    featuredLinkId,
  );
  const featuredLinkDoc = featuredLink
    ? links.find((link) => link._id.toString() === featuredLink._id) ?? null
    : null;
  const remainingLinkDocs = featuredLinkDoc
    ? links.filter((link) => link._id !== featuredLinkDoc._id)
    : links;
  const shouldRenderLinksSection =
    remainingLinkDocs.length > 0 || featuredLinkDoc === null;
  const profileUrl = `${getBaseUrl()}/q/${username}`;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ ...backgroundStyle, fontFamily }}
    >
      <div className="flex-1">
        <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pt-5 lg:px-8">
          <PublicProfileHero
            username={username}
            accentColor={accentColor}
            avatarShape={avatarShape}
            profilePictureUrl={customizations?.profilePictureUrl}
            description={customizations?.description}
            profileFields={customizations?.profileFields || []}
            socialLinks={customizations?.socialLinks || []}
            bannerImageUrl={customizations?.bannerImageUrl}
            bannerImagePositionX={customizations?.bannerImagePositionX}
            bannerImagePositionY={customizations?.bannerImagePositionY}
          />

          {featuredLinkDoc && (
            <div className="mx-auto mt-7 max-w-4xl sm:mt-8">
              <FeaturedLinkCard
                username={username}
                link={featuredLinkDoc}
                accentColor={accentColor}
              />
            </div>
          )}

          {shouldRenderLinksSection && (
            <div className="mx-auto mt-5 max-w-4xl sm:mt-6">
              <PublicLinksSection accentColor={accentColor}>
                <Links
                  links={remainingLinkDocs}
                  accentColor={accentColor}
                  layoutStyle={layoutStyle === "grid" ? "grid" : "stacked"}
                  linkStyle={linkStyle === "outline" ? "rounded" : linkStyle}
                />
              </PublicLinksSection>
            </div>
          )}

          <div className="mt-10 flex justify-center">
            <ProfileQrCard
              username={username}
              profileUrl={profileUrl}
              accentColor={accentColor}
              className="max-w-md px-5 sm:px-6"
            />
          </div>
        </div>
      </div>

      <div className="mt-auto px-6 pb-10">
        <div className="mx-auto max-w-5xl">
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
