"use client";

import type { ReactNode } from "react";

import FeaturedLinkCard from "@/components/public-profile/FeaturedLinkCard";
import Links, { type LinkListItem } from "@/components/public-profile/Links";
import ProfileQrCard from "@/components/public-profile/ProfileQrCard";
import PublicLinksSection from "@/components/public-profile/PublicLinksSection";
import PublicPageFooter from "@/components/public-profile/PublicPageFooter";
import PublicProfileHero from "@/components/public-profile/PublicProfileHero";
import type { ProfileFieldInput } from "@/lib/frontend/profile/profileFields";
import {
  type AvatarShape,
  type BackgroundType,
  type LayoutStyle,
  type LinkStyle,
  type ThemePreset,
} from "@/lib/frontend/appearance/themePresets";
import { cn } from "@/lib/frontend/shared/utils";

type PublicProfileRendererProps = {
  username: string;
  accentColor: string;
  avatarShape: AvatarShape;
  description?: string;
  profilePictureUrl?: string;
  profileFields?: ProfileFieldInput[];
  socialLinks?: Array<{ platform: string; url: string }>;
  bannerImageUrl?: string;
  bannerImagePositionX?: number;
  bannerImagePositionY?: number;
  featuredLink: LinkListItem | null;
  links: LinkListItem[];
  layoutStyle: LayoutStyle;
  linkStyle: LinkStyle;
  profileUrl: string;
  preset: ThemePreset;
  backgroundType?: BackgroundType;
  backgroundValue?: string;
  backgroundSolidColor?: string;
  backgroundImageUrl?: string;
  className?: string;
  forceMobileLayout?: boolean;
  heroOverlay?: ReactNode;
  interactive?: boolean;
  showFooter?: boolean;
  showQrCard?: boolean;
};

const layoutShellClassNames: Record<LayoutStyle, string> = {
  classic: "relative w-full max-w-[44rem]",
  spotlight: "relative w-full max-w-[48rem]",
  editorial: "relative w-full max-w-[46rem]",
  grid: "relative w-full max-w-[64rem]",
};

const featuredVariantByLayout: Record<
  LayoutStyle,
  "top-bar" | "star-border" | "border-focus"
> = {
  classic: "star-border",
  spotlight: "border-focus",
  editorial: "top-bar",
  grid: "border-focus",
};

const featuredSpacingByLayout: Record<LayoutStyle, string> = {
  classic: "mx-auto mt-5 max-w-4xl sm:mt-8",
  spotlight: "mx-auto mt-6 max-w-4xl sm:mt-10",
  editorial: "mx-auto mt-4 max-w-4xl sm:mt-6",
  grid: "mx-auto mt-6 max-w-5xl sm:mt-8",
};

const mobileFeaturedSpacingByLayout: Record<LayoutStyle, string> = {
  classic: "mx-auto mt-5 max-w-4xl",
  spotlight: "mx-auto mt-6 max-w-4xl",
  editorial: "mx-auto mt-4 max-w-4xl",
  grid: "mx-auto mt-6 max-w-5xl",
};

const linksSpacingByLayout: Record<LayoutStyle, string> = {
  classic: "mx-auto mt-4 max-w-4xl sm:mt-6",
  spotlight: "mx-auto mt-5 max-w-5xl sm:mt-8",
  editorial: "mx-auto mt-4 max-w-4xl sm:mt-5",
  grid: "mx-auto mt-5 max-w-5xl sm:mt-7",
};

const mobileLinksSpacingByLayout: Record<LayoutStyle, string> = {
  classic: "mx-auto mt-4 max-w-4xl",
  spotlight: "mx-auto mt-5 max-w-5xl",
  editorial: "mx-auto mt-4 max-w-4xl",
  grid: "mx-auto mt-5 max-w-5xl",
};

