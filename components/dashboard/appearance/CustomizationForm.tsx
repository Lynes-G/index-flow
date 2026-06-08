"use client";

import { api } from "@/convex/_generated/api";
import {
  CustomizationDesktopPreviewRail,
  CustomizationPreviewProvider,
  useCustomizationPreviewContext,
} from "@/components/dashboard/customization/CustomizationPreviewContext";
import AppearanceSetupTooltip from "@/components/dashboard/customization/AppearanceSetupTooltip";
import {
  CustomizationFormHeader,
  CustomizationQrPanel,
  CustomizationSaveBar,
  CustomizationTabList,
} from "@/components/dashboard/customization/CustomizationFormChrome";
import CustomizationTabPanel from "@/components/dashboard/customization/CustomizationTabPanel";
import {
  clampPercent,
  createAccentStyles,
  createBannerDragProps,
  createBasePreviewContentProps,
  createCustomizationUpdatePayload,
  getAppearanceTabForChecklistKey,
  type DragTargetType,
} from "@/components/dashboard/customization/form-helpers";
import { useCustomizationImageAssets } from "@/components/dashboard/customization/useCustomizationImageAssets";
import {
  avatarShapeOptions,
  backgroundTypeOptions,
  buildGradientValue,
  createCustomizationFormDataFromExisting,
  createInitialCustomizationFormState,
  createProfileFieldDraft,
  customizationTabs,
  dashboardEditableFontsByCategory,
  dashboardSectionClasses,
  detectCountryFromLocation,
  extractGradientColors,
  formatLayoutStyleLabel,
  getDesktopPreviewStateKey,
  linkStyleOptions,
  patternOptions,
  sanitizeDashboardFontFamily,
  snapshotFromForm,
  updateProfileFieldDraft,
  type CustomizationFormData,
  type CustomizationTab,
  type DesktopPreviewState,
  type GradientColors,
  type SocialDraft,
} from "@/components/dashboard/customization/shared";
import CustomizationBioSocialPanel from "@/components/dashboard/appearance/CustomizationBioSocialPanel";
import CustomizationEssentialsPanel from "@/components/dashboard/appearance/CustomizationEssentialsPanel";
import CustomizationLayoutPanel from "@/components/dashboard/appearance/CustomizationLayoutPanel";
import CustomizationMediaPanel from "@/components/dashboard/appearance/CustomizationMediaPanel";
import DesktopFloatingPreview, {
  DESKTOP_PREVIEW_XL_MEDIA_QUERY,
} from "@/components/dashboard/preview/DesktopFloatingPreview";
import MobilePreviewSheet from "@/components/dashboard/preview/MobilePreviewSheet";
import type { DashboardPreviewContentProps } from "@/components/dashboard/preview/DashboardPreviewContent";
import { buildDashboardPreviewModel } from "@/lib/frontend/dashboard/dashboardPreview";
import {
  createDashboardSetupChecklist,
  getAppearanceChecklistItems,
  getDashboardSetupAction,
} from "@/lib/frontend/dashboard/dashboardSetupChecklist";
import { getBaseUrl } from "@/lib/frontend/shared/getBaseUrl";
import {
  applyPreferredPhoneCountry,
  resolveLocalePhoneCountry,
} from "@/lib/frontend/profile/profileFieldCountry";
import {
  getCountryOptions,
  type ProfileFieldInput,
  type ProfileFieldType,
} from "@/lib/frontend/profile/profileFields";
import { normalizeSocialUrl } from "@/lib/frontend/profile/socialLinks";
import {
  socialPlatforms,
  type SocialPlatform,
} from "@/lib/frontend/profile/socialPlatforms";
import {
  BackgroundType,
  getBackgroundStyle,
  resolveThemePreset,
} from "@/lib/frontend/appearance/themePresets";
import {
  findMatchingPageTemplateKey,
  pageTemplateMap,
  pageTemplates,
} from "@/lib/frontend/appearance/pageTemplates";
import { cn } from "@/lib/frontend/shared/utils";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { FormEvent, PointerEvent, ReactNode } from "react";
import { toast } from "sonner";

