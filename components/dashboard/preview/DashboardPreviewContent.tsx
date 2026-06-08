"use client";

import type { LinkListItem } from "@/components/public-profile/Links";
import PublicProfileRenderer from "@/components/public-profile/PublicProfileRenderer";
import { getBaseUrl } from "@/lib/frontend/shared/getBaseUrl";
import type { ProfileFieldInput } from "@/lib/frontend/profile/profileFields";
import {
  resolveThemePreset,
  type AvatarShape,
  type LayoutStyle,
  type LinkStyle,
} from "@/lib/frontend/appearance/themePresets";
import { cn } from "@/lib/frontend/shared/utils";
import type { PointerEventHandler } from "react";

export type BannerDragProps = {
  draggable: boolean;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  onPointerMove: PointerEventHandler<HTMLDivElement>;
  onPointerUp: PointerEventHandler<HTMLDivElement>;
  onPointerLeave: PointerEventHandler<HTMLDivElement>;
};

export type DashboardPreviewContentProps = {
  username: string;
  displayName?: string;
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
  layoutStyle?: LayoutStyle;
  linkStyle?: LinkStyle;
  compact?: boolean;
  bannerDragProps?: BannerDragProps;
};

const bannerOverlayHeightClass = "h-52 sm:h-60 lg:h-64";

const BannerDragOverlay = ({
  bannerDragProps,
}: {
  bannerDragProps: BannerDragProps;
}) => (
  <div
    className={cn(
      "absolute inset-x-0 top-0 touch-none rounded-[2rem] sm:rounded-[2.3rem]",
      bannerOverlayHeightClass,
      bannerDragProps.draggable ? "cursor-grab" : "cursor-default",
    )}
    onPointerDown={bannerDragProps.onPointerDown}
    onPointerMove={bannerDragProps.onPointerMove}
    onPointerUp={bannerDragProps.onPointerUp}
    onPointerLeave={bannerDragProps.onPointerLeave}
  >
    {bannerDragProps.draggable ? (
      <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
        Drag to reposition
      </div>
    ) : null}
  </div>
);

const DashboardPreviewContent = ({
  username,
  displayName,
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
  layoutStyle = "classic",
  linkStyle = "rounded",
  bannerDragProps,
}: DashboardPreviewContentProps) => {
  return (
    <PublicProfileRenderer
      username={username}
      displayName={displayName}
      accentColor={accentColor}
      avatarShape={avatarShape}
      profilePictureUrl={profilePictureUrl}
      description={description}
      profileFields={profileFields}
      socialLinks={socialLinks}
      bannerImageUrl={bannerImageUrl}
      bannerImagePositionX={bannerImagePositionX}
      bannerImagePositionY={bannerImagePositionY}
      featuredLink={featuredLink}
      links={links}
      layoutStyle={layoutStyle}
      linkStyle={linkStyle}
      profileUrl={`${getBaseUrl()}/q/${username}`}
      preset={resolveThemePreset(undefined)}
      forceMobileLayout
      heroOverlay={
        bannerDragProps ? (
          <BannerDragOverlay bannerDragProps={bannerDragProps} />
        ) : null
      }
      interactive={false}
      showFooter={false}
      showQrCard={false}
    />
  );
};

export default DashboardPreviewContent;
