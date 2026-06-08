"use client";

import type { CSSProperties, ComponentType } from "react";
import {
  Circle,
  LayoutGrid,
  Link as LinkIcon,
  Sparkles,
  SwatchBook,
} from "lucide-react";
import type { Id } from "@/convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PageTemplate } from "@/lib/frontend/appearance/pageTemplates";
import {
  resolveThemePreset,
  type AvatarShape,
  type LayoutStyle,
  type LinkStyle,
} from "@/lib/frontend/appearance/themePresets";
import { cn } from "@/lib/frontend/shared/utils";

type LinkStyleOption = {
  value: LinkStyle;
  label: string;
};

type LayoutStyleOption = {
  value: LayoutStyle;
  label: string;
};

type AvatarShapeOption = {
  value: AvatarShape;
  label: string;
  icon: ComponentType<{ className?: string }>;
};

type LinkSummary = {
  _id: Id<"links">;
  title: string;
};

const noFeaturedLinkValue = "__none__";

const layoutStyleOptions: LayoutStyleOption[] = [
  { value: "classic", label: "Classic" },
  { value: "spotlight", label: "Spotlight" },
  { value: "editorial", label: "Editorial" },
  { value: "grid", label: "Grid" },
];

const optionButtonClassName =
  "h-auto px-3 py-2 text-left leading-5 whitespace-normal";

const selectedOptionClassName = "text-accent-foreground";

const templateButtonClassName =
  "h-full rounded-lg border p-1.5 text-left transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_22px_48px_-30px_rgba(15,23,42,0.25)] sm:rounded-lg sm:p-2";

const selectedTemplateButtonClassName =
  "border-slate-900 bg-slate-50 shadow-[0_24px_52px_-34px_rgba(15,23,42,0.3)]";

const idleTemplateButtonClassName = "border-slate-200/80 bg-white";

const templateFrameClassName =
  "relative h-full overflow-hidden rounded-lg border border-white/55 bg-white/20 p-3 shadow-[0_22px_42px_-28px_rgba(15,23,42,0.35)] backdrop-blur";

const PreviewDots = ({
  className,
  count = 3,
}: {
  className?: string;
  count?: number;
}) => (
  <div
    className={cn("flex items-center gap-1.5", className)}
    aria-hidden="true"
  >
    {Array.from({ length: count }).map((_, index) => (
      <span key={index} className="size-2 rounded-full bg-current" />
    ))}
  </div>
);

