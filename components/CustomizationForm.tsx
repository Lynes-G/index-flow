"use client";

import { api } from "@/convex/_generated/api";
import { useUser } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import {
  ImageIcon,
  Palette,
  Upload,
  X,
  LayoutGrid,
  LayoutList,
  Sparkles,
  Type,
  Link as LinkIcon,
  Circle,
  Square,
  User,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { ComponentType } from "react";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
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

const previewLayoutClassMap: Record<LayoutStyle, string> = {
  stacked: "space-y-4",
  cards: "space-y-4",
  grid: "grid grid-cols-1 gap-4 sm:grid-cols-2",
};

const previewLinkStyleMap: Record<LinkStyle, string> = {
  pill: "rounded-full border border-slate-200/60 bg-white/90",
  rounded: "rounded-2xl border border-slate-200/60 bg-white/90",
  outline: "rounded-2xl border-2 border-slate-300/70 bg-white/70",
  shadow:
    "rounded-2xl border border-slate-200/40 bg-white/95 shadow-md shadow-slate-900/5",
};

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

const socialPlatforms = [
  "Instagram",
  "TikTok",
  "YouTube",
  "X",
  "LinkedIn",
  "GitHub",
  "Twitch",
  "Facebook",
  "Website",
];

const extractGradientColors = (value?: string) => {
  const matches = value?.match(/#[0-9a-fA-F]{6}/g) || [];
  return {
    start: matches[0] || "#6366F1",
    end: matches[1] || "#F472B6",
  };
};

const normalizeUrl = (url: string) => {
  if (!url) return url;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://${url}`;
};

const snapshotFromForm = (data: {
  description: string;
  accentColor: string;
  themePreset: string;
  fontFamily: string;
  layoutStyle: LayoutStyle;
  linkStyle: LinkStyle;
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
  socialLinks: Array<{ platform: string; url: string }>;
}) => {
  return JSON.stringify({
    description: data.description,
    accentColor: data.accentColor,
    themePreset: data.themePreset,
    fontFamily: data.fontFamily,
    layoutStyle: data.layoutStyle,
    linkStyle: data.linkStyle,
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
    socialLinks: data.socialLinks,
  });
};

const CustomizationForm = () => {
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

  const initialFormState = {
    description: "",
    accentColor: defaultPreset.accentColor,
    themePreset: defaultPreset.key,
    fontFamily: defaultPreset.fontFamily,
    layoutStyle: defaultPreset.layoutStyle,
    linkStyle: defaultPreset.linkStyle,
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
    socialLinks: [] as Array<{ platform: string; url: string }>,
  };

  const [formData, setFormData] = useState(initialFormState);
  const [savedSnapshot, setSavedSnapshot] = useState(() =>
    snapshotFromForm(initialFormState),
  );
  const [previewCompact, setPreviewCompact] = useState(false);

  const [gradientColors, setGradientColors] = useState(() =>
    extractGradientColors(defaultPreset.background.value),
  );

  const [socialDraft, setSocialDraft] = useState({
    platform: socialPlatforms[0],
    url: "",
  });

  const [isLoading, startTransition] = useTransition();
  const [isUploading, startUploading] = useTransition();

  const uniqueFonts = useMemo(() => {
    const fonts = new Set(themePresetList.map((preset) => preset.fontFamily));
    return Array.from(fonts);
  }, []);

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
        fontFamily: existingCustomization.fontFamily || preset.fontFamily,
        layoutStyle: (existingCustomization.layoutStyle ||
          preset.layoutStyle) as LayoutStyle,
        linkStyle: (existingCustomization.linkStyle ||
          preset.linkStyle) as LinkStyle,
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
        socialLinks: existingCustomization.socialLinks || [],
      };

      setFormData(nextFormData);
      setSavedSnapshot(snapshotFromForm(nextFormData));
    }
  }, [existingCustomization]);

  const handleGradientChange = (key: "start" | "end", value: string) => {
    const nextColors = { ...gradientColors, [key]: value };
    const gradientValue = `linear-gradient(135deg, ${nextColors.start} 0%, ${nextColors.end} 100%)`;
    setGradientColors(nextColors);
    setFormData((prev) => ({
      ...prev,
      backgroundType: "gradient",
      backgroundValue: gradientValue,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    startTransition(async () => {
      try {
        await updateCustomization({
          description: formData.description || undefined,
          accentColor: formData.accentColor || undefined,
          themePreset: formData.themePreset || undefined,
          fontFamily: formData.fontFamily || undefined,
          layoutStyle: formData.layoutStyle || undefined,
          linkStyle: formData.linkStyle || undefined,
          backgroundType: formData.backgroundType || undefined,
          backgroundValue:
            formData.backgroundType === "gradient"
              ? formData.backgroundValue || undefined
              : undefined,
          backgroundSolidColor: formData.backgroundSolidColor || undefined,
          patternOverlayEnabled: formData.patternOverlayEnabled,
          patternOverlayValue: formData.patternOverlayEnabled
            ? formData.patternOverlayValue || undefined
            : undefined,
          backgroundImagePositionX: formData.backgroundImagePositionX,
          backgroundImagePositionY: formData.backgroundImagePositionY,
          bannerImagePositionX: formData.bannerImagePositionX,
          bannerImagePositionY: formData.bannerImagePositionY,
          avatarShape: formData.avatarShape || undefined,
          socialLinks: formData.socialLinks,
        });
        setSavedSnapshot(snapshotFromForm(formData));
        toast.success("Customizations saved successfully.");
      } catch (err) {
        console.log("Failed to save customizations:", err);
        toast.error("Failed to save customizations.");
      }
    });
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner" | "background",
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

        if (type === "profile") {
          await updateCustomization({
            profilePictureStorageId: storageId,
          });
        }

        if (type === "banner") {
          await updateCustomization({
            bannerImageStorageId: storageId,
          });
        }

        if (type === "background") {
          await updateCustomization({
            backgroundImageStorageId: storageId,
            backgroundType: "image",
            backgroundValue: undefined,
          });
          setFormData((prev) => ({
            ...prev,
            backgroundType: "image",
          }));
        }
        toast.success("Image uploaded successfully.");
      } catch (err) {
        console.log("Upload failed", err);
        toast.error("Failed to upload image.");
      } finally {
        if (type === "profile" && fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        if (type === "banner" && bannerInputRef.current) {
          bannerInputRef.current.value = "";
        }
        if (type === "background" && backgroundInputRef.current) {
          backgroundInputRef.current.value = "";
        }
      }
    });
  };

  const handleRemoveImage = (type: "profile" | "banner" | "background") => {
    startTransition(async () => {
      try {
        if (type === "profile") {
          await removeProfileImage();
        }
        if (type === "banner") {
          await removeBannerImage();
        }
        if (type === "background") {
          await removeBackgroundImage();
        }
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
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    const formattedUrl = normalizeUrl(socialDraft.url);
    setFormData((prev) => ({
      ...prev,
      socialLinks: [
        ...prev.socialLinks,
        { platform: socialDraft.platform, url: formattedUrl },
      ],
    }));
    setSocialDraft((prev) => ({ ...prev, url: "" }));
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
  const previewName =
    user?.username || user?.firstName || user?.lastName || "Your Name";
  const previewLinks = [
    { title: "Portfolio", url: "https://example.com" },
    { title: "Latest Work", url: "https://example.com" },
    { title: "Newsletter", url: "https://example.com" },
  ];

  const sectionCardClass =
    "rounded-2xl border border-slate-200/70 bg-white/90 p-5 shadow-sm lg:p-6";
  const sectionHeaderClass = "flex items-start gap-3";
  const sectionTitleClass = "text-base font-semibold text-slate-900";
  const sectionHelpClass = "text-xs text-slate-500";
  const accentGradient = `linear-gradient(135deg, ${formData.accentColor} 0%, ${formData.accentColor}aa 100%)`;
  const hasUnsavedChanges = useMemo(() => {
    return snapshotFromForm(formData) !== savedSnapshot;
  }, [formData, savedSnapshot]);

  return (
    <div className="w-full rounded-2xl border border-slate-200/70 bg-white/95 p-8 shadow-sm">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="rounded-xl p-2"
            style={{ background: accentGradient }}
          >
            <Palette className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Customize your page
            </h2>
            <p className="text-sm text-slate-600">
              Shape the look and feel of your link-in-bio.
            </p>
          </div>
        </div>
        <div className="hidden items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-500 shadow-sm md:flex">
          <span>Live preview</span>
          <span className="text-slate-300">•</span>
          <span>
            {formData.layoutStyle} · {formData.linkStyle}
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="lg:grid lg:grid-cols-[1.05fr_0.95fr] lg:gap-8"
      >
        <div className="space-y-6">
          <section className={sectionCardClass}>
            <div className="mb-4">
              <div className={sectionHeaderClass}>
                <div className="rounded-lg bg-slate-900 p-2">
                  <Sparkles className="size-4 text-white" />
                </div>
                <div>
                  <p className={sectionTitleClass}>Essentials</p>
                  <p className={sectionHelpClass}>
                    Set your brand color and font.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-3">
                  <Label htmlFor="accentColor">Accent Color</Label>
                  <div className="flex items-center gap-4">
                    <input
                      id="accentColor"
                      type="color"
                      value={formData.accentColor}
                      onChange={(e) =>
                        handleInputChange("accentColor", e.target.value)
                      }
                      className="size-12 cursor-pointer rounded-lg border-2 border-slate-300"
                    />
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        Use this for buttons and accents
                      </p>
                      <p className="text-xs text-slate-500">
                        {formData.accentColor}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="flex items-center gap-2">
                    <Type className="size-4" />
                    Font Family
                  </Label>
                  <select
                    value={formData.fontFamily}
                    onChange={(e) =>
                      handleInputChange("fontFamily", e.target.value)
                    }
                    className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm"
                  >
                    {uniqueFonts.map((font) => (
                      <option key={font} value={font}>
                        {font.split(",")[0].replace(/\"/g, "")}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </section>

          <section className={sectionCardClass}>
            <div className="mb-4">
              <div className={sectionHeaderClass}>
                <div className="rounded-lg bg-slate-900 p-2">
                  <LayoutGrid className="size-4 text-white" />
                </div>
                <div>
                  <p className={sectionTitleClass}>Layout & Links</p>
                  <p className={sectionHelpClass}>
                    Control how your links stack and look.
                  </p>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <LayoutGrid className="size-4" />
                  Layout Style
                </Label>
                <div className="flex flex-wrap gap-2">
                  {layoutOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={
                        formData.layoutStyle === option.value
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          layoutStyle: option.value,
                        }))
                      }
                      className="flex items-center gap-2"
                    >
                      <option.icon className="size-4" />
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <LinkIcon className="size-4" />
                  Link Style
                </Label>
                <div className="flex flex-wrap gap-2">
                  {linkStyleOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={
                        formData.linkStyle === option.value
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          linkStyle: option.value,
                        }))
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-3">
              <Label className="flex items-center gap-2">
                <Circle className="size-4" />
                Avatar Shape
              </Label>
              <div className="flex flex-wrap gap-2">
                {avatarShapeOptions.map((option) => (
                  <Button
                    key={option.value}
                    type="button"
                    variant={
                      formData.avatarShape === option.value
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        avatarShape: option.value,
                      }))
                    }
                    className="flex items-center gap-2"
                  >
                    <option.icon className="size-4" />
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </section>

          <section className={sectionCardClass}>
            <div className="mb-4">
              <div className={sectionHeaderClass}>
                <div className="rounded-lg bg-slate-900 p-2">
                  <ImageIcon className="size-4 text-white" />
                </div>
                <div>
                  <p className={sectionTitleClass}>Media</p>
                  <p className={sectionHelpClass}>
                    Add background, banner, and profile images.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  Background Style
                </Label>
                <div className="flex flex-wrap gap-2">
                  {backgroundTypeOptions.map((option) => (
                    <Button
                      key={option.value}
                      type="button"
                      variant={
                        formData.backgroundType === option.value
                          ? "default"
                          : "outline"
                      }
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          backgroundType: option.value,
                          backgroundValue:
                            option.value === "gradient"
                              ? prev.backgroundValue ||
                                `linear-gradient(135deg, ${gradientColors.start} 0%, ${gradientColors.end} 100%)`
                              : undefined,
                        }))
                      }
                    >
                      {option.label}
                    </Button>
                  ))}
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="backgroundSolidColor">Solid Color</Label>
                    <Input
                      id="backgroundSolidColor"
                      type="color"
                      value={formData.backgroundSolidColor}
                      onChange={(e) =>
                        handleInputChange(
                          "backgroundSolidColor",
                          e.target.value,
                        )
                      }
                      className="h-12 w-full cursor-pointer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Pattern Overlay</Label>
                    <div className="flex items-center gap-3">
                      <input
                        id="patternOverlayEnabled"
                        type="checkbox"
                        checked={formData.patternOverlayEnabled}
                        disabled={formData.backgroundType === "image"}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            patternOverlayEnabled: e.target.checked,
                            patternOverlayValue:
                              e.target.checked && !prev.patternOverlayValue
                                ? patternOptions[0]?.value
                                : prev.patternOverlayValue,
                          }))
                        }
                        className="size-4"
                      />
                      <Label htmlFor="patternOverlayEnabled">
                        Enable overlay
                      </Label>
                    </div>
                    {formData.backgroundType === "image" && (
                      <p className="text-xs text-slate-500">
                        Pattern overlays are available for solid or gradient
                        backgrounds.
                      </p>
                    )}
                  </div>
                </div>

                {formData.backgroundType === "gradient" && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="gradientStart">Gradient Start</Label>
                      <Input
                        id="gradientStart"
                        type="color"
                        value={gradientColors.start}
                        onChange={(e) =>
                          handleGradientChange("start", e.target.value)
                        }
                        className="h-12 w-full cursor-pointer"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="gradientEnd">Gradient End</Label>
                      <Input
                        id="gradientEnd"
                        type="color"
                        value={gradientColors.end}
                        onChange={(e) =>
                          handleGradientChange("end", e.target.value)
                        }
                        className="h-12 w-full cursor-pointer"
                      />
                    </div>
                  </div>
                )}

                {formData.patternOverlayEnabled &&
                  formData.backgroundType !== "image" && (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                      {patternOptions.map((option) => (
                        <button
                          key={option.label}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              patternOverlayValue: option.value,
                            }))
                          }
                          className={cn(
                            "rounded-xl border p-3 text-left",
                            formData.patternOverlayValue === option.value
                              ? "border-slate-900"
                              : "border-slate-200",
                          )}
                        >
                          <div
                            className="mb-2 h-12 rounded-lg"
                            style={{
                              backgroundImage:
                                option.previewValue || option.value,
                              backgroundColor: "#F8FAFC",
                              backgroundSize: "18px 18px",
                              backgroundRepeat: "repeat",
                            }}
                          />
                          <p className="text-sm font-medium text-slate-700">
                            {option.label}
                          </p>
                        </button>
                      ))}
                    </div>
                  )}

                {formData.backgroundType === "image" && (
                  <div className="space-y-4">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                      <div
                        className={cn(
                          "h-36 w-full touch-none rounded-lg border border-slate-200 bg-slate-100 select-none",
                          existingCustomization?.backgroundImageUrl
                            ? "cursor-grab"
                            : "cursor-default",
                        )}
                        style={
                          existingCustomization?.backgroundImageUrl
                            ? {
                                backgroundImage: `url(${existingCustomization.backgroundImageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: `${formData.backgroundImagePositionX}% ${formData.backgroundImagePositionY}%`,
                              }
                            : undefined
                        }
                        onPointerDown={handleDragStart("background")}
                        onPointerMove={handleDragMove("background")}
                        onPointerUp={handleDragEnd}
                        onPointerLeave={handleDragEnd}
                      >
                        {!existingCustomization?.backgroundImageUrl && (
                          <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                            Upload a background image to position it
                          </div>
                        )}
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <p className="text-sm text-slate-600">
                          Drag to reposition
                        </p>
                        {existingCustomization?.backgroundImageUrl && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveImage("background")}
                            disabled={isUploading}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <X className="mr-1 size-4" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <input
                        type="file"
                        ref={backgroundInputRef}
                        accept="image/*"
                        onChange={(e) => handleImageUpload(e, "background")}
                        className="hidden"
                        disabled={isUploading}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => backgroundInputRef.current?.click()}
                        disabled={isUploading}
                        className="flex items-center gap-2"
                      >
                        <Upload className="size-4" />
                        {isUploading ? "Uploading..." : "Upload Background"}
                      </Button>
                      <p className="text-sm text-slate-500">Max 5MB</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    Banner Image
                  </Label>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div
                        className={cn(
                          "h-20 w-32 touch-none overflow-hidden rounded-lg bg-slate-100 select-none",
                          existingCustomization?.bannerImageUrl
                            ? "cursor-grab"
                            : "cursor-default",
                        )}
                        style={
                          existingCustomization?.bannerImageUrl
                            ? {
                                backgroundImage: `url(${existingCustomization.bannerImageUrl})`,
                                backgroundSize: "cover",
                                backgroundPosition: `${formData.bannerImagePositionX}% ${formData.bannerImagePositionY}%`,
                              }
                            : undefined
                        }
                        onPointerDown={handleDragStart("banner")}
                        onPointerMove={handleDragMove("banner")}
                        onPointerUp={handleDragEnd}
                        onPointerLeave={handleDragEnd}
                      >
                        {!existingCustomization?.bannerImageUrl && (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                            No banner
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                          <input
                            type="file"
                            ref={bannerInputRef}
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "banner")}
                            className="hidden"
                            disabled={isUploading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => bannerInputRef.current?.click()}
                            disabled={isUploading}
                            className="flex items-center gap-2"
                          >
                            <Upload className="size-4" />
                            {isUploading ? "Uploading..." : "Upload Banner"}
                          </Button>
                          {existingCustomization?.bannerImageUrl && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveImage("banner")}
                              disabled={isUploading}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <X className="mr-1 size-4" />
                              Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          Recommended: 1200x400 · Max 5MB
                        </p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500">
                      Drag the preview to reposition
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label className="flex items-center gap-2">
                    Profile Picture
                  </Label>
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div className="size-16 overflow-hidden rounded-full bg-slate-100">
                        {existingCustomization?.profilePictureUrl ? (
                          <Image
                            src={existingCustomization.profilePictureUrl}
                            alt="Current Profile Picture"
                            width={64}
                            height={64}
                            className="h-full w-full rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                            No photo
                          </div>
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
                          <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e, "profile")}
                            className="hidden"
                            disabled={isUploading}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isUploading}
                            className="flex items-center gap-2"
                          >
                            <Upload className="size-4" />
                            {isUploading ? "Uploading..." : "Upload Photo"}
                          </Button>
                          {existingCustomization?.profilePictureUrl && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => handleRemoveImage("profile")}
                              disabled={isUploading}
                              className="text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                              <X className="mr-1 size-4" />
                              Remove
                            </Button>
                          )}
                        </div>
                        <p className="text-xs text-slate-500">
                          Max 5MB. JPG, PNG, WebP
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={sectionCardClass}>
            <div className="mb-4">
              <div className={sectionHeaderClass}>
                <div className="rounded-lg bg-slate-900 p-2">
                  <LinkIcon className="size-4 text-white" />
                </div>
                <div>
                  <p className={sectionTitleClass}>Bio & Social</p>
                  <p className={sectionHelpClass}>
                    Tell visitors who you are and where to find you.
                  </p>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                  placeholder="Tell visitors about yourself..."
                  rows={3}
                  maxLength={200}
                  className="resize-vertical max-h-[200px] min-h-[100px] w-full rounded-md border border-slate-300 px-3 py-2 focus-visible:border-transparent focus-visible:ring-2 focus-visible:outline-none"
                />
                <p className="text-sm text-slate-500">
                  {formData.description.length}/200 characters
                </p>
              </div>

              <div className="space-y-4">
                <Label className="flex items-center gap-2">Social Links</Label>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_2fr_auto]">
                  <select
                    value={socialDraft.platform}
                    onChange={(e) =>
                      setSocialDraft((prev) => ({
                        ...prev,
                        platform: e.target.value,
                      }))
                    }
                    className="h-10 rounded-md border border-slate-300 px-3 text-sm"
                  >
                    {socialPlatforms.map((platform) => (
                      <option key={platform} value={platform}>
                        {platform}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="text"
                    value={socialDraft.url}
                    onChange={(e) =>
                      setSocialDraft((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                    placeholder="https://..."
                  />
                  <Button type="button" onClick={handleAddSocialLink}>
                    Add Link
                  </Button>
                </div>
                {formData.socialLinks.length > 0 && (
                  <div className="space-y-2">
                    {formData.socialLinks.map((link, index) => (
                      <div
                        key={`${link.platform}-${index}`}
                        className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-4 py-2"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-800">
                            {link.platform}
                          </p>
                          <p className="text-xs text-slate-500">{link.url}</p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleRemoveSocialLink(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-lg backdrop-blur">
            <Button
              type="submit"
              disabled={isUploading || isLoading}
              className="w-full bg-linear-to-r from-purple-500 to-pink-500 transition-opacity hover:opacity-90"
            >
              {isLoading ? "Saving..." : "Save Customizations"}
            </Button>
            {hasUnsavedChanges && !isLoading && (
              <p className="mt-2 text-xs font-medium text-amber-700">
                Unsaved changes
              </p>
            )}
          </div>
        </div>
        <aside className="mt-8 lg:sticky lg:top-6 lg:mt-0 lg:self-start">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Live preview
                </p>
                <p className="text-xs text-slate-500">
                  Mirrors the public page layout
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewCompact((prev) => !prev)}
                className="rounded-full bg-white px-3 py-1 text-xs text-slate-500 shadow-sm transition hover:text-slate-700"
              >
                {previewCompact ? "Desktop preview" : "Mobile preview"}
              </button>
            </div>
            <div
              className={cn(
                "rounded-[28px] border border-slate-200/80 bg-white/95 p-2 shadow-lg",
                previewCompact && "mx-auto max-w-[320px]",
              )}
            >
              <div
                className="overflow-hidden rounded-[24px] border border-white/70"
                style={{
                  ...previewBackgroundStyle,
                  fontFamily: formData.fontFamily,
                }}
              >
                <div
                  className={cn(
                    "relative h-20 touch-none select-none",
                    existingCustomization?.bannerImageUrl
                      ? "cursor-grab"
                      : "cursor-default",
                  )}
                  style={
                    existingCustomization?.bannerImageUrl
                      ? {
                          backgroundImage: `url(${existingCustomization.bannerImageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: `${formData.bannerImagePositionX}% ${formData.bannerImagePositionY}%`,
                        }
                      : {
                          background: `linear-gradient(135deg, ${formData.accentColor} 0%, ${formData.accentColor}bb 100%)`,
                        }
                  }
                  onPointerDown={handleDragStart("banner")}
                  onPointerMove={handleDragMove("banner")}
                  onPointerUp={handleDragEnd}
                  onPointerLeave={handleDragEnd}
                >
                  <div className="absolute inset-0 bg-black/10" />
                </div>

                <div className="-mt-10 space-y-4 px-4 pb-6">
                  <div className="relative z-10 rounded-2xl border border-white/60 bg-white/95 p-4 shadow-md">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "size-14 bg-white p-1 shadow",
                          formData.avatarShape === "circle"
                            ? "rounded-full"
                            : formData.avatarShape === "rounded"
                              ? "rounded-2xl"
                              : "rounded-none",
                        )}
                      >
                        <div
                          className={cn(
                            "h-full w-full overflow-hidden",
                            formData.avatarShape === "circle"
                              ? "rounded-full"
                              : formData.avatarShape === "rounded"
                                ? "rounded-2xl"
                                : "rounded-none",
                          )}
                        >
                          {existingCustomization?.profilePictureUrl ? (
                            <Image
                              src={existingCustomization.profilePictureUrl}
                              alt="Profile preview"
                              width={56}
                              height={56}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-slate-500">
                              <User className="size-6" />
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          @{previewName}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formData.description || "Add a short bio..."}
                        </p>
                      </div>
                    </div>

                    {formData.socialLinks.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {formData.socialLinks.slice(0, 3).map((link, index) => (
                          <span
                            key={`${link.platform}-${index}`}
                            className="rounded-full border bg-white px-3 py-1 text-xs text-slate-600"
                            style={{ borderColor: `${formData.accentColor}44` }}
                          >
                            {link.platform}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-white/60 bg-white/95 p-4 shadow-md">
                    <div
                      className={cn(
                        previewLayoutClassMap[formData.layoutStyle],
                      )}
                    >
                      {previewLinks.map((link, index) => (
                        <div
                          key={`${link.title}-${index}`}
                          className={cn(
                            "px-4 py-3 text-sm text-slate-800",
                            previewLinkStyleMap[formData.linkStyle],
                          )}
                          style={{ borderColor: `${formData.accentColor}44` }}
                        >
                          {link.title}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
};

export default CustomizationForm;
