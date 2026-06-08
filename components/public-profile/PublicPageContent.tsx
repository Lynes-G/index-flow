"use client";

import { PublicPageContentProps } from "@/constants/constants";
import { splitPublicProfileLinks } from "@/lib/frontend/public-profile/publicProfileLinks";
import { getBaseUrl } from "@/lib/frontend/shared/getBaseUrl";
import { sanitizeAppearanceFontFamily } from "@/lib/frontend/appearance/appearanceFonts";
import { usePreloadedQuery } from "convex/react";
import ProfileViewTracker from "./ProfileViewTracker";
import PublicProfileRenderer from "./PublicProfileRenderer";
import {
  AvatarShape,
  BackgroundType,
  LinkStyle,
  getBackgroundStyle,
  resolveLayoutStyle,
  resolveThemePreset,
} from "@/lib/frontend/appearance/themePresets";

const mapLinkForPreview = (link: {
  _id: { toString(): string };
  title: string;
  url: string;
  order: number;
}) => ({
  _id: link._id.toString(),
  title: link.title,
  url: link.url,
  order: link.order,
});

const findRemainingLinkDocs = <
  T extends {
    _id: { toString(): string };
  },
>(
  links: T[],
  remainingLinkIds: string[],
) => {
  const remainingIds = new Set(remainingLinkIds);

  return links.filter((link) => remainingIds.has(link._id.toString()));
};

const PublicPageContent = ({
  username,
  preloadedLinks,
  preloadedCustomization,
}: PublicPageContentProps) => {
  const links = usePreloadedQuery(preloadedLinks);
  const customizations = usePreloadedQuery(preloadedCustomization);

  // Resolve one effective theme here so child components do not have to care
  // whether a value came from the user's customization or a preset fallback.
  const preset = resolveThemePreset(customizations?.themePreset);
  const accentColor = customizations?.accentColor || preset.accentColor;
  const fontFamily = sanitizeAppearanceFontFamily(
    customizations?.fontFamily || preset.fontFamily,
  );
  const layoutStyle = resolveLayoutStyle(customizations?.layoutStyle);
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
    patternOverlayOpacity: customizations?.patternOverlayOpacity,
    backgroundImagePositionX: customizations?.backgroundImagePositionX,
    backgroundImagePositionY: customizations?.backgroundImagePositionY,
    preset,
  });

  // Split the page content into render-ready sections before JSX:
  // hero, featured link, remaining links, then share/footer content.
  const mappedLinks = links.map(mapLinkForPreview);
  const { featuredLink, remainingLinks } = splitPublicProfileLinks(
    mappedLinks,
    featuredLinkId,
  );
  const featuredLinkDoc = featuredLink
    ? (links.find((link) => link._id.toString() === featuredLink._id) ?? null)
    : null;
  const remainingLinkDocs = findRemainingLinkDocs(
    links,
    remainingLinks.map((link) => link._id),
  );
  const shouldRenderLinksSection =
    remainingLinks.length > 0 || featuredLinkDoc === null;
  const profileUrl = `${getBaseUrl()}/q/${username}`;

  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ ...backgroundStyle, fontFamily }}
    >
      <ProfileViewTracker username={username} />
      <PublicProfileRenderer
        username={username}
        displayName={customizations?.displayName}
        accentColor={accentColor}
        avatarShape={avatarShape}
        profilePictureUrl={customizations?.profilePictureUrl}
        description={customizations?.description}
        profileFields={customizations?.profileFields || []}
        socialLinks={customizations?.socialLinks || []}
        bannerImageUrl={customizations?.bannerImageUrl}
        bannerImagePositionX={customizations?.bannerImagePositionX}
        bannerImagePositionY={customizations?.bannerImagePositionY}
        featuredLink={featuredLinkDoc}
        links={shouldRenderLinksSection ? remainingLinkDocs : []}
        layoutStyle={layoutStyle}
        linkStyle={linkStyle}
        profileUrl={profileUrl}
        preset={preset}
        backgroundType={customizations?.backgroundType as BackgroundType}
        backgroundValue={customizations?.backgroundValue}
        backgroundSolidColor={customizations?.backgroundSolidColor}
        backgroundImageUrl={customizations?.backgroundImageUrl}
      />
    </div>
  );
};

export default PublicPageContent;