const PublicProfileRenderer = ({
  username,
  accentColor,
  avatarShape,
  description,
  profilePictureUrl,
  profileFields = [],
  socialLinks = [],
  bannerImageUrl,
  bannerImagePositionX,
  bannerImagePositionY,
  featuredLink,
  links,
  layoutStyle,
  linkStyle,
  profileUrl,
  preset,
  backgroundType,
  backgroundValue,
  backgroundSolidColor,
  backgroundImageUrl,
  className,
  forceMobileLayout = false,
  heroOverlay,
  interactive = true,
  showFooter = true,
  showQrCard = true,
}: PublicProfileRendererProps) => {
  const shouldRenderLinksSection = links.length > 0 || featuredLink === null;

  return (
    <div className={cn("flex min-h-full flex-col", className)}>
      <div
        className={cn(
          "flex-1 px-3 py-4",
          !forceMobileLayout && "sm:px-5 sm:py-6 lg:px-6",
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl justify-center">
          <div className={layoutShellClassNames[layoutStyle]}>
            <div
              className={cn(
                "relative pt-1 pb-8",
                !forceMobileLayout && "sm:pt-2 sm:pb-10",
              )}
            >
              <div className="relative">
                <PublicProfileHero
                  username={username}
                  accentColor={accentColor}
                  avatarShape={avatarShape}
                  profilePictureUrl={profilePictureUrl}
                  description={description}
                  profileFields={profileFields}
                  socialLinks={socialLinks}
                  bannerImageUrl={bannerImageUrl}
                  bannerImagePositionX={bannerImagePositionX}
                  bannerImagePositionY={bannerImagePositionY}
                  forceMobileLayout={forceMobileLayout}
                />
                {heroOverlay}
              </div>

              {featuredLink ? (
                <div
                  className={
                    forceMobileLayout
                      ? mobileFeaturedSpacingByLayout[layoutStyle]
                      : featuredSpacingByLayout[layoutStyle]
                  }
                >
                  <FeaturedLinkCard
                    username={username}
                    link={featuredLink}
                    accentColor={accentColor}
                    variant={featuredVariantByLayout[layoutStyle]}
                    linkStyle={linkStyle}
                    interactive={interactive}
                    forceMobileLayout={forceMobileLayout}
                  />
                </div>
              ) : null}

              {shouldRenderLinksSection ? (
                <div
                  className={
                    forceMobileLayout
                      ? mobileLinksSpacingByLayout[layoutStyle]
                      : linksSpacingByLayout[layoutStyle]
                  }
                >
                  <PublicLinksSection
                    accentColor={accentColor}
                    linkStyle={linkStyle}
                    forceMobileLayout={forceMobileLayout}
                  >
                    <Links
                      links={links}
                      username={username}
                      accentColor={accentColor}
                      layoutStyle={layoutStyle}
                      linkStyle={linkStyle}
                      interactive={interactive}
                      forceMobileLayout={forceMobileLayout}
                    />
                  </PublicLinksSection>
                </div>
              ) : null}

              {showQrCard ? (
                <div
                  className={
                    layoutStyle === "editorial"
                      ? cn(
                          "mt-6 flex justify-center",
                          !forceMobileLayout && "sm:mt-9",
                        )
                      : cn(
                          "mt-5 flex justify-center",
                          !forceMobileLayout && "sm:mt-8",
                        )
                  }
                >
                  <ProfileQrCard
                    username={username}
                    profileUrl={profileUrl}
                    accentColor={accentColor}
                    className={cn(
                      "max-w-md px-5",
                      !forceMobileLayout && "sm:px-6",
                    )}
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {showFooter ? (
        <div
          className={cn(
            "mt-auto px-3.5 pb-6",
            !forceMobileLayout && "sm:px-6 sm:pb-10",
          )}
        >
          <div className="mx-auto max-w-3xl">
            <PublicPageFooter
              accentColor={accentColor}
              backgroundType={backgroundType}
              backgroundValue={backgroundValue}
              backgroundSolidColor={backgroundSolidColor}
              backgroundImageUrl={backgroundImageUrl}
              preset={preset}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PublicProfileRenderer;
