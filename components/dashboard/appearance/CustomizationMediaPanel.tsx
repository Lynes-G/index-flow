"use client";

import type { CSSProperties, ReactNode, RefObject } from "react";
import Image from "next/image";
import { GripVertical, ImageIcon, Upload, X } from "lucide-react";
import type { BackgroundType } from "@/lib/frontend/appearance/themePresets";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/frontend/shared/utils";
import DashboardColorPicker from "@/components/dashboard/appearance/DashboardColorPicker";

type PatternOption = {
  label: string;
  category: "Subtle" | "Structured" | "Atmospheric";
  value: string;
  description: string;
  bestOn: string[];
  previewValue?: string;
  previewSize?: string;
  previewRepeat?: string;
  previewPosition?: string;
};

type BackgroundTypeOption = {
  value: BackgroundType;
  label: string;
};

type UploadImageCardProps = {
  title: string;
  preview: ReactNode;
  actions: ReactNode;
  helperText?: string;
  footerText?: string;
  layout?: "inline" | "stacked";
};

const backgroundTypeButtonClassName = "min-w-20";

const selectedBackgroundTypeClassName = "text-accent-foreground";

const uploadActionGroupClassName =
  "flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center";

const wideUploadActionGroupClassName =
  "flex flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center";

const uploadButtonClassName = "w-full whitespace-normal sm:w-auto";

const removeImageButtonClassName =
  "w-full whitespace-normal text-red-600 hover:bg-red-50 hover:text-red-700 sm:w-auto";

const getSelectedControlStyle = (
  isSelected: boolean,
  accentControlVars: CSSProperties,
  accentButtonStyle: CSSProperties,
) => (isSelected ? { ...accentControlVars, ...accentButtonStyle } : undefined);

const groupPatternOptions = (patternOptions: PatternOption[]) =>
  patternOptions.reduce<
    Array<{
      category: PatternOption["category"];
      options: PatternOption[];
    }>
  >((groups, option) => {
    const existingGroup = groups.find(
      (group) => group.category === option.category,
    );

    if (existingGroup) {
      existingGroup.options.push(option);
      return groups;
    }

    groups.push({ category: option.category, options: [option] });
    return groups;
  }, []);

const UploadImageCard = ({
  title,
  preview,
  actions,
  helperText,
  footerText,
  layout = "inline",
}: UploadImageCardProps) => (
  <div className="space-y-3.5 sm:space-y-4">
    <Label className="flex items-center gap-2">{title}</Label>
    <div className="rounded-lg border border-slate-200 bg-white p-3.5 sm:p-4">
      <div
        className={cn(
          "flex flex-col gap-4",
          layout === "inline" ? "sm:flex-row sm:items-center" : undefined,
        )}
      >
        {preview}
        <div className="min-w-0 flex-1 space-y-2">
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

type CustomizationMediaPanelProps = {
  backgroundType: BackgroundType;
  backgroundSolidColor: string;
  patternOverlayEnabled: boolean;
  patternOverlayValue?: string;
  patternOverlayOpacity: number;
  backgroundImagePositionX: number;
  backgroundImagePositionY: number;
  bannerImagePositionX: number;
  bannerImagePositionY: number;
  accentColor: string;
  gradientColors: { start: string; end: string };
  isUploading: boolean;
  settingsGroupClass: string;
  sectionCardClass: string;
  sectionHeaderClass: string;
  sectionTitleClass: string;
  sectionHelpClass: string;
  accentBadgeStyle: CSSProperties;
  accentButtonStyle: CSSProperties;
  accentControlVars: CSSProperties;
  backgroundTypeOptions: BackgroundTypeOption[];
  patternOptions: PatternOption[];
  existingCustomization?: {
    backgroundImageUrl?: string | null;
    bannerImageUrl?: string | null;
    profilePictureUrl?: string | null;
  } | null;
  fileInputRef: RefObject<HTMLInputElement | null>;
  bannerInputRef: RefObject<HTMLInputElement | null>;
  backgroundInputRef: RefObject<HTMLInputElement | null>;
  onBackgroundTypeChange: (type: BackgroundType) => void;
  onBackgroundSolidColorChange: (value: string) => void;
  onPatternOverlayToggle: () => void;
  onPatternOverlayValueChange: (value: string) => void;
  onPatternOverlayOpacityChange: (value: number) => void;
  onGradientChange: (key: "start" | "end", value: string) => void;
  onImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "profile" | "banner" | "background",
  ) => void;
  onRemoveImage: (type: "profile" | "banner" | "background") => void;
  onBackgroundPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  onBackgroundPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onBannerPointerDown: (event: React.PointerEvent<HTMLDivElement>) => void;
  onBannerPointerMove: (event: React.PointerEvent<HTMLDivElement>) => void;
  onPointerEnd: () => void;
};

