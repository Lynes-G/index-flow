"use client";

import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { Palette, LayoutGrid, LayoutList, Circle, Square } from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { CSSProperties, ComponentType } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import DesktopFloatingPreview, {
  DESKTOP_PREVIEW_XL_MEDIA_QUERY,
} from "@/components/dashboard/DesktopFloatingPreview";
import CustomizationEssentialsPanel from "@/components/dashboard/CustomizationEssentialsPanel";
import MobilePreviewSheet from "@/components/dashboard/MobilePreviewSheet";
import CustomizationBioSocialPanel from "@/components/dashboard/CustomizationBioSocialPanel";
import CustomizationLayoutPanel from "@/components/dashboard/CustomizationLayoutPanel";
import CustomizationMediaPanel from "@/components/dashboard/CustomizationMediaPanel";
import { getAccentForeground } from "@/lib/accentColor";
import { buildDashboardPreviewModel } from "@/lib/dashboardPreview";
import { cn } from "@/lib/utils";
import { getBaseUrl } from "@/lib/getBaseUrl";
import { socialPlatforms, type SocialPlatform } from "@/lib/socialPlatforms";
import {
  applyPreferredPhoneCountry,
  resolveLocalePhoneCountry,
} from "@/lib/profileFieldCountry";
import { normalizeSocialUrl } from "@/lib/socialLinks";
import ProfileQrCard from "@/components/ProfileQrCard";
import {
  formatPhoneDraft,
  getCountryOptions,
  type ProfileFieldInput,
  type ProfileFieldType,
  normalizeProfileFields,
} from "@/lib/profileFields";
import {
  BackgroundType,
  LinkStyle,
  LayoutStyle,
  AvatarShape,
  defaultThemePresetKey,
  getBackgroundStyle,
  resolveThemePreset,
  themePresetList,
} from "@/lib/themePresets";

const layoutOptions: Array<{
  value: LayoutStyle;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { value: "stacked", label: "Stacked", icon: LayoutList },
  { value: "cards", label: "Cards", icon: LayoutGrid },
  { value: "grid", label: "Grid", icon: LayoutGrid },
];

const linkStyleOptions: Array<{ value: LinkStyle; label: string }> = [
  { value: "pill", label: "Pill" },
  { value: "rounded", label: "Rounded" },
  { value: "outline", label: "Outline" },
  { value: "shadow", label: "Shadow" },
];

const avatarShapeOptions: Array<{
  value: AvatarShape;
  label: string;
  icon: ComponentType<{ className?: string }>;
}> = [
  { value: "circle", label: "Circle", icon: Circle },
  { value: "rounded", label: "Rounded", icon: Square },
  { value: "square", label: "Square", icon: Square },
];

const backgroundTypeOptions: Array<{ value: BackgroundType; label: string }> = [
  { value: "solid", label: "Solid" },
  { value: "gradient", label: "Gradient" },
  { value: "image", label: "Image" },
];

const patternOptions = [
  {
    label: "Soft Dots",
    value:
      "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.08) 1px, transparent 0)",
    previewValue:
      "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.18) 1px, transparent 0)",
  },
  {
    label: "Grid",
    value:
      "linear-gradient(0deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
    previewValue:
      "linear-gradient(0deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px)",
  },
  {
    label: "Diagonal",
    value:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%), linear-gradient(225deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%), linear-gradient(45deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%), linear-gradient(315deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%)",
    previewValue:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.22) 25%, transparent 25%), linear-gradient(225deg, rgba(59, 130, 246, 0.22) 25%, transparent 25%), linear-gradient(45deg, rgba(59, 130, 246, 0.22) 25%, transparent 25%), linear-gradient(315deg, rgba(59, 130, 246, 0.22) 25%, transparent 25%)",
  },
];

