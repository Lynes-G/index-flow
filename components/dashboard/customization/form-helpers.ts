import type { CSSProperties, PointerEventHandler } from "react";

import type { DashboardPreviewContentProps } from "@/components/dashboard/preview/DashboardPreviewContent";
import {
  type CustomizationFormData,
  type CustomizationTab,
} from "@/components/dashboard/customization/shared";
import { getAccentForeground } from "@/lib/frontend/shared/accentColor";
import { buildDashboardPreviewModel } from "@/lib/frontend/dashboard/dashboardPreview";
import { normalizeProfileFields } from "@/lib/frontend/profile/profileFields";

export type DragTargetType = "background" | "banner";

export const clampPercent = (value: number) =>
  Math.max(0, Math.min(100, value));

export const createAccentStyles = (accentColor: string) => {
  const accentForeground = getAccentForeground(accentColor);

  return {
    accentForeground,
    accentGradient: `linear-gradient(135deg, ${accentColor} 0%, ${accentColor}aa 100%)`,
    accentBadgeStyle: {
      backgroundColor: accentColor,
      color: accentForeground,
    } satisfies CSSProperties,
    accentButtonStyle: {
      backgroundColor: accentColor,
      borderColor: accentColor,
      color: accentForeground,
      "--accent-color": accentColor,
      "--accent-foreground": accentForeground,
      "--accent-ring": `${accentColor}55`,
      "--accent-shadow": `${accentColor}40`,
    } as CSSProperties,
    accentControlVars: {
      "--accent-color": accentColor,
      "--accent-foreground": accentForeground,
      "--accent-soft": `${accentColor}12`,
      "--accent-ring": `${accentColor}55`,
      "--accent-shadow": `${accentColor}40`,
    } as CSSProperties,
  };
};

export const getAppearanceTabForChecklistKey = (
  key: "bio" | "first-link" | "profile-photo" | "theme",
): CustomizationTab => {
  switch (key) {
    case "first-link":
      return "layout";
    case "bio":
      return "bio";
    case "profile-photo":
      return "media";
    case "theme":
      return "layout";
  }
};

export const createBannerDragProps = ({
  bannerImageUrl,
  onPointerDown,
  onPointerMove,
  onPointerEnd,
}: {
  bannerImageUrl?: string | null;
  onPointerDown: PointerEventHandler<HTMLDivElement>;
  onPointerMove: PointerEventHandler<HTMLDivElement>;
  onPointerEnd: () => void;
}) => ({
  draggable: Boolean(bannerImageUrl),
  onPointerDown,
  onPointerMove,
  onPointerUp: onPointerEnd,
  onPointerLeave: onPointerEnd,
});

export const createCustomizationUpdatePayload = (
  sanitizedFormData: CustomizationFormData,
) => ({
  description: sanitizedFormData.description || undefined,
  accentColor: sanitizedFormData.accentColor || undefined,
  themePreset: sanitizedFormData.themePreset || undefined,
  fontFamily: sanitizedFormData.fontFamily,
  layoutStyle: sanitizedFormData.layoutStyle || undefined,
  linkStyle: sanitizedFormData.linkStyle || undefined,
  featuredLinkId: sanitizedFormData.featuredLinkId,
  backgroundType: sanitizedFormData.backgroundType || undefined,
  backgroundValue:
    sanitizedFormData.backgroundType === "gradient"
      ? sanitizedFormData.backgroundValue || undefined
      : undefined,
  backgroundSolidColor: sanitizedFormData.backgroundSolidColor || undefined,
  patternOverlayEnabled: sanitizedFormData.patternOverlayEnabled,
  patternOverlayValue: sanitizedFormData.patternOverlayEnabled
    ? sanitizedFormData.patternOverlayValue || undefined
    : undefined,
  patternOverlayOpacity: sanitizedFormData.patternOverlayEnabled
    ? sanitizedFormData.patternOverlayOpacity
    : undefined,
  backgroundImagePositionX: sanitizedFormData.backgroundImagePositionX,
  backgroundImagePositionY: sanitizedFormData.backgroundImagePositionY,
  bannerImagePositionX: sanitizedFormData.bannerImagePositionX,
  bannerImagePositionY: sanitizedFormData.bannerImagePositionY,
  avatarShape: sanitizedFormData.avatarShape || undefined,
  profileFields: normalizeProfileFields(sanitizedFormData.profileFields),
  socialLinks: sanitizedFormData.socialLinks,
});

export const createBasePreviewContentProps = ({
  dashboardPreviewModel,
  existingCustomization,
  formData,
}: {
  dashboardPreviewModel: ReturnType<typeof buildDashboardPreviewModel>;
  existingCustomization?: {
    profilePictureUrl?: string | null;
    bannerImageUrl?: string | null;
  } | null;
  formData: CustomizationFormData;
}): DashboardPreviewContentProps => ({
  // The preview mirrors the public page, so the visible @handle must use
  // the public slug instead of any Clerk account username.
  username: dashboardPreviewModel.shareSlug,
  accentColor: formData.accentColor,
  avatarShape: formData.avatarShape,
  description: formData.description || "Add a short bio...",
  profilePictureUrl: existingCustomization?.profilePictureUrl || undefined,
  profileFields: formData.profileFields,
  socialLinks: formData.socialLinks,
  bannerImageUrl: existingCustomization?.bannerImageUrl || undefined,
  bannerImagePositionX: formData.bannerImagePositionX,
  bannerImagePositionY: formData.bannerImagePositionY,
  featuredLink: dashboardPreviewModel.selectedFeaturedLink
    ? {
        _id: dashboardPreviewModel.selectedFeaturedLink.id,
        title: dashboardPreviewModel.selectedFeaturedLink.title,
        url: dashboardPreviewModel.selectedFeaturedLink.url,
        order: dashboardPreviewModel.selectedFeaturedLink.order,
      }
    : null,
  links: dashboardPreviewModel.previewLinks.map((link) => ({
    _id: link.id,
    title: link.title,
    url: link.url,
    order: link.order,
  })),
  layoutStyle: formData.layoutStyle,
  linkStyle: formData.linkStyle,
});