type CustomizationFormProps = {
  shellMode?: "stacked" | "appearance";
};

const reportOptionalCustomizationError = (message: string, error: unknown) => {
  console.warn(message, error);
};

const reportCustomizationError = (message: string, error: unknown) => {
  console.error(message, error);
};

const CustomizationForm = ({
  shellMode = "stacked",
}: CustomizationFormProps) => {
  const { user } = useUser();
  const previewContext = useCustomizationPreviewContext();
  const showInlineDesktopPreview = shellMode === "appearance";

  if (showInlineDesktopPreview && !previewContext) {
    throw new Error(
      'CustomizationForm with shellMode="appearance" must be rendered within CustomizationPreviewProvider.',
    );
  }

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerInputRef = useRef<HTMLInputElement>(null);
  const backgroundInputRef = useRef<HTMLInputElement>(null);
  const publishedPreviewStateKeyRef = useRef<string | null>(null);
  const dragStateRef = useRef<{
    type: DragTargetType | null;
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

  const initialState = useMemo(() => createInitialCustomizationFormState(), []);
  const [formData, setFormData] = useState<CustomizationFormData>(
    initialState.formData,
  );
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    snapshotFromForm(initialState.formData),
  );
  const [gradientColors, setGradientColors] = useState<GradientColors>(
    initialState.gradientColors,
  );
  const [socialDraft, setSocialDraft] = useState<SocialDraft>({
    platform: socialPlatforms[0],
    url: "",
  });
  const [activeTab, setActiveTab] = useState<CustomizationTab>("essentials");
  const [isMobilePreviewOpen, setIsMobilePreviewOpen] = useState(false);
  const [isDesktopPreviewVisible, setIsDesktopPreviewVisible] = useState(false);
  const [locationCountry, setLocationCountry] = useState<string | null>(null);
  const [isLocatingCountry, setIsLocatingCountry] = useState(false);
  const [isLoading, startTransition] = useTransition();
  const [isUploading, startUploading] = useTransition();

  // This keeps the mobile preview sheet from staying open when the layout
  // switches to the desktop breakpoint and the inline preview takes over.
  const countryOptions = useMemo(() => getCountryOptions(), []);
  const localePhoneCountry = useMemo(() => {
    if (typeof navigator === "undefined") {
      return "US";
    }

    return resolveLocalePhoneCountry(
      [navigator.language, ...(navigator.languages || [])],
      countryOptions.map((country) => country.code),
    );
  }, [countryOptions]);
  const preferredPhoneCountry = locationCountry || localePhoneCountry;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia(DESKTOP_PREVIEW_XL_MEDIA_QUERY);
    const closeMobilePreviewOnDesktop = (event?: MediaQueryListEvent) => {
      const matchesDesktop = event ? event.matches : mediaQuery.matches;

      setIsDesktopPreviewVisible(matchesDesktop);

      if (matchesDesktop) {
        setIsMobilePreviewOpen(false);
      }
    };

    closeMobilePreviewOnDesktop();
    mediaQuery.addEventListener("change", closeMobilePreviewOnDesktop);

    return () => {
      mediaQuery.removeEventListener("change", closeMobilePreviewOnDesktop);
    };
  }, []);

  useEffect(() => {
    if (!existingCustomization) {
      return;
    }

    // Convert server data into one editable draft object up front.
    // That lets the rest of the form work with simple local state.
    const nextState = createCustomizationFormDataFromExisting({
      existingCustomization,
      defaultPatternValue: initialState.defaultPatternValue,
    });

    setGradientColors(nextState.gradientColors);
    setFormData(nextState.formData);
    setSavedSnapshot(snapshotFromForm(nextState.formData));
  }, [existingCustomization, initialState.defaultPatternValue]);

  useEffect(() => {
    setFormData((currentFormData) => {
      const hasMissingPhoneCountry = currentFormData.profileFields.some(
        (field) => field.type === "phone" && !field.country,
      );

      if (!hasMissingPhoneCountry) {
        return currentFormData;
      }

      return {
        ...currentFormData,
        profileFields: applyPreferredPhoneCountry(
          currentFormData.profileFields,
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
        if (isCancelled) {
          return;
        }

        setLocationCountry(detectedCountry);
        setFormData((currentFormData) => ({
          ...currentFormData,
          profileFields: currentFormData.profileFields.map((field) =>
            field.type === "phone" && !field.country
              ? { ...field, country: detectedCountry }
              : field,
          ),
        }));
      } catch (error) {
        if (!isCancelled) {
          reportOptionalCustomizationError(
            "Automatic location country detection skipped",
            error,
          );
        }
      }
    };

    autofillCountryFromLocation();

    return () => {
      isCancelled = true;
    };
  }, []);

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

    setFormData((currentFormData) => {
      if (currentFormData.featuredLinkId === null) {
        return currentFormData;
      }

      const currentFeaturedLinkStillExists = userLinks.some(
        (link) => link._id === currentFormData.featuredLinkId,
      );

      if (currentFeaturedLinkStillExists) {
        return currentFormData;
      }

      return {
        ...currentFormData,
        featuredLinkId: null,
      };
    });
  }, [formData.featuredLinkId, userLinks]);

  const updateFormData = (updates: Partial<CustomizationFormData>) => {
    setFormData((currentFormData) => ({ ...currentFormData, ...updates }));
  };

  const { handleImageUpload, handleRemoveImage } = useCustomizationImageAssets({
    inputRefs: {
      profile: fileInputRef,
      banner: bannerInputRef,
      background: backgroundInputRef,
    },
    generateUploadUrl,
    updateCustomization,
    removeProfileImage,
    removeBannerImage,
    removeBackgroundImage,
    updateFormData,
    startUploading,
    startRemoving: startTransition,
  });

  const handleInputChange = (
    field: keyof CustomizationFormData,
    value: string | boolean | number,
  ) => {
    updateFormData({ [field]: value } as Partial<CustomizationFormData>);
  };

  const handleGradientChange = (key: "start" | "end", value: string) => {
    const nextGradientColors = { ...gradientColors, [key]: value };
    setGradientColors(nextGradientColors);
    updateFormData({
      backgroundType: "gradient",
      backgroundValue: buildGradientValue(nextGradientColors),
    });
  };

  const handleBackgroundTypeChange = (backgroundType: BackgroundType) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      backgroundType,
      backgroundValue:
        backgroundType === "gradient"
          ? currentFormData.backgroundValue ||
            buildGradientValue(gradientColors)
          : undefined,
    }));
  };

  const handlePatternOverlayToggle = () => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      patternOverlayEnabled: !currentFormData.patternOverlayEnabled,
      patternOverlayValue:
        !currentFormData.patternOverlayEnabled &&
        !currentFormData.patternOverlayValue
          ? patternOptions[0]?.value
          : currentFormData.patternOverlayValue,
      patternOverlayOpacity: currentFormData.patternOverlayOpacity,
    }));
  };

  const handleProfileFieldChange = (
    id: string,
    updates: Partial<ProfileFieldInput>,
  ) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      profileFields: currentFormData.profileFields.map((field) =>
        field.id === id
          ? updateProfileFieldDraft({
              field,
              updates,
              preferredPhoneCountry,
            })
          : field,
      ),
    }));
  };

  const handleAddProfileField = (type: ProfileFieldType) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      profileFields: [
        ...currentFormData.profileFields,
        createProfileFieldDraft(type, preferredPhoneCountry),
      ],
    }));
  };

  const handleRemoveProfileField = (id: string) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      profileFields: currentFormData.profileFields.filter(
        (field) => field.id !== id,
      ),
    }));
  };

  const handleMoveProfileField = (id: string, direction: "up" | "down") => {
    setFormData((currentFormData) => {
      const currentIndex = currentFormData.profileFields.findIndex(
        (field) => field.id === id,
      );

      if (currentIndex === -1) {
        return currentFormData;
      }

      const targetIndex =
        direction === "up" ? currentIndex - 1 : currentIndex + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= currentFormData.profileFields.length
      ) {
        return currentFormData;
      }

      const nextProfileFields = [...currentFormData.profileFields];
      const [movedField] = nextProfileFields.splice(currentIndex, 1);
      nextProfileFields.splice(targetIndex, 0, movedField);

      return {
        ...currentFormData,
        profileFields: nextProfileFields,
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
        reportCustomizationError(
          "Failed to detect country from location",
          error,
        );
        toast.error("Could not detect your country automatically.");
      } finally {
        setIsLocatingCountry(false);
      }
    });
  };

  const handleDragStart =
    (type: DragTargetType) => (event: PointerEvent<HTMLDivElement>) => {
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
    (type: DragTargetType) => (event: PointerEvent<HTMLDivElement>) => {
      const dragState = dragStateRef.current;

      if (dragState.type !== type || !dragState.rect) {
        return;
      }

      const dx = event.clientX - dragState.startX;
      const dy = event.clientY - dragState.startY;
      const nextX = clampPercent(
        dragState.startPosX - (dx / dragState.rect.width) * 100,
      );
      const nextY = clampPercent(
        dragState.startPosY - (dy / dragState.rect.height) * 100,
      );

      setFormData((currentFormData) =>
        type === "background"
          ? {
              ...currentFormData,
              backgroundImagePositionX: nextX,
              backgroundImagePositionY: nextY,
            }
          : {
              ...currentFormData,
              bannerImagePositionX: nextX,
              bannerImagePositionY: nextY,
            },
      );
    };

  const handleDragEnd = () => {
    dragStateRef.current.type = null;
  };

  const handleSocialDraftPlatformChange = (platform: SocialPlatform) => {
    setSocialDraft((currentDraft) => ({ ...currentDraft, platform }));
  };

  const handleSocialDraftUrlChange = (url: string) => {
    setSocialDraft((currentDraft) => ({ ...currentDraft, url }));
  };

  const handleAddSocialLink = () => {
    if (!socialDraft.url) {
      return;
    }

    const formattedUrl = normalizeSocialUrl(
      socialDraft.url,
      socialDraft.platform,
    );

    setFormData((currentFormData) => ({
      ...currentFormData,
      socialLinks: [
        ...currentFormData.socialLinks,
        { platform: socialDraft.platform, url: formattedUrl },
      ],
    }));
    setSocialDraft((currentDraft) => ({ ...currentDraft, url: "" }));
  };

  const handleRemoveSocialLink = (index: number) => {
    setFormData((currentFormData) => ({
      ...currentFormData,
      socialLinks: currentFormData.socialLinks.filter(
        (_, currentIndex) => currentIndex !== index,
      ),
    }));
  };

  const handleApplyTemplate = (templateKey: string) => {
    const template = pageTemplateMap.get(templateKey);

    if (!template) {
      return;
    }

    const preset = resolveThemePreset(template.themePreset);
    const nextGradientColors = extractGradientColors(preset.background.value);
    const defaultPatternValue =
      preset.background.type === "pattern"
        ? preset.background.value
        : patternOptions[0]?.value;

    setGradientColors(nextGradientColors);
    setFormData((currentFormData) => ({
      ...currentFormData,
      description: template.suggestedDescription,
      themePreset: preset.key,
      accentColor: preset.accentColor,
      fontFamily: sanitizeDashboardFontFamily(preset.fontFamily),
      layoutStyle: template.layoutStyle,
      linkStyle: template.linkStyle,
      avatarShape: template.avatarShape,
      featuredLinkId:
        template.featuredLinkStrategy === "first-link" && userLinks?.[0]?._id
          ? userLinks[0]._id
          : currentFormData.featuredLinkId,
      backgroundType:
        preset.background.type === "pattern" ? "solid" : preset.background.type,
      backgroundValue:
        preset.background.type === "gradient"
          ? preset.background.value
          : undefined,
      backgroundSolidColor:
        preset.background.baseColor || nextGradientColors.start,
      patternOverlayEnabled: preset.background.type === "pattern",
      patternOverlayValue: defaultPatternValue,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!user) {
      return;
    }

    startTransition(async () => {
      try {
        const sanitizedFormData = {
          ...formData,
          fontFamily: sanitizeDashboardFontFamily(formData.fontFamily),
        };

        await updateCustomization(
          createCustomizationUpdatePayload(sanitizedFormData),
        );

        setSavedSnapshot(snapshotFromForm(sanitizedFormData));
        toast.success("Customizations saved successfully.");
      } catch (error) {
        reportCustomizationError("Failed to save customizations", error);
        toast.error("Failed to save customizations.");
      }
    });
  };

  // Treat the preview as a mini public-page model. That is much easier to
  // understand than mixing raw form state and rendering concerns everywhere.
  const previewPreset = resolveThemePreset(formData.themePreset);
  const previewBackgroundStyle = useMemo(
    () =>
      getBackgroundStyle({
        backgroundType: formData.backgroundType,
        backgroundValue: formData.backgroundValue,
        backgroundImageUrl:
          formData.backgroundType === "image"
            ? existingCustomization?.backgroundImageUrl
            : undefined,
        backgroundSolidColor: formData.backgroundSolidColor,
        patternOverlayEnabled: formData.patternOverlayEnabled,
        patternOverlayValue: formData.patternOverlayValue,
        patternOverlayOpacity: formData.patternOverlayOpacity,
        backgroundImagePositionX: formData.backgroundImagePositionX,
        backgroundImagePositionY: formData.backgroundImagePositionY,
        preset: previewPreset,
      }),
    [
      existingCustomization?.backgroundImageUrl,
      formData.backgroundImagePositionX,
      formData.backgroundImagePositionY,
      formData.backgroundSolidColor,
      formData.backgroundType,
      formData.backgroundValue,
      formData.patternOverlayEnabled,
      formData.patternOverlayValue,
      formData.patternOverlayOpacity,
      previewPreset,
    ],
  );

  const dashboardPreviewModel = useMemo(
    () =>
      buildDashboardPreviewModel({
        displayName:
          formData.displayName ||
          user?.fullName ||
          user?.username ||
          user?.firstName ||
          user?.lastName,
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
      formData.displayName,
      formData.featuredLinkId,
      user?.firstName,
      user?.fullName,
      user?.id,
      user?.lastName,
      user?.username,
      userLinks,
    ],
  );

  const basePreviewContentProps = useMemo<DashboardPreviewContentProps>(
    () =>
      createBasePreviewContentProps({
        dashboardPreviewModel,
        existingCustomization,
        formData,
      }),
    [dashboardPreviewModel, existingCustomization, formData],
  );

  const previewFontFamily = sanitizeDashboardFontFamily(formData.fontFamily);
  const appearancePreviewState = useMemo<DesktopPreviewState>(
    () => ({
      previewBackgroundStyle,
      fontFamily: previewFontFamily,
      contentProps: basePreviewContentProps,
    }),
    [basePreviewContentProps, previewBackgroundStyle, previewFontFamily],
  );
  const appearancePreviewStateKey = useMemo(
    () => getDesktopPreviewStateKey(appearancePreviewState),
    [appearancePreviewState],
  );

  useEffect(() => {
    if (!showInlineDesktopPreview || !previewContext) {
      return;
    }

    if (publishedPreviewStateKeyRef.current === appearancePreviewStateKey) {
      return;
    }

    publishedPreviewStateKeyRef.current = appearancePreviewStateKey;
    previewContext.setPreviewState(appearancePreviewState);
  }, [
    appearancePreviewState,
    appearancePreviewStateKey,
    previewContext,
    showInlineDesktopPreview,
  ]);

  useEffect(() => {
    if (!showInlineDesktopPreview || !previewContext) {
      return;
    }

    return () => {
      publishedPreviewStateKeyRef.current = null;
      previewContext.setPreviewState(null);
    };
  }, [previewContext, showInlineDesktopPreview]);

  const sharedPreviewContentProps = {
    ...basePreviewContentProps,
    bannerDragProps: createBannerDragProps({
      bannerImageUrl: existingCustomization?.bannerImageUrl,
      onPointerDown: handleDragStart("banner"),
      onPointerMove: handleDragMove("banner"),
      onPointerEnd: handleDragEnd,
    }),
  };
  const mobilePreviewContentProps = {
    ...basePreviewContentProps,
    bannerDragProps: undefined,
  };

  const {
    accentForeground,
    accentGradient,
    accentBadgeStyle,
    accentButtonStyle,
    accentControlVars,
  } = useMemo(
    () => createAccentStyles(formData.accentColor),
    [formData.accentColor],
  );
  const hasUnsavedChanges = snapshotFromForm(formData) !== savedSnapshot;
  const selectedTemplateKey = useMemo(
    () =>
      findMatchingPageTemplateKey({
        avatarShape: formData.avatarShape,
        layoutStyle: formData.layoutStyle,
        linkStyle: formData.linkStyle,
        themePreset: formData.themePreset,
      }),
    [
      formData.avatarShape,
      formData.layoutStyle,
      formData.linkStyle,
      formData.themePreset,
    ],
  );
  const qrProfileUrl = `${getBaseUrl()}/q/${dashboardPreviewModel.shareSlug}`;
  const appearanceChecklist = useMemo(
    () =>
      getAppearanceChecklistItems(
        createDashboardSetupChecklist({
          customization: existingCustomization,
          linkCount: userLinks?.length ?? 0,
        }),
      ),
    [existingCustomization, userLinks],
  );
  const incompleteAppearanceItems = appearanceChecklist.filter(
    (item) => !item.complete,
  );
  const showAppearanceEmptyState = incompleteAppearanceItems.length > 0;
  const appearancePrimaryAction = incompleteAppearanceItems[0]
    ? getDashboardSetupAction(incompleteAppearanceItems[0].key)
    : null;
  const desktopPreview = (
    <DesktopFloatingPreview
      previewBackgroundStyle={previewBackgroundStyle}
      fontFamily={previewFontFamily}
      contentProps={sharedPreviewContentProps}
    />
  );
  const tabPanels: Record<CustomizationTab, ReactNode> = {
    essentials: (
      <CustomizationEssentialsPanel
        displayName={formData.displayName}
        accentColor={formData.accentColor}
        fontFamily={formData.fontFamily}
        fontGroups={dashboardEditableFontsByCategory}
        sectionCardClass={dashboardSectionClasses.sectionCard}
        sectionHeaderClass={dashboardSectionClasses.sectionHeader}
        sectionTitleClass={dashboardSectionClasses.sectionTitle}
        sectionHelpClass={dashboardSectionClasses.sectionHelp}
        accentBadgeStyle={accentBadgeStyle}
        onDisplayNameChange={(value) =>
          handleInputChange("displayName", value)
        }
        onAccentColorChange={(value) => handleInputChange("accentColor", value)}
        onFontFamilyChange={(value) => handleInputChange("fontFamily", value)}
      />
    ),
    layout: (
      <CustomizationLayoutPanel
        layoutStyle={formData.layoutStyle}
        linkStyle={formData.linkStyle}
        avatarShape={formData.avatarShape}
        featuredLinkId={formData.featuredLinkId}
        pageTemplates={pageTemplates}
        selectedTemplateKey={selectedTemplateKey}
        linkStyleOptions={linkStyleOptions}
        avatarShapeOptions={avatarShapeOptions}
        userLinks={userLinks}
        featuredLinkPreviewTitle={
          dashboardPreviewModel.selectedFeaturedLink?.title ?? null
        }
        sectionCardClass={dashboardSectionClasses.sectionCard}
        sectionHeaderClass={dashboardSectionClasses.sectionHeader}
        sectionTitleClass={dashboardSectionClasses.sectionTitle}
        sectionHelpClass={dashboardSectionClasses.sectionHelp}
        accentBadgeStyle={accentBadgeStyle}
        accentButtonStyle={accentButtonStyle}
        accentControlVars={accentControlVars}
        onLayoutStyleChange={(value) => updateFormData({ layoutStyle: value })}
        onLinkStyleChange={(value) => updateFormData({ linkStyle: value })}
        onFeaturedLinkChange={(value) =>
          updateFormData({ featuredLinkId: value })
        }
        onAvatarShapeChange={(value) => updateFormData({ avatarShape: value })}
        onApplyTemplate={handleApplyTemplate}
      />
    ),
    media: (
      <CustomizationMediaPanel
        backgroundType={formData.backgroundType}
        backgroundSolidColor={formData.backgroundSolidColor}
        patternOverlayEnabled={formData.patternOverlayEnabled}
        patternOverlayValue={formData.patternOverlayValue}
        patternOverlayOpacity={formData.patternOverlayOpacity}
        backgroundImagePositionX={formData.backgroundImagePositionX}
        backgroundImagePositionY={formData.backgroundImagePositionY}
        bannerImagePositionX={formData.bannerImagePositionX}
        bannerImagePositionY={formData.bannerImagePositionY}
        accentColor={formData.accentColor}
        gradientColors={gradientColors}
        isUploading={isUploading}
        settingsGroupClass={dashboardSectionClasses.settingsGroup}
        sectionCardClass={dashboardSectionClasses.sectionCard}
        sectionHeaderClass={dashboardSectionClasses.sectionHeader}
        sectionTitleClass={dashboardSectionClasses.sectionTitle}
        sectionHelpClass={dashboardSectionClasses.sectionHelp}
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
        onPatternOverlayValueChange={(value) =>
          updateFormData({ patternOverlayValue: value })
        }
        onPatternOverlayOpacityChange={(value) =>
          updateFormData({ patternOverlayOpacity: value })
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
    ),
    bio: (
      <CustomizationBioSocialPanel
        description={formData.description}
        profileFields={formData.profileFields}
        socialLinks={formData.socialLinks}
        socialDraft={socialDraft}
        countryOptions={countryOptions}
        preferredPhoneCountry={preferredPhoneCountry}
        isLocatingCountry={isLocatingCountry}
        sectionCardClass={dashboardSectionClasses.sectionCard}
        sectionHeaderClass={dashboardSectionClasses.sectionHeader}
        sectionTitleClass={dashboardSectionClasses.sectionTitle}
        sectionHelpClass={dashboardSectionClasses.sectionHelp}
        accentBadgeStyle={accentBadgeStyle}
        accentButtonStyle={accentButtonStyle}
        onDescriptionChange={(value) => handleInputChange("description", value)}
        onAddProfileField={handleAddProfileField}
        onProfileFieldChange={handleProfileFieldChange}
        onMoveProfileField={handleMoveProfileField}
        onRemoveProfileField={handleRemoveProfileField}
        onUseLocationForPhone={handleUseLocationForPhone}
        onSocialDraftPlatformChange={handleSocialDraftPlatformChange}
        onSocialDraftUrlChange={handleSocialDraftUrlChange}
        onAddSocialLink={handleAddSocialLink}
        onRemoveSocialLink={handleRemoveSocialLink}
      />
    ),
  };

  return (
    <div className="dashboard-shell dashboard-no-bg-patterns dashboard-shell-inner w-full">
      <CustomizationFormHeader
        accentGradient={accentGradient}
        accentForeground={accentForeground}
        layoutStyleLabel={formatLayoutStyleLabel(formData.layoutStyle)}
        linkStyleLabel={formData.linkStyle}
      />

      <div className="space-y-5 sm:space-y-6">
        <section className="min-w-0">
          <form
            onSubmit={handleSubmit}
            className="space-y-6 pb-28 sm:space-y-8 xl:pb-0"
          >
            {showAppearanceEmptyState ? (
              <AppearanceSetupTooltip
                title={
                  incompleteAppearanceItems.length ===
                  appearanceChecklist.length
                    ? "Your page still looks close to the default"
                    : "Finish the appearance basics"
                }
                description={
                  incompleteAppearanceItems.length ===
                  appearanceChecklist.length
                    ? "A few fast changes make the page feel intentional. Start with identity first, then move into layout and media once the basics feel right."
                    : "You already started shaping the page. Finishing the remaining basics will make the profile feel more complete and trustworthy."
                }
                steps={incompleteAppearanceItems.map((item) => ({
                  key: item.key,
                  title: item.label,
                  description: item.description,
                }))}
                primaryAction={
                  appearancePrimaryAction
                    ? {
                        label: appearancePrimaryAction.label,
                        onClick: () =>
                          setActiveTab(
                            getAppearanceTabForChecklistKey(
                              incompleteAppearanceItems[0].key,
                            ),
                          ),
                      }
                    : null
                }
                showMobilePreviewAction={!isDesktopPreviewVisible}
                onOpenMobilePreview={() => setIsMobilePreviewOpen(true)}
              />
            ) : null}

            {/* Tabs split the editor into smaller mental chunks instead of one giant form. */}
            <CustomizationTabList
              activeTab={activeTab}
              tabs={customizationTabs}
              accentButtonStyle={accentButtonStyle}
              accentControlVars={accentControlVars}
              onTabChange={setActiveTab}
            />

            <div className="grid gap-6 xl:gap-8">
              <div className="min-w-0 space-y-6">
                {/* Render one focused section at a time so the file mirrors the
                    actual dashboard experience: choose a tab, then read that panel. */}
                {customizationTabs.map((tab) => (
                  <CustomizationTabPanel
                    key={tab.value}
                    activeTab={activeTab}
                    tab={tab.value}
                  >
                    {tabPanels[tab.value]}
                  </CustomizationTabPanel>
                ))}
              </div>
            </div>

            <CustomizationSaveBar
              isLoading={isLoading}
              isUploading={isUploading}
              hasUnsavedChanges={hasUnsavedChanges}
              accentButtonStyle={accentButtonStyle}
            />
          </form>
        </section>

        <MobilePreviewSheet
          open={isMobilePreviewOpen}
          onOpenChange={setIsMobilePreviewOpen}
          previewBackgroundStyle={previewBackgroundStyle}
          fontFamily={previewFontFamily}
          contentProps={mobilePreviewContentProps}
          triggerStyle={accentButtonStyle}
          hasUnsavedChanges={hasUnsavedChanges}
        />

        {!showInlineDesktopPreview ? (
          <div className="hidden xl:block">{desktopPreview}</div>
        ) : null}

        <div
          className={cn(showInlineDesktopPreview ? "mt-0 xl:hidden" : "mt-6")}
        >
          <CustomizationQrPanel
            accentColor={formData.accentColor}
            qrProfileUrl={qrProfileUrl}
            shareSlug={dashboardPreviewModel.shareSlug}
            showInlineDesktopPreview={showInlineDesktopPreview}
          />
        </div>
      </div>
    </div>
  );
};

export { CustomizationDesktopPreviewRail, CustomizationPreviewProvider };
export default CustomizationForm;