const TemplateArt = ({ template }: { template: PageTemplate }) => {
  const preset = resolveThemePreset(template.themePreset);

  if (template.key === "creator-launch") {
    return (
      <div className="relative h-full overflow-hidden rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.44),rgba(255,255,255,0.1))]">
        <div
          className="absolute inset-x-0 top-0 h-[58%]"
          style={{
            background: `radial-gradient(circle at 82% 16%, ${preset.accentColor}58, transparent 32%), linear-gradient(180deg, rgba(255,255,255,0.5), rgba(255,255,255,0.12))`,
          }}
        />
        <div className="absolute top-4 left-4 h-11 w-11 rounded-full border border-white/80 bg-white/92 shadow-sm" />
        <div className="absolute top-[27%] right-4 left-4 rounded-lg border border-white/75 bg-white/92 p-3.5 shadow-[0_20px_35px_-24px_rgba(15,23,42,0.5)]">
          <PreviewDots className="text-slate-900/85" />
          <PreviewDots className="mt-2 text-slate-400/50" count={2} />
          <div
            className="mt-4 h-10 rounded-[1rem]"
            style={{
              background: `linear-gradient(135deg, ${preset.accentColor}e8, ${preset.accentColor}85)`,
            }}
          />
        </div>
        <div className="absolute inset-x-4 bottom-4 space-y-2">
          {[0, 1].map((index) => (
            <div
              key={index}
              className="rounded-full border border-white/70 bg-white/90 px-3 py-2.5 shadow-sm"
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: `${preset.accentColor}cc` }}
                />
                <PreviewDots className="text-slate-900/82" count={3} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (template.key === "portfolio-studio") {
    return (
      <div className="relative h-full overflow-hidden rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.38),rgba(255,255,255,0.08))]">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(15,23,42,0.04),transparent_38%,rgba(15,23,42,0.08)_100%)]" />
        <div className="absolute top-4 left-4 h-12 w-[38%] rounded-[0.9rem] border border-white/70 bg-white/92 shadow-sm" />
        <div className="absolute top-4 right-4 h-[42%] w-[32%] rounded-[1rem] border border-white/70 bg-[linear-gradient(180deg,rgba(15,23,42,0.9),rgba(51,65,85,0.7))] shadow-sm" />
        <div
          className="absolute top-[32%] left-[38%] h-16 w-[42%] rounded-[1rem] border border-white/75 shadow-sm"
          style={{
            background: `linear-gradient(135deg, rgba(255,255,255,0.96), ${preset.accentColor}18)`,
          }}
        />
        <div className="absolute right-4 bottom-4 left-4 space-y-2.5">
          {[0, 1].map((index) => (
            <div
              key={index}
              className="rounded-[0.95rem] border border-white/70 bg-white/90 px-3 py-2.5 shadow-sm"
              style={{ borderLeft: `3px solid ${preset.accentColor}` }}
            >
              <PreviewDots
                className="text-slate-800/82"
                count={index === 0 ? 4 : 3}
              />
              <PreviewDots className="mt-1.5 text-slate-400/40" count={2} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (template.key === "storefront-grid") {
    return (
      <div className="relative h-full overflow-hidden rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.08))]">
        <div
          className="absolute inset-x-0 top-0 h-[34%]"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${preset.accentColor}60, transparent 54%)`,
          }}
        />
        <div className="absolute top-4 right-4 left-4 rounded-[1rem] border border-white/75 bg-white/92 p-3 shadow-sm">
          <div className="flex items-center justify-between">
            <PreviewDots className="text-slate-800/82" />
            <div
              className="h-5 w-10 rounded-full"
              style={{ backgroundColor: `${preset.accentColor}cc` }}
            />
          </div>
        </div>
        <div className="absolute inset-x-4 top-[32%] bottom-4 grid grid-cols-2 gap-2">
          <div className="rounded-[1rem] border border-white/70 bg-white/92 shadow-sm" />
          <div
            className="rounded-[1rem] border border-white/70 shadow-sm"
            style={{
              background: `linear-gradient(145deg, ${preset.accentColor}30, rgba(255,255,255,0.92))`,
            }}
          />
          <div
            className="rounded-[1rem] border border-white/70 shadow-sm"
            style={{
              background: `linear-gradient(180deg, rgba(255,255,255,0.96), ${preset.accentColor}22)`,
            }}
          />
          <div className="rounded-[1rem] border border-white/70 bg-white/92 shadow-sm" />
        </div>
        <div className="absolute inset-x-6 top-[36%] bottom-6 grid grid-cols-2 gap-4">
          {[0, 1, 2, 3].map((index) => (
            <div key={index} className="space-y-1.5 self-end">
              <PreviewDots
                className="text-slate-800/82"
                count={index % 2 === 0 ? 3 : 2}
              />
              <PreviewDots className="text-slate-400/38" count={2} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (template.key === "brutalist") {
    return (
      <div className="relative h-full overflow-hidden rounded-[1rem] bg-[#f4efdf]">
        <div className="absolute inset-0 bg-[#f4efdf]" />
        <div className="absolute top-4 left-4 h-8 w-8 border-[2.5px] border-slate-950 bg-[#ff5a36]" />
        <PreviewDots
          className="absolute top-4 right-4 text-slate-950"
          count={3}
        />
        <div className="absolute top-[24%] right-8 left-4 border-[3px] border-slate-950 bg-[#fff9ea] p-3 shadow-[8px_8px_0_0_rgba(15,23,42,1)]">
          <PreviewDots className="text-slate-950" />
          <PreviewDots className="mt-2 text-slate-600/50" count={2} />
        </div>
        <div
          className="absolute top-[47%] right-4 left-6 h-10 border-[3px] border-slate-950 shadow-[6px_6px_0_0_rgba(15,23,42,1)]"
          style={{ backgroundColor: preset.accentColor }}
        />
        <div className="absolute inset-x-4 bottom-4 space-y-2">
          {[0, 1].map((index) => (
            <div
              key={index}
              className="border-[2.5px] border-slate-950 bg-[#fff9ea] px-3 py-2 shadow-[5px_5px_0_0_rgba(15,23,42,1)]"
            >
              <PreviewDots
                className="text-slate-950"
                count={index === 0 ? 3 : 2}
              />
              <PreviewDots className="mt-1.5 text-slate-400/45" count={2} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (template.key === "glass-effect") {
    return (
      <div className="relative h-full overflow-hidden rounded-[1rem] bg-[linear-gradient(145deg,rgba(255,255,255,0.45),rgba(255,255,255,0.08))]">
        <div
          className="absolute inset-0"
          style={{
            background: `radial-gradient(circle at 18% 18%, rgba(255,255,255,0.5), transparent 28%), radial-gradient(circle at 80% 20%, ${preset.accentColor}35, transparent 30%), linear-gradient(180deg, rgba(255,255,255,0.25), rgba(255,255,255,0.06))`,
          }}
        />
        <div className="absolute top-4 left-4 h-10 w-10 rounded-[1rem] border border-white/65 bg-white/48 shadow-sm backdrop-blur-md" />
        <PreviewDots
          className="absolute top-4 right-4 text-white/60"
          count={3}
        />
        <div className="absolute top-[24%] right-4 left-4 rounded-lg border border-white/55 bg-white/24 p-3.5 shadow-[0_18px_40px_-24px_rgba(109,168,255,0.5)] backdrop-blur-xl">
          <PreviewDots className="text-slate-900/75" />
          <PreviewDots className="mt-2 text-slate-500/38" count={2} />
          <div className="mt-4 h-9 rounded-[1rem] border border-white/45 bg-white/26 backdrop-blur-xl" />
        </div>
        <div className="absolute inset-x-4 bottom-4 space-y-2">
          {[0, 1].map((index) => (
            <div
              key={index}
              className="rounded-lg border border-white/50 bg-white/24 px-3 py-2.5 shadow-sm backdrop-blur-xl"
            >
              <PreviewDots
                className="text-slate-900/72"
                count={index === 0 ? 4 : 3}
              />
              <PreviewDots className="mt-1.5 text-slate-500/32" count={2} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden rounded-[1rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.34),rgba(255,255,255,0.08))]">
      <div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(circle at 50% 18%, ${preset.accentColor}22, transparent 40%), linear-gradient(180deg, rgba(255,255,255,0.24), rgba(255,255,255,0.08))`,
        }}
      />
      <div className="absolute inset-x-0 top-0 h-[36%] bg-[linear-gradient(180deg,rgba(255,255,255,0.38),rgba(255,255,255,0))]" />
      <div className="absolute top-4 left-4 h-9 w-9 rounded-[0.7rem] border border-white/75 bg-white/92 shadow-sm" />
      <PreviewDots className="absolute top-5 right-4 text-slate-900/78" />
      <div
        className="absolute top-[22%] right-4 left-4 rounded-lg border border-white/75 p-3.5 shadow-[0_24px_34px_-26px_rgba(15,23,42,0.55)]"
        style={{
          background: `linear-gradient(180deg, ${preset.accentColor}22, rgba(255,255,255,0.96))`,
        }}
      />
      <div
        className="absolute top-[37%] right-8 left-8 h-9 rounded-[0.95rem]"
        style={{
          background: `linear-gradient(135deg, ${preset.accentColor}dc, ${preset.accentColor}80)`,
        }}
      />
      <PreviewDots className="absolute top-[27%] left-8 text-slate-800/84" />
      <PreviewDots
        className="absolute top-[32%] left-8 text-slate-400/42"
        count={2}
      />
      <div className="absolute inset-x-4 bottom-4 space-y-2">
        {[0, 1].map((index) => (
          <div
            key={index}
            className={cn(
              "rounded-[1rem] border border-white/70 bg-white/90 px-3 py-2.5 shadow-sm",
              index === 0 && "ring-1 ring-slate-900/8",
            )}
          >
            <div className="flex items-center gap-2">
              <div
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: `${preset.accentColor}cc` }}
              />
              <PreviewDots className="text-slate-800/84" count={3} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TemplatePreviewCard = ({
  isSelected,
  template,
}: {
  isSelected: boolean;
  template: PageTemplate;
}) => {
  const preset = resolveThemePreset(template.themePreset);

  return (
    <div
      className="relative aspect-square overflow-hidden rounded-lg border border-slate-200/80 p-2.5 sm:rounded-lg"
      style={{
        background:
          preset.background.baseColor ||
          preset.background.value ||
          "linear-gradient(135deg, #ffffff, #f8fafc)",
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.28),rgba(255,255,255,0.08))]" />
      <div className="relative h-full">
        <div className={templateFrameClassName}>
          <TemplateArt template={template} />
        </div>
        <div className="absolute inset-x-3 bottom-3">
          <div className="inline-flex max-w-full rounded-full border border-white/70 bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-slate-900 shadow-sm sm:text-xs">
            <span className="truncate">{template.label}</span>
          </div>
        </div>
        {isSelected ? (
          <div className="absolute top-3 right-3 size-3 rounded-full bg-slate-900 shadow-[0_0_0_4px_rgba(255,255,255,0.88)]" />
        ) : null}
      </div>
    </div>
  );
};

type CustomizationLayoutPanelProps = {
  layoutStyle: LayoutStyle;
  linkStyle: LinkStyle;
  avatarShape: AvatarShape;
  featuredLinkId: Id<"links"> | null;
  pageTemplates: PageTemplate[];
  selectedTemplateKey: string | null;
  linkStyleOptions: LinkStyleOption[];
  avatarShapeOptions: AvatarShapeOption[];
  userLinks?: LinkSummary[] | null;
  featuredLinkPreviewTitle?: string | null;
  sectionCardClass: string;
  sectionHeaderClass: string;
  sectionTitleClass: string;
  sectionHelpClass: string;
  accentBadgeStyle: CSSProperties;
  accentButtonStyle: CSSProperties;
  accentControlVars: CSSProperties;
  onLayoutStyleChange: (value: LayoutStyle) => void;
  onLinkStyleChange: (value: LinkStyle) => void;
  onFeaturedLinkChange: (value: Id<"links"> | null) => void;
  onAvatarShapeChange: (value: AvatarShape) => void;
  onApplyTemplate: (key: string) => void;
};

const getSelectedAccentStyle = (
  isSelected: boolean,
  accentControlVars: CSSProperties,
  accentButtonStyle: CSSProperties,
) => (isSelected ? { ...accentControlVars, ...accentButtonStyle } : undefined);

const CustomizationLayoutPanel = ({
  layoutStyle,
  linkStyle,
  avatarShape,
  featuredLinkId,
  pageTemplates,
  selectedTemplateKey,
  linkStyleOptions,
  avatarShapeOptions,
  userLinks,
  featuredLinkPreviewTitle,
  sectionCardClass,
  sectionHeaderClass,
  sectionTitleClass,
  sectionHelpClass,
  accentBadgeStyle,
  accentButtonStyle,
  accentControlVars,
  onLayoutStyleChange,
  onLinkStyleChange,
  onFeaturedLinkChange,
  onAvatarShapeChange,
  onApplyTemplate,
}: CustomizationLayoutPanelProps) => {
  return (
    <section
      id="panel-layout"
      role="tabpanel"
      aria-labelledby="tab-layout"
      className={sectionCardClass}
    >
      <div className={sectionHeaderClass}>
        <div className="rounded-lg p-2" style={accentBadgeStyle}>
          <LayoutGrid className="size-4" />
        </div>
        <div>
          <p className="text-[11px] font-semibold tracking-[0.24em] text-(--brand-purple) uppercase">
            Layout
          </p>
          <p className={sectionTitleClass}>Layout & Links</p>
          <p className={sectionHelpClass}>
            Refine the button treatment and profile details for one clear public
            page layout.
          </p>
        </div>
      </div>

      <div className="space-y-3.5 sm:space-y-4">
        <div className="dashboard-settings-panel p-3.5 sm:p-5">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <SwatchBook className="size-4" />
                Starter Templates
              </Label>
              <p className="text-sm text-slate-500">
                Pick a visual direction first.
              </p>
            </div>
            <div className="grid grid-cols-1 items-stretch gap-2.5 min-[520px]:grid-cols-2 sm:gap-3">
              {pageTemplates.map((template) => {
                const isSelected = selectedTemplateKey === template.key;

                return (
                  <button
                    key={template.key}
                    type="button"
                    onClick={() => onApplyTemplate(template.key)}
                    aria-label={template.label}
                    title={template.label}
                    className={cn(
                      templateButtonClassName,
                      isSelected
                        ? selectedTemplateButtonClassName
                        : idleTemplateButtonClassName,
                    )}
                  >
                    <TemplatePreviewCard
                      isSelected={isSelected}
                      template={template}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="dashboard-settings-panel p-3.5 sm:p-5">
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="flex items-center gap-2">
                <LayoutGrid className="size-4" />
                Page Layout
              </Label>
              <p className="text-sm text-slate-500">
                Choose the structure your links live inside.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {layoutStyleOptions.map((option) => {
                const isSelected = layoutStyle === option.value;

                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => onLayoutStyleChange(option.value)}
                    className={cn(
                      optionButtonClassName,
                      isSelected && selectedOptionClassName,
                    )}
                    style={getSelectedAccentStyle(
                      isSelected,
                      accentControlVars,
                      accentButtonStyle,
                    )}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="dashboard-settings-panel p-3.5 sm:p-5">
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <LinkIcon className="size-4" />
              Button Style
            </Label>
            <div className="flex flex-wrap gap-2">
              {linkStyleOptions.map((option) => {
                const isSelected = linkStyle === option.value;

                return (
                  <Button
                    key={option.value}
                    type="button"
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => onLinkStyleChange(option.value)}
                    className={cn(
                      optionButtonClassName,
                      isSelected && selectedOptionClassName,
                    )}
                    style={getSelectedAccentStyle(
                      isSelected,
                      accentControlVars,
                      accentButtonStyle,
                    )}
                  >
                    {option.label}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="dashboard-section-divider pt-4 sm:pt-5">
          <div className="dashboard-settings-panel p-3.5 sm:p-5">
            <div className="space-y-3">
              <div className="space-y-1">
                <Label
                  htmlFor="featured-link"
                  className="flex items-center gap-2"
                >
                  <Sparkles className="size-4" />
                  Featured Link
                </Label>
                <p className="text-sm text-slate-500">
                  Pick one link to highlight at the top of your public page.
                </p>
              </div>
              <Select
                value={featuredLinkId || noFeaturedLinkValue}
                onValueChange={(value) =>
                  onFeaturedLinkChange(
                    value === noFeaturedLinkValue
                      ? null
                      : (value as Id<"links">),
                  )
                }
                disabled={!userLinks}
              >
                <SelectTrigger id="featured-link">
                  <SelectValue placeholder="No featured link" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={noFeaturedLinkValue}>
                    No featured link
                  </SelectItem>
                  {(userLinks || []).map((link) => (
                    <SelectItem key={link._id} value={link._id}>
                      {link.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-slate-500">
                {!userLinks
                  ? "Loading your links..."
                  : userLinks.length === 0
                    ? "Add a link first, then you can feature it here."
                    : featuredLinkPreviewTitle
                      ? `Previewing: ${featuredLinkPreviewTitle}`
                      : "Choose a link or keep the regular list only."}
              </p>
            </div>
          </div>
        </div>

        <div className="dashboard-section-divider pt-4 sm:pt-5">
          <div className="dashboard-settings-panel p-3.5 sm:p-5">
            <div className="space-y-3">
              <Label className="flex items-center gap-2">
                <Circle className="size-4" />
                Avatar Shape
              </Label>
              <div className="flex flex-wrap gap-2">
                {avatarShapeOptions.map((option) => {
                  const isSelected = avatarShape === option.value;

                  return (
                    <Button
                      key={option.value}
                      type="button"
                      variant={isSelected ? "default" : "outline"}
                      onClick={() => onAvatarShapeChange(option.value)}
                      className={cn(
                        optionButtonClassName,
                        isSelected && selectedOptionClassName,
                      )}
                      style={getSelectedAccentStyle(
                        isSelected,
                        accentControlVars,
                        accentButtonStyle,
                      )}
                    >
                      <option.icon className="size-4" />
                      {option.label}
                    </Button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizationLayoutPanel;
