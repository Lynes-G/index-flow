"use client";

import type { CSSProperties, ComponentType } from "react";
import { Circle, Square } from "lucide-react";
import {
  dashboardSurfaceClasses,
  dashboardTextClasses,
} from "@/components/dashboard/styles";
import type { Id } from "@/convex/_generated/dataModel";
import type { DashboardPreviewContentProps } from "@/components/dashboard/preview/DashboardPreviewContent";
import {
  appearanceFontsByCategory,
  sanitizeAppearanceFontFamily,
} from "@/lib/frontend/appearance/appearanceFonts";
import {
  formatPhoneDraft,
  normalizeProfileFields,
  type ProfileFieldInput,
  type ProfileFieldType,
} from "@/lib/frontend/profile/profileFields";
import { type SocialPlatform } from "@/lib/frontend/profile/socialPlatforms";
import {
  AvatarShape,
  BackgroundType,
  LinkStyle,
  LayoutStyle,
  backgroundOverlayDefinitions,
  defaultThemePresetKey,
  layoutStyleLabels,
  resolveLayoutStyle,
  resolveBackgroundOverlay,
  resolveThemePreset,
} from "@/lib/frontend/appearance/themePresets";

export type CustomizationTab = "essentials" | "layout" | "media" | "bio";

export type SocialDraft = {
  platform: SocialPlatform;
  url: string;
};

export type GradientColors = {
  start: string;
  end: string;
};

export type ImageAssetType = "profile" | "banner" | "background";

export type CustomizationFormData = {
  description: string;
  accentColor: string;
  themePreset: string;
  fontFamily: string;
  layoutStyle: LayoutStyle;
  linkStyle: LinkStyle;
  featuredLinkId: Id<"links"> | null;
  backgroundType: BackgroundType;
  backgroundValue?: string;
  backgroundSolidColor: string;
  patternOverlayEnabled: boolean;
  patternOverlayValue?: string;
  patternOverlayOpacity: number;
  backgroundImagePositionX: number;
  backgroundImagePositionY: number;
  bannerImagePositionX: number;
  bannerImagePositionY: number;
  avatarShape: AvatarShape;
  profileFields: ProfileFieldInput[];
  socialLinks: Array<{ platform: string; url: string }>;
};

export type DesktopPreviewState = {
  previewBackgroundStyle: CSSProperties;
  fontFamily: string;
  contentProps: DashboardPreviewContentProps;
};

export const linkStyleOptions: Array<{ value: LinkStyle; label: string }> = [
  { value: "pill", label: "Pill" },
  { value: "rounded", label: "Rounded" },
  { value: "outline", label: "Outline" },
  { value: "shadow", label: "Shadow" },
  { value: "brutalist", label: "Brutalist" },
  { value: "glass", label: "Glass" },
];

export const avatarShapeOptions: Array<{
  value: AvatarShape;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { value: "circle", label: "Circle", icon: Circle },
  { value: "rounded", label: "Rounded", icon: Square },
  { value: "square", label: "Square", icon: Square },
];

export const backgroundTypeOptions: Array<{
  value: BackgroundType;
  label: string;
}> = [
  { value: "solid", label: "Solid" },
  { value: "gradient", label: "Gradient" },
  { value: "image", label: "Image" },
];

export const patternOptions = [
  ...backgroundOverlayDefinitions.map((overlay) => ({
    label: overlay.label,
    category: overlay.category,
    description: overlay.description,
    bestOn: overlay.bestOn,
    value: overlay.id,
    previewValue: overlay.preview,
    previewSize: overlay.size,
    previewRepeat: overlay.repeat,
    previewPosition: overlay.position,
  })),
];

export const customizationTabs: Array<{
  value: CustomizationTab;
  label: string;
}> = [
  { value: "essentials", label: "Essentials" },
  { value: "layout", label: "Layout" },
  { value: "media", label: "Media" },
  { value: "bio", label: "Bio & Social" },
];

export const dashboardSectionClasses = {
  sectionCard: dashboardSurfaceClasses.flatSection,
  sectionHeader: "flex items-start gap-3 sm:gap-4",
  sectionTitle: dashboardTextClasses.sectionTitle,
  sectionHelp: "mt-1 text-sm leading-6 text-slate-500",
  settingsGroup: `${dashboardSurfaceClasses.inset} p-4 max-[375px]:p-3.5 sm:p-6`,
} as const;

export const dashboardEditableFontsByCategory = appearanceFontsByCategory;

export const formatLayoutStyleLabel = (layoutStyle: LayoutStyle) =>
  layoutStyleLabels[layoutStyle];