const createProfileFieldDraft = (
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

const detectCountryFromLocation = async () => {
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

type CustomizationTab = "essentials" | "layout" | "media" | "bio";

const customizationTabs: Array<{ value: CustomizationTab; label: string }> = [
  { value: "essentials", label: "Essentials" },
  { value: "layout", label: "Layout" },
  { value: "media", label: "Media" },
  { value: "bio", label: "Bio & Social" },
];

type SocialDraft = {
  platform: SocialPlatform;
  url: string;
};

type GradientColors = {
  start: string;
  end: string;
};

type ImageAssetType = "profile" | "banner" | "background";

const extractGradientColors = (value?: string) => {
  const matches = value?.match(/#[0-9a-fA-F]{6}/g) || [];
  return {
    start: matches[0] || "#6366F1",
    end: matches[1] || "#F472B6",
  };
};

const buildGradientValue = ({ start, end }: GradientColors) =>
  `linear-gradient(135deg, ${start} 0%, ${end} 100%)`;

const dashboardFontFallback = '"Sora", "Helvetica Neue", sans-serif';

const dashboardAllowedFontFamilies = new Set(
  themePresetList
    .map((preset) => preset.fontFamily)
    .filter(
      (fontFamily) =>
        fontFamily.includes("sans-serif") || fontFamily.includes("monospace"),
    ),
);

const isDashboardSafeFontFamily = (fontFamily?: string) =>
  Boolean(fontFamily && dashboardAllowedFontFamilies.has(fontFamily));

const sanitizeDashboardFontFamily = (fontFamily?: string): string => {
  if (fontFamily && isDashboardSafeFontFamily(fontFamily)) {
    return fontFamily;
  }

  return dashboardFontFallback;
};

type CustomizationFormData = {
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
  backgroundImagePositionX: number;
  backgroundImagePositionY: number;
  bannerImagePositionX: number;
  bannerImagePositionY: number;
  avatarShape: AvatarShape;
  profileFields: ProfileFieldInput[];
  socialLinks: Array<{ platform: string; url: string }>;
};

const snapshotFromForm = (data: CustomizationFormData) => {
  return JSON.stringify({
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
    backgroundImagePositionX: data.backgroundImagePositionX,
    backgroundImagePositionY: data.backgroundImagePositionY,
    bannerImagePositionX: data.bannerImagePositionX,
    bannerImagePositionY: data.bannerImagePositionY,
    avatarShape: data.avatarShape,
    profileFields: normalizeProfileFields(data.profileFields),
    socialLinks: data.socialLinks,
  });
};

type CustomizationFormProps = {
  shellMode?: "stacked" | "appearance";
};

const CustomizationForm = ({
  shellMode = "stacked",
}: CustomizationFormProps) => {
  const { user } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const updateCustomization = useMutation(
    api.lib.userCustomization.updateCustomizations,
  );

  const generateUploadUrl = useMutation(
    api.lib.userCustomization.generateUploadUrl,
  );

  const removeProfileImage = useMutation(
    api.lib.userCustomization.removeProfilePicture,
  );

  const removeBannerImage = useMutation(
    api.lib.userCustomization.removeBannerImage,
  );

  const removeBackgroundImage = useMutation(
    api.lib.userCustomization.removeBackgroundImage,
  );

  const existingCustomization = useQuery(
    api.lib.userCustomization.getUserCustomizations,
    user ? { userId: user.id } : "skip",
  );
  const userLinks = useQuery(
    api.lib.links.getLinksByUserId,
    user ? { userId: user.id } : "skip",
  );
  const currentSlug = useQuery(
    api.lib.usernames.getUserSlug,
    user ? { userId: user.id } : "skip",
  );

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

  const initialFormState: CustomizationFormData = {
    description: "",
    accentColor: defaultPreset.accentColor,
    themePreset: defaultPreset.key,
    fontFamily: sanitizeDashboardFontFamily(defaultPreset.fontFamily),
    layoutStyle: defaultPreset.layoutStyle,
    linkStyle: defaultPreset.linkStyle,
    featuredLinkId: null as Id<"links"> | null,
    backgroundType: defaultBackgroundType,
    backgroundValue:
      defaultPreset.background.type === "gradient"
        ? defaultPreset.background.value
        : undefined,
    backgroundSolidColor: defaultSolidColor,
    patternOverlayEnabled: defaultPreset.background.type === "pattern",
    patternOverlayValue: defaultPatternValue,
    backgroundImagePositionX: 50,
    backgroundImagePositionY: 50,
    bannerImagePositionX: 50,
    bannerImagePositionY: 50,
    avatarShape: "circle" as AvatarShape,
    profileFields: [] as ProfileFieldInput[],
    socialLinks: [] as Array<{ platform: string; url: string }>,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    snapshotFromForm(initialFormState),
  );
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CustomizationTab>("essentials");

  const [gradientColors, setGradientColors] = useState<GradientColors>(() =>
    extractGradientColors(defaultPreset.background.value),
  );

  const [socialDraft, setSocialDraft] = useState<SocialDraft>({
    platform: socialPlatforms[0],
    url: "",
  });
  const [locationCountry, setLocationCountry] = useState<string | null>(null);
  const [isLocatingCountry, setIsLocatingCountry] = useState(false);

  const [isLoading, startTransition] = useTransition();
  const [isUploading, startUploading] = useTransition();
  const showInlineDesktopPreview = shellMode === "appearance";

  const updateFormData = (updates: Partial<CustomizationFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(DESKTOP_PREVIEW_XL_MEDIA_QUERY);
    const closeMobilePreviewOnDesktop = (event?: MediaQueryListEvent) => {
      if (event ? event.matches : mediaQuery.matches) {
        setIsMobilePreviewOpen(false);
      }
    };

    closeMobilePreviewOnDesktop();
    mediaQuery.addEventListener("change", closeMobilePreviewOnDesktop);

    return () => {
      mediaQuery.removeEventListener("change", closeMobilePreviewOnDesktop);
    };
  }, []);

  const uniqueFonts = useMemo(
    () => Array.from(dashboardAllowedFontFamilies),
    [],
  );
  const countryOptions = useMemo(() => getCountryOptions(), []);
  const localePhoneCountry = useMemo(() => {
    if (typeof navigator === "undefined") return "US";

    return resolveLocalePhoneCountry(
      [navigator.language, ...(navigator.languages || [])],
      countryOptions.map((country) => country.code),
    );
  }, [countryOptions]);
  const preferredPhoneCountry = locationCountry || localePhoneCountry;

  useEffect(() => {
    if (existingCustomization) {
      const preset = resolveThemePreset(existingCustomization.themePreset);
      const fallbackBackgroundValue =
        existingCustomization.backgroundValue || preset.background.value;
      const extractedColors = extractGradientColors(fallbackBackgroundValue);
      const loadedBackgroundType = (existingCustomization.backgroundType ||
        preset.background.type) as BackgroundType;
      const isPatternLegacy = loadedBackgroundType === "pattern";
      const resolvedSolidColor =
        existingCustomization.backgroundSolidColor ||
        preset.background.baseColor ||
        extractedColors.start;
      setGradientColors({
        start: extractedColors.start,
        end: extractedColors.end,
      });
      const nextFormData = {
        description: existingCustomization.description || "",
        accentColor: existingCustomization.accentColor || preset.accentColor,
        themePreset: existingCustomization.themePreset || preset.key,
        fontFamily: sanitizeDashboardFontFamily(
          existingCustomization.fontFamily || preset.fontFamily,
        ),
        layoutStyle: (existingCustomization.layoutStyle ||
          preset.layoutStyle) as LayoutStyle,
        linkStyle: (existingCustomization.linkStyle ||
          preset.linkStyle) as LinkStyle,
        featuredLinkId: existingCustomization.featuredLinkId ?? null,
        backgroundType: isPatternLegacy
          ? "solid"
          : (loadedBackgroundType as BackgroundType),
        backgroundValue:
          loadedBackgroundType === "gradient"
            ? fallbackBackgroundValue
            : undefined,
        backgroundSolidColor: resolvedSolidColor,
        patternOverlayEnabled:
          existingCustomization.patternOverlayEnabled ?? isPatternLegacy,
        patternOverlayValue:
          existingCustomization.patternOverlayValue ||
          (isPatternLegacy ? fallbackBackgroundValue : defaultPatternValue),
        backgroundImagePositionX:
          existingCustomization.backgroundImagePositionX ?? 50,
        backgroundImagePositionY:
          existingCustomization.backgroundImagePositionY ?? 50,
        bannerImagePositionX: existingCustomization.bannerImagePositionX ?? 50,
        bannerImagePositionY: existingCustomization.bannerImagePositionY ?? 50,
        avatarShape: (existingCustomization.avatarShape ||
          "circle") as AvatarShape,
        profileFields: existingCustomization.profileFields || [],
        socialLinks: existingCustomization.socialLinks || [],
      };

      setFormData(nextFormData);
      setSavedSnapshot(snapshotFromForm(nextFormData));
    }
  }, [defaultPatternValue, existingCustomization]);

  useEffect(() => {
    setFormData((prev) => {
      const hasMissingPhoneCountry = prev.profileFields.some(
        (field) => field.type === "phone" && !field.country,
      );

      if (!hasMissingPhoneCountry) {
        return prev;
      }

      return {
        ...prev,
        profileFields: applyPreferredPhoneCountry(
          prev.profileFields,
          preferredPhoneCountry,
        ),
      };
    });
  }, [preferredPhoneCountry]);

  useEffect(() => {
    let isCancelled = false;

    const autofillCountryFromLocation = async () => {
      try {
        const detectedCountry = await detectCountryFromLocation();
        if (isCancelled) return;

        setLocationCountry(detectedCountry);
        setFormData((prev) => ({
          ...prev,
          profileFields: prev.profileFields.map((field) => {
            if (field.type !== "phone") return field;
            if (field.country) return field;
            return { ...field, country: detectedCountry };
          }),
        }));
      } catch (error) {
        if (!isCancelled) {
          console.log("Automatic location country detection skipped", error);
        }
      }
    };

    autofillCountryFromLocation();

    return () => {
      isCancelled = true;
    };
  }, []);

  const handleGradientChange = (key: "start" | "end", value: string) => {
    const nextColors = { ...gradientColors, [key]: value };
    const gradientValue = buildGradientValue(nextColors);
    setGradientColors(nextColors);
    updateFormData({
      backgroundType: "gradient",
      backgroundValue: gradientValue,
    });
  };

  const handleBackgroundTypeChange = (backgroundType: BackgroundType) => {
    setFormData((prev) => ({
      ...prev,
      backgroundType,
      backgroundValue:
        backgroundType === "gradient"
          ? prev.backgroundValue || buildGradientValue(gradientColors)
          : undefined,
    }));
  };

  const handlePatternOverlayToggle = () => {
    setFormData((prev) => ({
      ...prev,
      patternOverlayEnabled: !prev.patternOverlayEnabled,
      patternOverlayValue:
        !prev.patternOverlayEnabled && !prev.patternOverlayValue
          ? patternOptions[0]?.value
          : prev.patternOverlayValue,
    }));
  };

  const handlePatternOverlayValueChange = (patternOverlayValue: string) => {
    updateFormData({ patternOverlayValue });
  };

  const handleLayoutStyleChange = (layoutStyle: LayoutStyle) => {
    updateFormData({ layoutStyle });
  };

  const handleLinkStyleChange = (linkStyle: LinkStyle) => {
    updateFormData({ linkStyle });
  };

  const handleFeaturedLinkChange = (featuredLinkId: Id<"links"> | null) => {
    updateFormData({ featuredLinkId });
  };

  const handleAvatarShapeChange = (avatarShape: AvatarShape) => {
    updateFormData({ avatarShape });
  };

  const handleAccentColorChange = (accentColor: string) => {
    handleInputChange("accentColor", accentColor);
  };

  const handleFontFamilyChange = (fontFamily: string) => {
    handleInputChange("fontFamily", fontFamily);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    startTransition(async () => {
      try {
        const sanitizedFormData = {
          ...formData,
          fontFamily: sanitizeDashboardFontFamily(formData.fontFamily),
        };

        await updateCustomization({
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
          backgroundSolidColor:
            sanitizedFormData.backgroundSolidColor || undefined,
          patternOverlayEnabled: sanitizedFormData.patternOverlayEnabled,
          patternOverlayValue: sanitizedFormData.patternOverlayEnabled
            ? sanitizedFormData.patternOverlayValue || undefined
            : undefined,
          backgroundImagePositionX: sanitizedFormData.backgroundImagePositionX,
          backgroundImagePositionY: sanitizedFormData.backgroundImagePositionY,
          bannerImagePositionX: sanitizedFormData.bannerImagePositionX,
          bannerImagePositionY: sanitizedFormData.bannerImagePositionY,
          avatarShape: sanitizedFormData.avatarShape || undefined,
          profileFields: normalizeProfileFields(
            sanitizedFormData.profileFields,
          ),
          socialLinks: sanitizedFormData.socialLinks,
        });
        setSavedSnapshot(snapshotFromForm(sanitizedFormData));
        toast.success("Customizations saved successfully.");
      } catch (err) {
        console.log("Failed to save customizations:", err);
        toast.error("Failed to save customizations.");
      }
    });
  };

  const clearImageInput = (type: ImageAssetType) => {
    const inputRef =
      type === "profile"
        ? fileInputRef
        : type === "banner"
          ? bannerInputRef
          : backgroundInputRef;

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const saveUploadedImage = async (
    type: ImageAssetType,
    storageId: Id<"_storage">,
  ) => {
    if (type === "profile") {
      await updateCustomization({
        profilePictureStorageId: storageId,
      });
      return;
    }

    if (type === "banner") {
      await updateCustomization({
        bannerImageStorageId: storageId,
      });
      return;
    }

    await updateCustomization({
      backgroundImageStorageId: storageId,
      backgroundType: "image",
      backgroundValue: undefined,
    });
    updateFormData({ backgroundType: "image" });
  };

  const removeImageByType = async (type: ImageAssetType) => {
    if (type === "profile") {
      await removeProfileImage();
      return;
    }

    if (type === "banner") {
      await removeBannerImage();
      return;
    }

    await removeBackgroundImage();
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: ImageAssetType,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      return;
    }

    startUploading(async () => {
      try {
        const uploadUrl = await generateUploadUrl();
        const uploadResult = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!uploadResult.ok) throw new Error("Upload failed");

        const { storageId } = await uploadResult.json();

        await saveUploadedImage(type, storageId);
        toast.success("Image uploaded successfully.");
      } catch (err) {
        console.log("Upload failed", err);
        toast.error("Failed to upload image.");
      } finally {
        clearImageInput(type);
      }
    });
  };

  const handleRemoveImage = (type: ImageAssetType) => {
    startTransition(async () => {
      try {
        await removeImageByType(type);
        toast.success("Image removed successfully.");
      } catch (err) {
        console.log("Failed to remove image", err);
        toast.error("Failed to remove image.");
      }
    });
  };

  const handleInputChange = (
    field: string,
    value: string | boolean | number,
  ) => {
    updateFormData({ [field]: value } as Partial<CustomizationFormData>);
  };

  const handleProfileFieldChange = (
    id: string,
    updates: Partial<ProfileFieldInput>,
  ) => {
    setFormData((prev) => ({
      ...prev,
      profileFields: prev.profileFields.map((field) => {
        if (field.id !== id) return field;

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
      }),
    }));
  };

  const handleAddProfileField = (type: ProfileFieldType) => {
    setFormData((prev) => ({
      ...prev,
      profileFields: [
        ...prev.profileFields,
        createProfileFieldDraft(type, preferredPhoneCountry),
      ],
    }));
  };

  const handleRemoveProfileField = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      profileFields: prev.profileFields.filter((field) => field.id !== id),
    }));
  };

  const handleMoveProfileField = (id: string, direction: "up" | "down") => {
    setFormData((prev) => {
      const index = prev.profileFields.findIndex((field) => field.id === id);
      if (index === -1) return prev;

      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= prev.profileFields.length) {
        return prev;
      }

      const nextFields = [...prev.profileFields];
      const [item] = nextFields.splice(index, 1);
      nextFields.splice(targetIndex, 0, item);

      return {
        ...prev,
        profileFields: nextFields,
      };
    });
  };

  const handleUseLocationForPhone = (id: string) => {
    startTransition(async () => {
      setIsLocatingCountry(true);
      try {
        const country = await detectCountryFromLocation();
        setLocationCountry(country);
        handleProfileFieldChange(id, { country });
        toast.success("Country updated from your location.");
      } catch (error) {
        console.log("Failed to detect country from location", error);
        toast.error("Could not detect your country automatically.");
      } finally {
        setIsLocatingCountry(false);
      }
    });
  };

  const dragStateRef = useRef<{
    type: "background" | "banner" | null;
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
    rect: DOMRect | null;
  }>({
    type: null,
    startX: 0,
    startY: 0,
    startPosX: 50,
    startPosY: 50,
    rect: null,
  });

  const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

  const handleDragStart =
    (type: "background" | "banner") =>
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (type === "background" && !existingCustomization?.backgroundImageUrl) {
        return;
      }
      if (type === "banner" && !existingCustomization?.bannerImageUrl) {
        return;
      }

      const rect = event.currentTarget.getBoundingClientRect();
      const startPosX =
        type === "background"
          ? formData.backgroundImagePositionX
          : formData.bannerImagePositionX;
      const startPosY =
        type === "background"
          ? formData.backgroundImagePositionY
          : formData.bannerImagePositionY;
      dragStateRef.current = {
        type,
        startX: event.clientX,
        startY: event.clientY,
        startPosX,
        startPosY,
        rect,
      };
      event.currentTarget.setPointerCapture(event.pointerId);
    };

  const handleDragMove =
    (type: "background" | "banner") =>
    (event: React.PointerEvent<HTMLDivElement>) => {
      const state = dragStateRef.current;
      if (state.type !== type || !state.rect) return;

      const dx = event.clientX - state.startX;
      const dy = event.clientY - state.startY;
      const nextX = clampPercent(
        state.startPosX - (dx / state.rect.width) * 100,
      );
      const nextY = clampPercent(
        state.startPosY - (dy / state.rect.height) * 100,
      );

      setFormData((prev) =>
        type === "background"
          ? {
              ...prev,
              backgroundImagePositionX: nextX,
              backgroundImagePositionY: nextY,
            }
          : {
              ...prev,
              bannerImagePositionX: nextX,
              bannerImagePositionY: nextY,
            },
      );
    };

  const handleDragEnd = () => {
    dragStateRef.current.type = null;
  };

  const handleAddSocialLink = () => {
    if (!socialDraft.url) return;
    const formattedUrl = normalizeSocialUrl(
      socialDraft.url,
      socialDraft.platform,
    );
    setFormData((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { platform: socialDraft.platform, url: formattedUrl },
      ],
    }));
    setSocialDraft((prev) => ({ ...prev, url: "" }));
  };

  const handleSocialDraftPlatformChange = (platform: SocialPlatform) => {
    setSocialDraft((prev) => ({ ...prev, platform }));
  };

  const handleSocialDraftUrlChange = (url: string) => {
    setSocialDraft((prev) => ({ ...prev, url }));
  };

  const handleRemoveSocialLink = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, idx) => idx !== index),
    }));
  };

  const previewPreset = resolveThemePreset(formData.themePreset);
  const previewBackgroundStyle = getBackgroundStyle({
    backgroundType: formData.backgroundType,
    backgroundValue: formData.backgroundValue,
    backgroundImageUrl:
      formData.backgroundType === "image"
        ? existingCustomization?.backgroundImageUrl
        : undefined,
    backgroundSolidColor: formData.backgroundSolidColor,
    patternOverlayEnabled: formData.patternOverlayEnabled,
    patternOverlayValue: formData.patternOverlayValue,
    backgroundImagePositionX: formData.backgroundImagePositionX,
    backgroundImagePositionY: formData.backgroundImagePositionY,
    preset: previewPreset,
  });
  const dashboardPreviewModel = useMemo(
    () =>
      buildDashboardPreviewModel({
        displayName: user?.username || user?.firstName || user?.lastName,
        currentSlug,
        fallbackShareSlug: user?.id,
        userLinks: (userLinks ?? []).map((link) => ({
          id: link._id.toString(),
          title: link.title,
          url: link.url,
          order: link.order,
        })),
        featuredLinkId: formData.featuredLinkId?.toString() ?? null,
      }),
    [
      currentSlug,
      formData.featuredLinkId,
      user?.firstName,
      user?.id,
      user?.lastName,
      user?.username,
      userLinks,
    ],
  );
  const qrProfileUrl = `${getBaseUrl()}/q/${dashboardPreviewModel.shareSlug}`;

  useEffect(() => {
    if (userLinks === undefined || formData.featuredLinkId === null) {
      return;
    }

    const featuredLinkStillExists = userLinks.some(
      (link) => link._id === formData.featuredLinkId,
    );

    if (featuredLinkStillExists) {
      return;
    }

    setFormData((prev) => {
      if (prev.featuredLinkId === null) {
        return prev;
      }

      const prevFeaturedLinkStillExists = userLinks.some(
        (link) => link._id === prev.featuredLinkId,
      );

      if (prevFeaturedLinkStillExists) {
        return prev;
      }

      return {
        ...prev,
        featuredLinkId: null,
      };
    });
  }, [formData.featuredLinkId, userLinks]);

  const sectionCardClass =
    "rounded-[26px] border border-slate-200/80 bg-white/95 p-5 shadow-sm sm:p-6 xl:p-7";
  const sectionHeaderClass = "flex items-start gap-3 sm:gap-4";
  const sectionTitleClass =
    "font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.05em] text-slate-900";
  const sectionHelpClass = "mt-1 text-sm leading-6 text-slate-500";
  const settingsGroupClass =
    "rounded-2xl border border-slate-200/80 bg-slate-50/80 p-5 sm:p-6";
  const accentGradient = `linear-gradient(135deg, ${formData.accentColor} 0%, ${formData.accentColor}aa 100%)`;
  const accentForeground = getAccentForeground(formData.accentColor);
  const accentButtonStyle = {
    backgroundColor: formData.accentColor,
    borderColor: formData.accentColor,
    color: accentForeground,
  };
  const accentBadgeStyle = {
    backgroundColor: formData.accentColor,
    color: accentForeground,
  };
  const accentControlVars = {
    "--accent-color": formData.accentColor,
    "--accent-foreground": accentForeground,
    "--accent-soft": `${formData.accentColor}12`,
    "--accent-ring": `${formData.accentColor}55`,
  } as CSSProperties;
  const hasUnsavedChanges = useMemo(() => {
    return snapshotFromForm(formData) !== savedSnapshot;
  }, [formData, savedSnapshot]);

  const sharedPreviewContentProps = {
    username: dashboardPreviewModel.displayName,
    accentColor: formData.accentColor,
    avatarShape: formData.avatarShape,
    description: formData.description || "Add a short bio...",
    profilePictureUrl: existingCustomization?.profilePictureUrl,
    profileFields: formData.profileFields,
    socialLinks: formData.socialLinks,
    bannerImageUrl: existingCustomization?.bannerImageUrl,
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
    bannerDragProps: {
      draggable: Boolean(existingCustomization?.bannerImageUrl),
      onPointerDown: handleDragStart("banner"),
      onPointerMove: handleDragMove("banner"),
      onPointerUp: handleDragEnd,
      onPointerLeave: handleDragEnd,
    },
  };
  const mobilePreviewContentProps = {
    ...sharedPreviewContentProps,
    bannerDragProps: undefined,
  };
  const desktopPreview = (
    <DesktopFloatingPreview
      previewBackgroundStyle={previewBackgroundStyle}
      fontFamily={sanitizeDashboardFontFamily(formData.fontFamily)}
      contentProps={sharedPreviewContentProps}
    />
  );

  const desktopQrPanel = (
    <section
      className={cn(
        "hidden lg:block",
        showInlineDesktopPreview ? "xl:hidden" : undefined,
      )}
    >
      <div className="grid gap-6 rounded-3xl border border-slate-200/80 bg-slate-50/85 p-6 shadow-lg shadow-slate-900/5 xl:grid-cols-[minmax(0,1.1fr)_380px] xl:items-center xl:gap-8 xl:p-8">
        <div className="space-y-4">
          <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-500 shadow-sm">
            Share tools
          </div>
          <div className="max-w-2xl space-y-2">
            <h3 className="text-2xl font-semibold text-slate-900">
              Download your QR code
            </h3>
            <p className="text-sm leading-6 text-slate-600 sm:text-base">
              Export a clean QR code for print, packaging, or quick sharing
              without leaving the dashboard.
            </p>
          </div>
          <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
              Print it on cards, posters, or packaging for quick profile visits.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
              Share a tracked link so scans still count in your analytics flow.
            </div>
          </div>
        </div>

        <ProfileQrCard
          username={dashboardPreviewModel.shareSlug}
          profileUrl={qrProfileUrl}
          accentColor={formData.accentColor}
          title="Download your QR code"
          description="Export a tracked QR code with your username for print or sharing."
          className="border-slate-200 bg-white/95 shadow-xl shadow-slate-900/5"
        />
      </div>
    </section>
  );

  return (
    <div className="dashboard-shell dashboard-shell-inner w-full">
      <div className="mb-8 border-b border-slate-200/80 pb-6 lg:mb-10 lg:pb-8">
        <div className="flex items-start gap-4">
          <div
            className="rounded-2xl p-3"
            style={{ background: accentGradient, color: accentForeground }}
          >
            <Palette className="size-5" />
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-orange-600 uppercase">
              Customization Studio
            </p>
            <h2 className="font-['Sora',sans-serif] text-2xl font-semibold tracking-[-0.05em] text-slate-900 sm:text-3xl">
              Customize your page
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Shape the look and feel of your link-in-bio with a calmer editing
              workspace and a live preview that stays close to the controls
              you&apos;re changing.
            </p>
          </div>
        </div>
        <div className="mt-4 hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 shadow-sm md:inline-flex">
          <span>Live preview</span>
          <span className="text-slate-300">•</span>
          <span>
            {formData.layoutStyle} · {formData.linkStyle}
          </span>
        </div>
      </div>

      <div className="space-y-6">
        <section className="min-w-0">
          <div>
            <form
              onSubmit={handleSubmit}
              className="space-y-6 pb-28 sm:space-y-8 xl:pb-0"
            >
              <div
                className="flex flex-wrap gap-2 sm:gap-3"
                role="tablist"
                aria-label="Customization tabs"
              >
                {customizationTabs.map((tab) => {
                  const isActive = activeTab === tab.value;
                  return (
                    <button
                      key={tab.value}
                      type="button"
                      role="tab"
                      id={`tab-${tab.value}`}
                      aria-selected={isActive}
                      aria-controls={`panel-${tab.value}`}
                      className={cn(
                        "rounded-full border px-4 py-2.5 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-5 sm:text-sm",
                        isActive
                          ? "text-accent-foreground focus-visible:ring-slate-900/30"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 focus-visible:ring-slate-400",
                      )}
                      style={
                        isActive
                          ? { ...accentControlVars, ...accentButtonStyle }
                          : undefined
                      }
                      onClick={() => setActiveTab(tab.value)}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              <div className="grid gap-6 xl:gap-8">
                <div className="min-w-0 space-y-6">
                  {activeTab === "essentials" && (
                    <CustomizationEssentialsPanel
                      accentColor={formData.accentColor}
                      fontFamily={formData.fontFamily}
                      uniqueFonts={uniqueFonts}
                      sectionCardClass={sectionCardClass}
                      sectionHeaderClass={sectionHeaderClass}
                      sectionTitleClass={sectionTitleClass}
                      sectionHelpClass={sectionHelpClass}
                      accentBadgeStyle={accentBadgeStyle}
                      onAccentColorChange={handleAccentColorChange}
                      onFontFamilyChange={handleFontFamilyChange}
                    />
                  )}

                  {activeTab === "layout" && (
                    <CustomizationLayoutPanel
                      layoutStyle={formData.layoutStyle}
                      linkStyle={formData.linkStyle}
                      avatarShape={formData.avatarShape}
                      featuredLinkId={formData.featuredLinkId}
                      layoutOptions={layoutOptions}
                      linkStyleOptions={linkStyleOptions}
                      avatarShapeOptions={avatarShapeOptions}
                      userLinks={userLinks}
                      featuredLinkPreviewTitle={
                        dashboardPreviewModel.selectedFeaturedLink?.title ??
                        null
                      }
                      sectionCardClass={sectionCardClass}
                      sectionHeaderClass={sectionHeaderClass}
                      sectionTitleClass={sectionTitleClass}
                      sectionHelpClass={sectionHelpClass}
                      accentBadgeStyle={accentBadgeStyle}
                      accentButtonStyle={accentButtonStyle}
                      accentControlVars={accentControlVars}
                      onLayoutStyleChange={handleLayoutStyleChange}
                      onLinkStyleChange={handleLinkStyleChange}
                      onFeaturedLinkChange={handleFeaturedLinkChange}
                      onAvatarShapeChange={handleAvatarShapeChange}
                    />
                  )}

                  {activeTab === "media" && (
                    <CustomizationMediaPanel
                      backgroundType={formData.backgroundType}
                      backgroundSolidColor={formData.backgroundSolidColor}
                      patternOverlayEnabled={formData.patternOverlayEnabled}
                      patternOverlayValue={formData.patternOverlayValue}
                      backgroundImagePositionX={
                        formData.backgroundImagePositionX
                      }
                      backgroundImagePositionY={
                        formData.backgroundImagePositionY
                      }
                      bannerImagePositionX={formData.bannerImagePositionX}
                      bannerImagePositionY={formData.bannerImagePositionY}
                      accentColor={formData.accentColor}
                      gradientColors={gradientColors}
                      isUploading={isUploading}
                      settingsGroupClass={settingsGroupClass}
                      sectionCardClass={sectionCardClass}
                      sectionHeaderClass={sectionHeaderClass}
                      sectionTitleClass={sectionTitleClass}
                      sectionHelpClass={sectionHelpClass}
                      accentBadgeStyle={accentBadgeStyle}
                      accentButtonStyle={accentButtonStyle}
                      accentControlVars={accentControlVars}
                      backgroundTypeOptions={backgroundTypeOptions}
                      patternOptions={patternOptions}
                      existingCustomization={existingCustomization}
                      fileInputRef={fileInputRef}
                      bannerInputRef={bannerInputRef}
                      backgroundInputRef={backgroundInputRef}
                      onBackgroundTypeChange={handleBackgroundTypeChange}
                      onBackgroundSolidColorChange={(value) =>
                        handleInputChange("backgroundSolidColor", value)
                      }
                      onPatternOverlayToggle={handlePatternOverlayToggle}
                      onPatternOverlayValueChange={
                        handlePatternOverlayValueChange
                      }
                      onGradientChange={handleGradientChange}
                      onImageUpload={handleImageUpload}
                      onRemoveImage={handleRemoveImage}
                      onBackgroundPointerDown={handleDragStart("background")}
                      onBackgroundPointerMove={handleDragMove("background")}
                      onBannerPointerDown={handleDragStart("banner")}
                      onBannerPointerMove={handleDragMove("banner")}
                      onPointerEnd={handleDragEnd}
                    />
                  )}

                  {activeTab === "bio" && (
                    <CustomizationBioSocialPanel
                      description={formData.description}
                      profileFields={formData.profileFields}
                      socialLinks={formData.socialLinks}
                      socialDraft={socialDraft}
                      countryOptions={countryOptions}
                      preferredPhoneCountry={preferredPhoneCountry}
                      isLocatingCountry={isLocatingCountry}
                      sectionCardClass={sectionCardClass}
                      sectionHeaderClass={sectionHeaderClass}
                      sectionTitleClass={sectionTitleClass}
                      sectionHelpClass={sectionHelpClass}
                      accentBadgeStyle={accentBadgeStyle}
                      accentButtonStyle={accentButtonStyle}
                      onDescriptionChange={(value) =>
                        handleInputChange("description", value)
                      }
                      onAddProfileField={handleAddProfileField}
                      onProfileFieldChange={handleProfileFieldChange}
                      onMoveProfileField={handleMoveProfileField}
                      onRemoveProfileField={handleRemoveProfileField}
                      onUseLocationForPhone={handleUseLocationForPhone}
                      onSocialDraftPlatformChange={
                        handleSocialDraftPlatformChange
                      }
                      onSocialDraftUrlChange={handleSocialDraftUrlChange}
                      onAddSocialLink={handleAddSocialLink}
                      onRemoveSocialLink={handleRemoveSocialLink}
                    />
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-lg backdrop-blur sm:p-5">
                <Button
                  type="submit"
                  disabled={isUploading || isLoading}
                  className="w-full transition-opacity hover:opacity-90"
                  style={accentButtonStyle}
                >
                  {isLoading ? "Saving..." : "Save Customizations"}
                </Button>
                {hasUnsavedChanges && !isLoading && (
                  <p className="mt-2 text-xs font-medium text-amber-700">
                    Unsaved changes
                  </p>
                )}
              </div>
            </form>
          </div>
        </section>
        <MobilePreviewSheet
          open={isMobilePreviewOpen}
          onOpenChange={setIsMobilePreviewOpen}
          previewBackgroundStyle={previewBackgroundStyle}
          fontFamily={sanitizeDashboardFontFamily(formData.fontFamily)}
          contentProps={mobilePreviewContentProps}
          triggerStyle={accentButtonStyle}
          hasUnsavedChanges={hasUnsavedChanges}
        />
        {showInlineDesktopPreview ? (
          <div className="hidden xl:block">{desktopPreview}</div>
        ) : null}
        <div className={cn(showInlineDesktopPreview ? "mt-0 xl:hidden" : "mt-6")}>
          {desktopQrPanel}
        </div>
      </div>
    </div>
  );
};

export default CustomizationForm;
