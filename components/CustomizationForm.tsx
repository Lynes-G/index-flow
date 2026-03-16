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
} from "lucide-react";
import { useEffect, useMemo, useRef, useState, useTransition } from "react";
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

const layoutOptions: Array<{ value: LayoutStyle; label: string; icon: any }> = [
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
  icon: any;
}> = [
  { value: "circle", label: "Circle", icon: Circle },
  { value: "rounded", label: "Rounded", icon: Square },
  { value: "square", label: "Square", icon: Square },
];

const backgroundTypeOptions: Array<{ value: BackgroundType; label: string }> = [
  { value: "gradient", label: "Gradient" },
  { value: "pattern", label: "Pattern" },
  { value: "image", label: "Image" },
];

const previewLayoutClassMap: Record<LayoutStyle, string> = {
  stacked: "space-y-3",
  cards: "space-y-3",
  grid: "grid grid-cols-1 gap-3 sm:grid-cols-2",
};

const previewLinkStyleMap: Record<LinkStyle, string> = {
  pill: "rounded-full border",
  rounded: "rounded-2xl border",
  outline: "rounded-2xl border-2",
  shadow: "rounded-2xl border shadow-md",
};

const patternOptions = [
  {
    label: "Soft Dots",
    value:
      "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.12) 1px, transparent 0), linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
  },
  {
    label: "Grid",
    value:
      "linear-gradient(0deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.2) 1px, transparent 1px)",
  },
  {
    label: "Diagonal",
    value:
      "linear-gradient(135deg, rgba(59, 130, 246, 0.18) 25%, transparent 25%), linear-gradient(225deg, rgba(59, 130, 246, 0.18) 25%, transparent 25%), linear-gradient(45deg, rgba(59, 130, 246, 0.18) 25%, transparent 25%), linear-gradient(315deg, rgba(59, 130, 246, 0.18) 25%, #F8FAFC 25%)",
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

  const [formData, setFormData] = useState({
    description: "",
    accentColor: defaultPreset.accentColor,
    themePreset: defaultPreset.key,
    fontFamily: defaultPreset.fontFamily,
    layoutStyle: defaultPreset.layoutStyle,
    linkStyle: defaultPreset.linkStyle,
    backgroundType: defaultPreset.background.type as BackgroundType,
    backgroundValue: defaultPreset.background.value,
    avatarShape: "circle" as AvatarShape,
    socialLinks: [] as Array<{ platform: string; url: string }>,
  });

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
      setGradientColors({
        start: extractedColors.start,
        end: extractedColors.end,
      });
      setFormData({
        description: existingCustomization.description || "",
        accentColor: existingCustomization.accentColor || preset.accentColor,
        themePreset: existingCustomization.themePreset || preset.key,
        fontFamily: existingCustomization.fontFamily || preset.fontFamily,
        layoutStyle: (existingCustomization.layoutStyle ||
          preset.layoutStyle) as LayoutStyle,
        linkStyle: (existingCustomization.linkStyle ||
          preset.linkStyle) as LinkStyle,
        backgroundType: (existingCustomization.backgroundType ||
          preset.background.type) as BackgroundType,
        backgroundValue: fallbackBackgroundValue,
        avatarShape: (existingCustomization.avatarShape ||
          "circle") as AvatarShape,
        socialLinks: existingCustomization.socialLinks || [],
      });
    }
  }, [existingCustomization]);

  const handlePresetSelect = (presetKey: string) => {
    const preset = resolveThemePreset(presetKey);
    const extractedColors = extractGradientColors(preset.background.value);
    setGradientColors({
      start: extractedColors.start,
      end: extractedColors.end,
    });
    setFormData((prev) => ({
      ...prev,
      themePreset: preset.key,
      accentColor: preset.accentColor,
      fontFamily: preset.fontFamily,
      layoutStyle: preset.layoutStyle,
      linkStyle: preset.linkStyle,
      backgroundType: preset.background.type,
      backgroundValue: preset.background.value,
    }));
  };

  const applyPresetBackground = () => {
    const preset = resolveThemePreset(formData.themePreset);
    const extractedColors = extractGradientColors(preset.background.value);
    setGradientColors({
      start: extractedColors.start,
      end: extractedColors.end,
    });
    setFormData((prev) => ({
      ...prev,
      backgroundType: preset.background.type,
      backgroundValue: preset.background.value,
    }));
  };

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
            formData.backgroundType === "image"
              ? undefined
              : formData.backgroundValue || undefined,
          avatarShape: formData.avatarShape || undefined,
          socialLinks: formData.socialLinks,
        });
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

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
    preset: previewPreset,
  });
  const previewName =
    user?.username || user?.firstName || user?.lastName || "Your Name";
  const previewLinks = [
    { title: "Portfolio", url: "https://example.com" },
    { title: "Latest Work", url: "https://example.com" },
    { title: "Newsletter", url: "https://example.com" },
  ];

  return (
    <div className="w-full rounded-2xl border border-white/20 bg-white/80 p-8 shadow-xl shadow-gray-200/50 backdrop-blur-sm">
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-3">
          <div className="rounded-lg bg-linear-to-br from-purple-500 to-pink-500 p-2">
            <Palette className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Customize your page
            </h2>
            <p className="text-sm text-gray-600">
              Build a Linktree-style profile with themes, layouts, and social
              links.
            </p>
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="lg:grid lg:grid-cols-[1.1fr_0.9fr] lg:gap-8"
      >
        <div className="space-y-8">
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <Sparkles className="size-4" />
              Theme Presets
            </Label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {themePresetList.map((preset) => (
                <button
                  type="button"
                  key={preset.key}
                  onClick={() => handlePresetSelect(preset.key)}
                  className={cn(
                    "rounded-2xl border p-4 text-left transition-all",
                    formData.themePreset === preset.key
                      ? "border-gray-900 shadow-md"
                      : "border-gray-200 hover:border-gray-300",
                  )}
                >
                  <div
                    className="mb-3 h-12 rounded-xl"
                    style={{
                      backgroundImage: preset.background.value,
                      backgroundColor: preset.background.baseColor,
                      backgroundSize: preset.background.size,
                    }}
                  />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {preset.label}
                      </p>
                      <p className="text-xs text-gray-500">
                        {preset.linkStyle} · {preset.layoutStyle}
                      </p>
                    </div>
                    <span
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: preset.accentColor }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={formData.accentColor}
                  onChange={(e) =>
                    handleInputChange("accentColor", e.target.value)
                  }
                  className="size-12 cursor-pointer rounded-lg border-2 border-gray-300"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    Choose your brand color
                  </p>
                  <p className="text-xs text-gray-500">
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
                className="h-10 w-full rounded-md border border-gray-300 px-3 text-sm"
              >
                {uniqueFonts.map((font) => (
                  <option key={font} value={font}>
                    {font.split(",")[0].replace(/\"/g, "")}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500">
                Current preset: {previewPreset.label}
              </p>
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

          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <ImageIcon className="size-4" />
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
                    }))
                  }
                >
                  {option.label}
                </Button>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={applyPresetBackground}
              >
                Use preset background
              </Button>
            </div>

            {formData.backgroundType === "gradient" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Gradient Start</Label>
                  <Input
                    type="color"
                    value={gradientColors.start}
                    onChange={(e) =>
                      handleGradientChange("start", e.target.value)
                    }
                    className="h-12 w-full cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Gradient End</Label>
                  <Input
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

            {formData.backgroundType === "pattern" && (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {patternOptions.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        backgroundType: "pattern",
                        backgroundValue: option.value,
                      }))
                    }
                    className={cn(
                      "rounded-xl border p-3 text-left",
                      formData.backgroundValue === option.value
                        ? "border-gray-900"
                        : "border-gray-200",
                    )}
                  >
                    <div
                      className="mb-2 h-12 rounded-lg"
                      style={{ backgroundImage: option.value }}
                    />
                    <p className="text-sm font-medium text-gray-700">
                      {option.label}
                    </p>
                  </button>
                ))}
              </div>
            )}

            {formData.backgroundType === "image" && (
              <div className="space-y-4">
                {existingCustomization?.backgroundImageUrl && (
                  <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                    <Image
                      src={existingCustomization.backgroundImageUrl}
                      alt="Background preview"
                      width={600}
                      height={200}
                      className="h-32 w-full rounded-lg object-cover"
                    />
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        Current background image
                      </p>
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
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-4">
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
                  <p className="text-sm text-gray-500">Max 5MB</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <ImageIcon className="size-4" />
              Banner Image
            </Label>
            {existingCustomization?.bannerImageUrl && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <Image
                  src={existingCustomization.bannerImageUrl}
                  alt="Banner preview"
                  width={800}
                  height={200}
                  className="h-32 w-full rounded-lg object-cover"
                />
                <div className="mt-3 flex items-center justify-between">
                  <p className="text-sm text-gray-600">Current banner image</p>
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
                </div>
              </div>
            )}
            <div className="flex items-center gap-4">
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
              <p className="text-sm text-gray-500">Recommended: 1200x400</p>
            </div>
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <ImageIcon className="size-4" />
              Profile Picture
            </Label>

            {existingCustomization?.profilePictureUrl && (
              <div className="flex items-center gap-4 rounded-lg bg-gray-50 p-4">
                <div className="size-16 overflow-hidden rounded-lg">
                  <Image
                    src={existingCustomization.profilePictureUrl}
                    alt="Current Profile Picture"
                    width={64}
                    height={64}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-700">
                    Current Profile Picture
                  </p>
                  <p className="text-xs text-gray-500">
                    Click “Remove” to delete this image.
                  </p>
                </div>
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
              </div>
            )}

            <div className="flex items-center gap-4">
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
                {isUploading ? "Uploading..." : "Upload New Image"}
              </Button>
              <p className="text-sm text-gray-500">
                Max 5MB. Supports JPG, PNG, WebP
              </p>
            </div>
          </div>

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
                  className="flex items-center gap-2"
                >
                  <option.icon className="size-4" />
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Tell visitors about yourself..."
              rows={3}
              maxLength={200}
              className="resize-vertical max-h-[200px] min-h-[100px] w-full rounded-md border border-gray-300 px-3 py-2 focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-purple-500 focus-visible:outline-none"
            />
            <p className="text-sm text-gray-500">
              {formData.description.length}/200 characters
            </p>
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <LinkIcon className="size-4" />
              Social Links
            </Label>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <select
                value={socialDraft.platform}
                onChange={(e) =>
                  setSocialDraft((prev) => ({
                    ...prev,
                    platform: e.target.value,
                  }))
                }
                className="h-10 rounded-md border border-gray-300 px-3 text-sm"
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
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 px-4 py-2"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {link.platform}
                      </p>
                      <p className="text-xs text-gray-500">{link.url}</p>
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

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isUploading || isLoading}
              className="w-full bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {isLoading ? "Saving..." : "Save Customizations"}
            </Button>
          </div>
        </div>
        <aside className="mt-8 lg:sticky lg:top-6 lg:mt-0">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  Live preview
                </p>
                <p className="text-xs text-slate-500">
                  Updates instantly with your selections
                </p>
              </div>
              <div className="rounded-full bg-white px-3 py-1 text-xs text-slate-500 shadow-sm">
                {formData.layoutStyle} · {formData.linkStyle}
              </div>
            </div>
            <div
              className="overflow-hidden rounded-2xl border border-white/40 shadow-lg"
              style={{
                ...previewBackgroundStyle,
                fontFamily: formData.fontFamily,
              }}
            >
              <div
                className="h-20"
                style={
                  existingCustomization?.bannerImageUrl
                    ? {
                        backgroundImage: `url(${existingCustomization.bannerImageUrl})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : {
                        background: `linear-gradient(135deg, ${formData.accentColor} 0%, ${formData.accentColor}aa 100%)`,
                      }
                }
              />
              <div className="bg-white/85 px-4 pt-4 pb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "size-12 overflow-hidden bg-white p-1 shadow",
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
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-slate-100 text-xs text-slate-500">
                        IMG
                      </div>
                    )}
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

                <div
                  className={cn(
                    "mt-4",
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
        </aside>
      </form>
    </div>
  );
};

export default CustomizationForm;
