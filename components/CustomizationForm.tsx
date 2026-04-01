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
  GripVertical,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import type { ComponentType, ReactNode } from "react";
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

type CustomizationTab = "essentials" | "layout" | "media" | "bio";

const customizationTabs: Array<{ value: CustomizationTab; label: string }> = [
  { value: "essentials", label: "Essentials" },
  { value: "layout", label: "Layout" },
  { value: "media", label: "Media" },
  { value: "bio", label: "Bio & Social" },
];

type ColorSelectorProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  helperText?: string;
  className?: string;
  inputClassName?: string;
};

const ColorSelector = ({
  id,
  label,
  value,
  onChange,
  helperText,
  className,
  inputClassName,
}: ColorSelectorProps) => (
  <div className={cn("space-y-2", className)}>
    {label ? <Label htmlFor={id}>{label}</Label> : null}
    <Input
      id={id}
      type="color"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={cn("h-12 w-full cursor-pointer", inputClassName)}
    />
    {helperText ? <p className="text-xs text-slate-500">{helperText}</p> : null}
  </div>
);

type UploadImageCardProps = {
  title: string;
  preview: ReactNode;
  actions: ReactNode;
  helperText?: string;
  footerText?: string;
};

const UploadImageCard = ({
  title,
  preview,
  actions,
  helperText,
  footerText,
}: UploadImageCardProps) => (
  <div className="space-y-4">
    <Label className="flex items-center gap-2">{title}</Label>
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        {preview}
        <div className="flex-1 space-y-2">
          {actions}
          {helperText ? (
            <p className="text-xs text-slate-500">{helperText}</p>
          ) : null}
        </div>
      </div>
      {footerText ? (
        <p className="mt-3 text-xs text-slate-500">{footerText}</p>
      ) : null}
    </div>
  </div>
);

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
  const [previewSheetOpen, setPreviewSheetOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CustomizationTab>("essentials");

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

  useEffect(() => {
    if (!previewSheetOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [previewSheetOpen]);

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
    "rounded-2xl border border-slate-200/70 bg-white/90 p-4 shadow-sm sm:p-5 lg:p-6";
  const sectionHeaderClass = "flex items-start gap-3";
  const sectionTitleClass = "text-base font-semibold text-slate-900";
  const sectionHelpClass = "text-xs text-slate-500";
  const settingsGroupClass =
    "rounded-xl border border-slate-200/80 bg-slate-50/80 p-4";
  const accentGradient = `linear-gradient(135deg, ${formData.accentColor} 0%, ${formData.accentColor}aa 100%)`;
  const accentButtonStyle = {
    backgroundColor: formData.accentColor,
    borderColor: formData.accentColor,
  };
  const hasUnsavedChanges = useMemo(() => {
    return snapshotFromForm(formData) !== savedSnapshot;
  }, [formData, savedSnapshot]);

  const previewPanel = (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 sm:p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">Live preview</p>
          <p className="text-xs text-slate-500">Mirrors the public page</p>
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
              "relative h-24 touch-none select-none sm:h-28",
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
            {existingCustomization?.bannerImageUrl && (
              <div className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
                <GripVertical className="size-3" />
                Drag to reposition
              </div>
            )}
          </div>

          <div className="space-y-4 px-4 pt-4 pb-6">
            <div className="rounded-2xl border border-white/60 bg-white/95 p-4 shadow-md">
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
              <div className={cn(previewLayoutClassMap[formData.layoutStyle])}>
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
  );

  return (
    <div className="w-full rounded-2xl border border-slate-200/70 bg-white/95 p-5 shadow-sm sm:p-6 lg:p-8">
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
          <div
            className="flex flex-wrap gap-2"
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
                    "rounded-full border px-4 py-2 text-xs font-semibold transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                    isActive
                      ? "text-white focus-visible:ring-slate-900/30"
                      : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 focus-visible:ring-slate-400",
                  )}
                  style={isActive ? accentButtonStyle : undefined}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {activeTab === "essentials" && (
            <section
              id="panel-essentials"
              role="tabpanel"
              aria-labelledby="tab-essentials"
              className={sectionCardClass}
            >
              <div className="mb-4">
                <div className={sectionHeaderClass}>
                  <div
                    className="rounded-lg p-2"
                    style={{ backgroundColor: formData.accentColor }}
                  >
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
              <div className="space-y-8">
                <div className={settingsGroupClass}>
                  <div className="space-y-3">
                    <ColorSelector
                      id="accentColor"
                      label="Accent Color"
                      value={formData.accentColor}
                      onChange={(value) =>
                        handleInputChange("accentColor", value)
                      }
                      className="max-w-[220px]"
                    />
                    <p
                      className="text-sm font-semibold"
                      style={{ color: formData.accentColor }}
                    >
                      {formData.accentColor}
                    </p>
                    <p className="text-sm font-medium text-slate-700">
                      Use this for buttons and accents
                    </p>
                  </div>
                </div>

                <div className={settingsGroupClass}>
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
                      className="h-10 w-full rounded-md border border-slate-300 px-3 text-sm focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
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
          )}

          {activeTab === "layout" && (
            <section
              id="panel-layout"
              role="tabpanel"
              aria-labelledby="tab-layout"
              className={sectionCardClass}
            >
              <div className="mb-4">
                <div className={sectionHeaderClass}>
                  <div
                    className="rounded-lg p-2"
                    style={{ backgroundColor: formData.accentColor }}
                  >
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
              <div className="space-y-8">
                <div className={settingsGroupClass}>
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
                          className={cn(
                            "flex items-center gap-2",
                            formData.layoutStyle === option.value &&
                              "text-white",
                          )}
                          style={
                            formData.layoutStyle === option.value
                              ? accentButtonStyle
                              : undefined
                          }
                        >
                          <option.icon className="size-4" />
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className={settingsGroupClass}>
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
                          className={
                            formData.linkStyle === option.value
                              ? "text-white"
                              : ""
                          }
                          style={
                            formData.linkStyle === option.value
                              ? accentButtonStyle
                              : undefined
                          }
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className={settingsGroupClass}>
                  <div className="space-y-3">
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
                          className={cn(
                            "flex items-center gap-2",
                            formData.avatarShape === option.value &&
                              "text-white",
                          )}
                          style={
                            formData.avatarShape === option.value
                              ? accentButtonStyle
                              : undefined
                          }
                        >
                          <option.icon className="size-4" />
                          {option.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "media" && (
            <section
              id="panel-media"
              role="tabpanel"
              aria-labelledby="tab-media"
              className={sectionCardClass}
            >
              <div className="mb-4">
                <div className={sectionHeaderClass}>
                  <div
                    className="rounded-lg p-2"
                    style={{ backgroundColor: formData.accentColor }}
                  >
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
              <div className="space-y-8">
                <div className={settingsGroupClass}>
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
                          className={
                            formData.backgroundType === option.value
                              ? "text-white"
                              : ""
                          }
                          style={
                            formData.backgroundType === option.value
                              ? accentButtonStyle
                              : undefined
                          }
                        >
                          {option.label}
                        </Button>
                      ))}
                    </div>

                    <div className="space-y-4">
                      <ColorSelector
                        id="backgroundSolidColor"
                        label="Solid Color"
                        value={formData.backgroundSolidColor}
                        onChange={(value) =>
                          handleInputChange("backgroundSolidColor", value)
                        }
                      />
                      <div className="space-y-2">
                        <Label>Pattern Overlay</Label>
                        <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-white px-3 py-2">
                          <div>
                            <p className="text-sm font-medium text-slate-700">
                              Enable overlay
                            </p>
                            <p className="text-xs text-slate-500">
                              Add subtle texture to the background
                            </p>
                          </div>
                          <button
                            id="patternOverlayEnabled"
                            type="button"
                            role="switch"
                            aria-checked={formData.patternOverlayEnabled}
                            disabled={formData.backgroundType === "image"}
                            onClick={() =>
                              setFormData((prev) => ({
                                ...prev,
                                patternOverlayEnabled:
                                  !prev.patternOverlayEnabled,
                                patternOverlayValue:
                                  !prev.patternOverlayEnabled &&
                                  !prev.patternOverlayValue
                                    ? patternOptions[0]?.value
                                    : prev.patternOverlayValue,
                              }))
                            }
                            className={cn(
                              "relative inline-flex h-6 w-11 items-center rounded-full border transition",
                              formData.patternOverlayEnabled
                                ? "border-transparent"
                                : "border-slate-200 bg-slate-100",
                              formData.backgroundType === "image" &&
                                "opacity-60",
                            )}
                            style={
                              formData.patternOverlayEnabled
                                ? { backgroundColor: formData.accentColor }
                                : undefined
                            }
                          >
                            <span
                              className={cn(
                                "inline-block h-4 w-4 translate-x-1 rounded-full bg-white shadow transition",
                                formData.patternOverlayEnabled &&
                                  "translate-x-6",
                              )}
                            />
                          </button>
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
                      <div className="space-y-4">
                        <ColorSelector
                          id="gradientStart"
                          label="Gradient Start"
                          value={gradientColors.start}
                          onChange={(value) =>
                            handleGradientChange("start", value)
                          }
                        />
                        <ColorSelector
                          id="gradientEnd"
                          label="Gradient End"
                          value={gradientColors.end}
                          onChange={(value) =>
                            handleGradientChange("end", value)
                          }
                        />
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
                                "w-full rounded-xl border p-3 text-left",
                                formData.patternOverlayValue === option.value
                                  ? ""
                                  : "border-slate-200",
                              )}
                              style={
                                formData.patternOverlayValue === option.value
                                  ? { borderColor: formData.accentColor }
                                  : undefined
                              }
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
                      <UploadImageCard
                        title="Background Image"
                        preview={
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
                        }
                        actions={
                          <div className="flex flex-wrap items-center gap-4">
                            <input
                              type="file"
                              ref={backgroundInputRef}
                              accept="image/*"
                              onChange={(e) =>
                                handleImageUpload(e, "background")
                              }
                              className="hidden"
                              disabled={isUploading}
                            />
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                backgroundInputRef.current?.click()
                              }
                              disabled={isUploading}
                              className="flex items-center gap-2"
                            >
                              <Upload className="size-4" />
                              {isUploading
                                ? "Uploading..."
                                : "Upload Background"}
                            </Button>
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
                        }
                        helperText="Max 5MB"
                        footerText="Drag to reposition"
                      />
                    )}
                  </div>
                </div>

                <div className={settingsGroupClass}>
                  <div className="space-y-6">
                    <UploadImageCard
                      title="Banner Image"
                      preview={
                        <div
                          className={cn(
                            "relative h-24 w-full touch-none overflow-hidden rounded-lg bg-slate-100 select-none sm:h-20 sm:w-32",
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
                          {existingCustomization?.bannerImageUrl && (
                            <div className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
                              <GripVertical className="size-3" />
                              Drag
                            </div>
                          )}
                        </div>
                      }
                      actions={
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
                      }
                      helperText="Recommended: 1200x400 · Max 5MB"
                      footerText="Drag the preview to reposition"
                    />

                    <UploadImageCard
                      title="Profile Picture"
                      preview={
                        <div className="size-16 self-center overflow-hidden rounded-full bg-slate-100 sm:self-auto">
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
                      }
                      actions={
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
                      }
                      helperText="Max 5MB. JPG, PNG, WebP"
                    />
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "bio" && (
            <section
              id="panel-bio"
              role="tabpanel"
              aria-labelledby="tab-bio"
              className={sectionCardClass}
            >
              <div className="mb-4">
                <div className={sectionHeaderClass}>
                  <div
                    className="rounded-lg p-2"
                    style={{ backgroundColor: formData.accentColor }}
                  >
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
              <div className="space-y-8">
                <div className={settingsGroupClass}>
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
                </div>

                <div className={settingsGroupClass}>
                  <div className="space-y-4">
                    <Label className="flex items-center gap-2">
                      Social Links
                    </Label>
                    <div className="space-y-3">
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
                      <Button
                        type="button"
                        onClick={handleAddSocialLink}
                        className="w-full text-white"
                        style={accentButtonStyle}
                      >
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
                              <p className="text-xs text-slate-500">
                                {link.url}
                              </p>
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
              </div>
            </section>
          )}

          <div className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-lg backdrop-blur">
            <Button
              type="submit"
              disabled={isUploading || isLoading}
              className="w-full text-white transition-opacity hover:opacity-90"
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
        </div>
        <aside className="mt-8 hidden lg:sticky lg:top-6 lg:mt-0 lg:block lg:self-start">
          {previewPanel}
        </aside>
      </form>
      <button
        type="button"
        onClick={() => setPreviewSheetOpen(true)}
        className="fixed right-4 bottom-4 z-30 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 md:hidden"
        style={{ backgroundColor: formData.accentColor }}
      >
        Live preview
      </button>
      {previewSheetOpen && (
        <div className="fixed inset-0 z-40 flex items-end justify-center md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPreviewSheetOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full rounded-t-3xl bg-white p-4 shadow-2xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">
                Live preview
              </p>
              <button
                type="button"
                onClick={() => setPreviewSheetOpen(false)}
                className="rounded-full border border-slate-200 bg-white p-2 text-slate-500"
                aria-label="Close preview"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="max-h-[75vh] overflow-auto pb-4">
              {previewPanel}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomizationForm;