const CustomizationMediaPanel = ({
  backgroundType,
  backgroundSolidColor,
  patternOverlayEnabled,
  patternOverlayValue,
  patternOverlayOpacity,
  backgroundImagePositionX,
  backgroundImagePositionY,
  bannerImagePositionX,
  bannerImagePositionY,
  accentColor,
  gradientColors,
  isUploading,
  settingsGroupClass,
  sectionCardClass,
  sectionHeaderClass,
  sectionTitleClass,
  sectionHelpClass,
  accentBadgeStyle,
  accentButtonStyle,
  accentControlVars,
  backgroundTypeOptions,
  patternOptions,
  existingCustomization,
  fileInputRef,
  bannerInputRef,
  backgroundInputRef,
  onBackgroundTypeChange,
  onBackgroundSolidColorChange,
  onPatternOverlayToggle,
  onPatternOverlayValueChange,
  onPatternOverlayOpacityChange,
  onGradientChange,
  onImageUpload,
  onRemoveImage,
  onBackgroundPointerDown,
  onBackgroundPointerMove,
  onBannerPointerDown,
  onBannerPointerMove,
  onPointerEnd,
}: CustomizationMediaPanelProps) => {
  const groupedPatternOptions = groupPatternOptions(patternOptions);

  return (
    <section
      id="panel-media"
      role="tabpanel"
      aria-labelledby="tab-media"
      className={sectionCardClass}
    >
      <div className={sectionHeaderClass}>
        <div className="rounded-lg p-2" style={accentBadgeStyle}>
          <ImageIcon className="size-4" />
        </div>
        <div>
          <p className="text-brand-purple text-[11px] font-semibold tracking-[0.24em] uppercase">
            Media
          </p>
          <p className={sectionTitleClass}>Background & imagery</p>
          <p className={sectionHelpClass}>
            Add background, banner, and profile images.
          </p>
        </div>
      </div>

      <div className="space-y-3.5 sm:space-y-4">
        <div className={settingsGroupClass}>
          <div className="space-y-3">
            <Label className="flex items-center gap-2">Background Style</Label>
            <div className="flex flex-wrap gap-2">
              {backgroundTypeOptions.map((option) => {
                const isSelected = backgroundType === option.value;

                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => onBackgroundTypeChange(option.value)}
                    style={getSelectedControlStyle(
                      isSelected,
                      accentControlVars,
                      accentButtonStyle,
                    )}
                    className={cn(
                      backgroundTypeButtonClassName,
                      isSelected && selectedBackgroundTypeClassName,
                    )}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>

            {backgroundType !== "image" ? (
              <div className="space-y-4 pt-2">
                <div className="dashboard-settings-panel-soft p-3.5 sm:p-4">
                  <div className="mb-4 space-y-1">
                    <p className="text-sm font-semibold text-slate-900">
                      Base color
                    </p>
                    <p className="text-xs text-slate-500">
                      This anchors the overall background mood before any
                      gradient blend or texture is added.
                    </p>
                  </div>
                  <DashboardColorPicker
                    label="Solid Color"
                    value={backgroundSolidColor}
                    onChange={onBackgroundSolidColorChange}
                    dialogTitle="Background solid color"
                    triggerTitle="Pick solid background color"
                  />
                </div>

                <div className="dashboard-settings-panel-soft p-3.5 sm:p-4">
                  <div className="space-y-2">
                    <Label>Pattern Overlay</Label>
                    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/70 px-3 py-3">
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
                        aria-checked={patternOverlayEnabled}
                        onClick={onPatternOverlayToggle}
                        className={cn(
                          "relative inline-flex h-6 w-11 items-center rounded-full border transition",
                          patternOverlayEnabled
                            ? "border-transparent"
                            : "border-slate-200 bg-slate-100",
                        )}
                        style={
                          patternOverlayEnabled
                            ? { backgroundColor: accentColor }
                            : undefined
                        }
                      >
                        <span
                          className={cn(
                            "inline-block h-4 w-4 translate-x-1 rounded-full bg-white shadow transition",
                            patternOverlayEnabled && "translate-x-6",
                          )}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {backgroundType === "gradient" ? (
              <div className="dashboard-settings-panel-soft p-3.5 sm:p-4">
                <div className="mb-4 space-y-1">
                  <p className="text-sm font-semibold text-slate-900">
                    Gradient blend
                  </p>
                  <p className="text-xs text-slate-500">
                    Pick the two colors that fade into each other across the
                    background.
                  </p>
                </div>
                <div className="space-y-4">
                  <DashboardColorPicker
                    label="Gradient Start"
                    value={gradientColors.start}
                    onChange={(value) => onGradientChange("start", value)}
                    dialogTitle="Gradient start color"
                    triggerTitle="Pick gradient start color"
                  />
                  <DashboardColorPicker
                    label="Gradient End"
                    value={gradientColors.end}
                    onChange={(value) => onGradientChange("end", value)}
                    dialogTitle="Gradient end color"
                    triggerTitle="Pick gradient end color"
                  />
                </div>
              </div>
            ) : null}

            {patternOverlayEnabled && backgroundType !== "image" ? (
              <div className="space-y-4">
                <div className="space-y-5">
                  {groupedPatternOptions.map((group) => (
                    <div key={group.category} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <p className="text-[11px] font-semibold tracking-[0.24em] text-slate-400 uppercase">
                          {group.category}
                        </p>
                        <div className="h-px flex-1 bg-slate-200" />
                      </div>
                      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        {group.options.map((option) => (
                          <button
                            key={option.label}
                            type="button"
                            onClick={() =>
                              onPatternOverlayValueChange(option.value)
                            }
                            className={cn(
                              "w-full rounded-lg border p-3 text-left transition",
                              patternOverlayValue === option.value
                                ? "shadow-sm"
                                : "border-slate-200 hover:border-slate-300",
                            )}
                            style={
                              patternOverlayValue === option.value
                                ? { borderColor: accentColor }
                                : undefined
                            }
                          >
                            <div
                              className="mb-3 h-20 rounded-lg border border-slate-200/70"
                              style={{
                                backgroundImage: option.previewValue,
                                backgroundColor: "#F8FAFC",
                                backgroundSize:
                                  option.previewSize || "24px 24px",
                                backgroundRepeat:
                                  option.previewRepeat || "repeat",
                                backgroundPosition:
                                  option.previewPosition || "left top",
                              }}
                            />
                            <p className="text-sm font-medium text-slate-800">
                              {option.label}
                            </p>
                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {option.description}
                            </p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {option.bestOn.map((tip) => (
                                <span
                                  key={tip}
                                  className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-medium text-slate-500"
                                >
                                  Best on: {tip}
                                </span>
                              ))}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="dashboard-settings-panel-soft p-3.5 sm:p-4">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Overlay strength
                      </p>
                      <p className="text-xs text-slate-500">
                        Think of this like turning the texture layer up or down.
                      </p>
                    </div>
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                      {Math.round(patternOverlayOpacity * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="6"
                    max="50"
                    step="1"
                    value={Math.round(patternOverlayOpacity * 100)}
                    onChange={(event) =>
                      onPatternOverlayOpacityChange(
                        Number(event.target.value) / 100,
                      )
                    }
                    className="w-full accent-[var(--overlay-accent)]"
                    style={
                      {
                        "--overlay-accent": accentColor,
                      } as CSSProperties
                    }
                  />
                  <div className="mt-2 flex items-center justify-between text-[11px] font-medium tracking-[0.08em] text-slate-400 uppercase">
                    <span>Soft</span>
                    <span>Balanced</span>
                    <span>Bold</span>
                  </div>
                </div>
              </div>
            ) : null}

            {backgroundType === "image" ? (
              <UploadImageCard
                title="Background Image"
                layout="stacked"
                preview={
                  <div
                    className={cn(
                      "h-36 w-full min-w-0 touch-none rounded-lg border border-slate-200 bg-slate-100 select-none",
                      existingCustomization?.backgroundImageUrl
                        ? "cursor-grab"
                        : "cursor-default",
                    )}
                    style={
                      existingCustomization?.backgroundImageUrl
                        ? {
                            backgroundImage: `url(${existingCustomization.backgroundImageUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: `${backgroundImagePositionX}% ${backgroundImagePositionY}%`,
                          }
                        : undefined
                    }
                    onPointerDown={onBackgroundPointerDown}
                    onPointerMove={onBackgroundPointerMove}
                    onPointerUp={onPointerEnd}
                    onPointerLeave={onPointerEnd}
                  >
                    {!existingCustomization?.backgroundImageUrl ? (
                      <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                        Upload a background image to position it
                      </div>
                    ) : null}
                  </div>
                }
                actions={
                  <div className={wideUploadActionGroupClassName}>
                    <input
                      type="file"
                      ref={backgroundInputRef}
                      accept="image/*"
                      onChange={(event) => onImageUpload(event, "background")}
                      className="hidden"
                      disabled={isUploading}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => backgroundInputRef.current?.click()}
                      disabled={isUploading}
                      className={uploadButtonClassName}
                    >
                      <Upload className="size-4" />
                      {isUploading ? "Uploading..." : "Upload Background"}
                    </Button>
                    {existingCustomization?.backgroundImageUrl ? (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onRemoveImage("background")}
                        disabled={isUploading}
                        className={removeImageButtonClassName}
                      >
                        <X className="mr-1 size-4" />
                        Remove
                      </Button>
                    ) : null}
                  </div>
                }
                helperText="Max 5MB"
                footerText="Drag to reposition"
              />
            ) : null}
          </div>
        </div>

        <div className={settingsGroupClass}>
          <div className="space-y-6">
            <UploadImageCard
              title="Banner Image"
              preview={
                <div
                  className={cn(
                    "relative h-24 w-full min-w-0 touch-none overflow-hidden rounded-lg bg-slate-100 select-none sm:h-20 sm:w-32",
                    existingCustomization?.bannerImageUrl
                      ? "cursor-grab"
                      : "cursor-default",
                  )}
                  style={
                    existingCustomization?.bannerImageUrl
                      ? {
                          backgroundImage: `url(${existingCustomization.bannerImageUrl})`,
                          backgroundSize: "cover",
                          backgroundPosition: `${bannerImagePositionX}% ${bannerImagePositionY}%`,
                        }
                      : undefined
                  }
                  onPointerDown={onBannerPointerDown}
                  onPointerMove={onBannerPointerMove}
                  onPointerUp={onPointerEnd}
                  onPointerLeave={onPointerEnd}
                >
                  {!existingCustomization?.bannerImageUrl ? (
                    <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">
                      No banner
                    </div>
                  ) : null}
                  {existingCustomization?.bannerImageUrl ? (
                    <div className="absolute right-2 bottom-2 inline-flex items-center gap-1 rounded-full bg-white/85 px-2 py-1 text-[10px] font-semibold text-slate-700 shadow-sm">
                      <GripVertical className="size-3" />
                      Drag
                    </div>
                  ) : null}
                </div>
              }
              actions={
                <div className={uploadActionGroupClassName}>
                  <input
                    type="file"
                    ref={bannerInputRef}
                    accept="image/*"
                    onChange={(event) => onImageUpload(event, "banner")}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => bannerInputRef.current?.click()}
                    disabled={isUploading}
                    className={uploadButtonClassName}
                  >
                    <Upload className="size-4" />
                    {isUploading ? "Uploading..." : "Upload Banner"}
                  </Button>
                  {existingCustomization?.bannerImageUrl ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveImage("banner")}
                      disabled={isUploading}
                      className={removeImageButtonClassName}
                    >
                      <X className="mr-1 size-4" />
                      Remove
                    </Button>
                  ) : null}
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
                <div className={uploadActionGroupClassName}>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    onChange={(event) => onImageUpload(event, "profile")}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className={uploadButtonClassName}
                  >
                    <Upload className="size-4" />
                    {isUploading ? "Uploading..." : "Upload Photo"}
                  </Button>
                  {existingCustomization?.profilePictureUrl ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => onRemoveImage("profile")}
                      disabled={isUploading}
                      className={removeImageButtonClassName}
                    >
                      <X className="mr-1 size-4" />
                      Remove
                    </Button>
                  ) : null}
                </div>
              }
              helperText="Max 5MB. JPG, PNG, WebP"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizationMediaPanel;