export const extractGradientColors = (value?: string): GradientColors => {
  const matches = value?.match(/#[0-9a-fA-F]{6}/g) || [];

  return {
    start: matches[0] || "#6366F1",
    end: matches[1] || "#F472B6",
  };
};

export const buildGradientValue = ({ start, end }: GradientColors) =>
  `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;

const defaultPatternOverlayOpacity = 0.18;

export const sanitizeDashboardFontFamily = (fontFamily?: string): string => {
  return sanitizeAppearanceFontFamily(fontFamily);
};

export const createProfileFieldDraft = (
  type: ProfileFieldType = "phone",
  defaultCountry = "US",
): ProfileFieldInput => ({
  id:
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`,
  type,
  title: "",
  value: "",
  ...(type === "phone" ? { country: defaultCountry } : {}),
});

export const updateProfileFieldDraft = ({
  field,
  updates,
  preferredPhoneCountry,
}: {
  field: ProfileFieldInput;
  updates: Partial<ProfileFieldInput>;
  preferredPhoneCountry: string;
}) => {
  const nextField = { ...field, ...updates };

  if (nextField.type !== "phone") {
    delete nextField.country;
  } else if (!nextField.country) {
    nextField.country = preferredPhoneCountry;
  }

  if (
    nextField.type === "phone" &&
    (updates.value !== undefined || updates.country !== undefined)
  ) {
    nextField.value = formatPhoneDraft(
      updates.value ?? nextField.value ?? "",
      nextField.country || "US",
    );
  }

  if (nextField.type === "email" && updates.value !== undefined) {
    nextField.value = updates.value.trimStart();
  }

  return nextField;
};

export const detectCountryFromLocation = async () => {
  if (typeof navigator === "undefined" || !navigator.geolocation) {
    throw new Error("Geolocation is not supported on this device.");
  }

  const position = await new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: false,
      timeout: 10000,
      maximumAge: 300000,
    }),
  );

  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${position.coords.latitude}&lon=${position.coords.longitude}&zoom=3&addressdetails=1`,
    {
      headers: {
        Accept: "application/json",
      },
    },
  );

  if (!response.ok) {
    throw new Error("Country lookup failed.");
  }

  const data = (await response.json()) as {
    address?: { country_code?: string };
  };
  const countryCode = data.address?.country_code?.toUpperCase();

  if (!countryCode) {
    throw new Error("No country found for your location.");
  }

  return countryCode;
};

export const createInitialCustomizationFormState = (): {
  defaultPatternValue?: string;
  defaultPreset: ReturnType<typeof resolveThemePreset>;
  gradientColors: GradientColors;
  formData: CustomizationFormData;
} => {
  const defaultPreset = resolveThemePreset(defaultThemePresetKey);
  const defaultGradient = extractGradientColors(defaultPreset.background.value);
  const defaultSolidColor =
    defaultPreset.background.baseColor || defaultGradient.start;
  const defaultPatternValue =
    defaultPreset.background.type === "pattern"
      ? defaultPreset.background.value
      : patternOptions[0]?.value;
  const defaultBackgroundType: BackgroundType =
    defaultPreset.background.type === "pattern"
      ? "solid"
      : (defaultPreset.background.type as BackgroundType);

  return {
    defaultPatternValue,
    defaultPreset,
    gradientColors: defaultGradient,
    formData: {
      description: "",
      accentColor: defaultPreset.accentColor,
      themePreset: defaultPreset.key,
      fontFamily: sanitizeDashboardFontFamily(defaultPreset.fontFamily),
      layoutStyle: defaultPreset.layoutStyle,
      linkStyle: defaultPreset.linkStyle,
      featuredLinkId: null,
      backgroundType: defaultBackgroundType,
      backgroundValue:
        defaultPreset.background.type === "gradient"
          ? defaultPreset.background.value
          : undefined,
      backgroundSolidColor: defaultSolidColor,
      patternOverlayEnabled: defaultPreset.background.type === "pattern",
      patternOverlayValue: defaultPatternValue,
      patternOverlayOpacity: defaultPatternOverlayOpacity,
      backgroundImagePositionX: 50,
      backgroundImagePositionY: 50,
      bannerImagePositionX: 50,
      bannerImagePositionY: 50,
      avatarShape: "circle",
      profileFields: [],
      socialLinks: [],
    },
  };
};

export const createCustomizationFormDataFromExisting = ({
  existingCustomization,
  defaultPatternValue,
}: {
  existingCustomization: Record<string, unknown>;
  defaultPatternValue?: string;
}): {
  formData: CustomizationFormData;
  gradientColors: GradientColors;
} => {
  const themePreset =
    typeof existingCustomization.themePreset === "string"
      ? existingCustomization.themePreset
      : undefined;
  const preset = resolveThemePreset(themePreset);
  const backgroundValue =
    (existingCustomization.backgroundValue as string | undefined) ||
    preset.background.value;
  const gradientColors = extractGradientColors(backgroundValue);
  const loadedBackgroundType = ((existingCustomization.backgroundType as
    | BackgroundType
    | undefined) || preset.background.type) as BackgroundType;
  const isPatternLegacy = loadedBackgroundType === "pattern";
  const resolvedLegacyOverlay = resolveBackgroundOverlay(backgroundValue);
  const backgroundSolidColor =
    (existingCustomization.backgroundSolidColor as string | undefined) ||
    preset.background.baseColor ||
    gradientColors.start;

  return {
    gradientColors,
    formData: {
      description:
        (existingCustomization.description as string | undefined) || "",
      accentColor:
        (existingCustomization.accentColor as string | undefined) ||
        preset.accentColor,
      themePreset: themePreset || preset.key,
      fontFamily: sanitizeDashboardFontFamily(
        (existingCustomization.fontFamily as string | undefined) ||
          preset.fontFamily,
      ),
      layoutStyle: resolveLayoutStyle(existingCustomization.layoutStyle),
      linkStyle: ((existingCustomization.linkStyle as LinkStyle | undefined) ||
        preset.linkStyle) as LinkStyle,
      featuredLinkId:
        (existingCustomization.featuredLinkId as
          | Id<"links">
          | null
          | undefined) ?? null,
      backgroundType: isPatternLegacy ? "solid" : loadedBackgroundType,
      backgroundValue:
        loadedBackgroundType === "gradient" ? backgroundValue : undefined,
      backgroundSolidColor,
      patternOverlayEnabled:
        (existingCustomization.patternOverlayEnabled as boolean | undefined) ??
        isPatternLegacy,
      patternOverlayValue:
        (existingCustomization.patternOverlayValue as string | undefined) ||
        (isPatternLegacy
          ? resolvedLegacyOverlay?.id || backgroundValue
          : defaultPatternValue),
      patternOverlayOpacity:
        (existingCustomization.patternOverlayOpacity as number | undefined) ??
        defaultPatternOverlayOpacity,
      backgroundImagePositionX:
        (existingCustomization.backgroundImagePositionX as
          | number
          | undefined) ?? 50,
      backgroundImagePositionY:
        (existingCustomization.backgroundImagePositionY as
          | number
          | undefined) ?? 50,
      bannerImagePositionX:
        (existingCustomization.bannerImagePositionX as number | undefined) ??
        50,
      bannerImagePositionY:
        (existingCustomization.bannerImagePositionY as number | undefined) ??
        50,
      avatarShape: ((existingCustomization.avatarShape as
        | AvatarShape
        | undefined) || "circle") as AvatarShape,
      profileFields:
        (existingCustomization.profileFields as
          | ProfileFieldInput[]
          | undefined) || [],
      socialLinks:
        (existingCustomization.socialLinks as
          | Array<{ platform: string; url: string }>
          | undefined) || [],
    },
  };
};

export const snapshotFromForm = (data: CustomizationFormData) =>
  JSON.stringify({
    description: data.description,
    accentColor: data.accentColor,
    themePreset: data.themePreset,
    fontFamily: data.fontFamily,
    layoutStyle: data.layoutStyle,
    linkStyle: data.linkStyle,
    featuredLinkId: data.featuredLinkId,
    backgroundType: data.backgroundType,
    backgroundValue: data.backgroundValue,
    backgroundSolidColor: data.backgroundSolidColor,
    patternOverlayEnabled: data.patternOverlayEnabled,
    patternOverlayValue: data.patternOverlayValue,
    patternOverlayOpacity: data.patternOverlayOpacity,
    backgroundImagePositionX: data.backgroundImagePositionX,
    backgroundImagePositionY: data.backgroundImagePositionY,
    bannerImagePositionX: data.bannerImagePositionX,
    bannerImagePositionY: data.bannerImagePositionY,
    avatarShape: data.avatarShape,
    profileFields: normalizeProfileFields(data.profileFields),
    socialLinks: data.socialLinks,
  });

export const getDesktopPreviewStateKey = (state: DesktopPreviewState) =>
  JSON.stringify({
    previewBackgroundStyle: state.previewBackgroundStyle,
    fontFamily: state.fontFamily,
    contentProps: state.contentProps,
  });
