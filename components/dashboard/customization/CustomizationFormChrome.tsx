"use client";

import type { CSSProperties } from "react";
import { Palette } from "lucide-react";
import { dashboardSurfaceClasses } from "@/components/dashboard/styles";
import { Button } from "@/components/ui/button";
import ProfileQrCard from "@/components/public-profile/ProfileQrCard";
import { cn } from "@/lib/frontend/shared/utils";
import type { CustomizationTab } from "@/components/dashboard/customization/shared";

type HeaderProps = {
  accentGradient: string;
  accentForeground: string;
  layoutStyleLabel: string;
  linkStyleLabel: string;
};

const customizationHeaderClassName =
  "mb-5 border-b-2 border-[color:color-mix(in_srgb,var(--brand-eggplant)_36%,transparent)] pb-4 sm:mb-8 sm:pb-6 lg:mb-10 lg:pb-8";

const previewStatusPillClassName =
  "mt-4 hidden items-center gap-2 rounded-lg border border-[color:color-mix(in_srgb,var(--brand-eggplant)_22%,white)] bg-white px-4 py-2 text-xs font-semibold text-slate-600 shadow-sm md:inline-flex";

const qrNoteCardClassName =
  "rounded-lg border border-[color:color-mix(in_srgb,var(--brand-eggplant)_22%,white)] bg-white/90 p-4";

const qrNotes = [
  "Print it on cards, posters, or packaging for quick profile visits.",
  "Share a tracked link so scans still count in your analytics flow.",
];

const CustomizationFormHeader = ({
  accentGradient,
  accentForeground,
  layoutStyleLabel,
  linkStyleLabel,
}: HeaderProps) => (
  <div className={customizationHeaderClassName}>
    <div className="flex items-start gap-3 sm:gap-4">
      <div
        className="shadow-brand-neon-md border-brand-eggplant rounded-lg border-2 p-2.5 sm:p-3"
        style={{ background: accentGradient, color: accentForeground }}
      >
        <Palette className="size-5" />
      </div>
      <div>
        <p className="text-brand-purple mb-2 text-xs font-black tracking-[0.18em] uppercase">
          Customization Studio
        </p>
        <h2 className="font-['Sora',sans-serif] text-[1.45rem] leading-[1.08] font-black tracking-normal text-slate-900 sm:text-3xl">
          Customize your page
        </h2>
        <p className="mt-2 max-w-2xl text-[13px] leading-5 text-slate-600 sm:text-base sm:leading-6">
          Update your page styles and content with a live preview beside the
          editor.
        </p>
      </div>
    </div>
    <div className={previewStatusPillClassName}>
      <span>Live preview</span>
      <span className="text-slate-300">•</span>
      <span>
        {layoutStyleLabel} · {linkStyleLabel}
      </span>
    </div>
  </div>
);

type TabsProps = {
  activeTab: CustomizationTab;
  tabs: Array<{ value: CustomizationTab; label: string }>;
  accentButtonStyle: CSSProperties;
  accentControlVars: CSSProperties;
  onTabChange: (tab: CustomizationTab) => void;
};

const CustomizationTabList = ({
  activeTab,
  tabs,
  accentButtonStyle,
  accentControlVars,
  onTabChange,
}: TabsProps) => (
  <div
    className={`${dashboardSurfaceClasses.flatToolbar} flex flex-wrap gap-2 sm:gap-3`}
    role="tablist"
    aria-label="Customization tabs"
  >
    {tabs.map((tab) => {
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
            "rounded-lg border-2 px-3 py-2 text-xs font-bold whitespace-normal transition focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none sm:px-5 sm:py-2.5 sm:text-sm",
            isActive
              ? "text-accent-foreground focus-visible:ring-slate-900/30"
              : "hover:border-brand-eggplant border-transparent bg-transparent text-slate-600 hover:bg-white focus-visible:ring-slate-400",
          )}
          style={
            isActive
              ? { ...accentControlVars, ...accentButtonStyle }
              : undefined
          }
          onClick={() => onTabChange(tab.value)}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);

type SaveBarProps = {
  isLoading: boolean;
  isUploading: boolean;
  hasUnsavedChanges: boolean;
  accentButtonStyle: CSSProperties;
};

const CustomizationSaveBar = ({
  isLoading,
  isUploading,
  hasUnsavedChanges,
  accentButtonStyle,
}: SaveBarProps) => (
  <div className={dashboardSurfaceClasses.flatPanel}>
    <p className="text-brand-purple mb-3 text-[11px] font-black tracking-[0.2em] uppercase">
      Primary action
    </p>
    <Button
      type="submit"
      disabled={isUploading || isLoading}
      variant="accent"
      size="action"
      className="w-full font-black whitespace-normal sm:text-base"
      style={accentButtonStyle}
    >
      {isLoading ? "Saving..." : "Save Customizations"}
    </Button>
    {hasUnsavedChanges && !isLoading ? (
      <p className="mt-2 text-xs font-medium text-amber-700">Unsaved changes</p>
    ) : null}
  </div>
);

type QrPanelProps = {
  accentColor: string;
  qrProfileUrl: string;
  shareSlug: string;
  showInlineDesktopPreview: boolean;
};

const CustomizationQrPanel = ({
  accentColor,
  qrProfileUrl,
  shareSlug,
  showInlineDesktopPreview,
}: QrPanelProps) => (
  <section
    className={cn(
      "hidden lg:block",
      showInlineDesktopPreview ? "xl:hidden" : undefined,
    )}
  >
    <div className={dashboardSurfaceClasses.flatWidePanel}>
      <div className="space-y-4">
        <div className="border-brand-eggplant inline-flex items-center rounded-lg border bg-white px-3 py-1 text-xs font-black text-slate-600">
          Share tools
        </div>
        <div className="max-w-2xl space-y-2">
          <h3 className="text-2xl font-black text-slate-900">
            Download your QR code
          </h3>
          <p className="text-sm leading-6 text-slate-600 sm:text-base">
            Export a clean QR code for print, packaging, or quick sharing
            without leaving the dashboard.
          </p>
        </div>
        <div className="grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
          {qrNotes.map((note) => (
            <div key={note} className={qrNoteCardClassName}>
              {note}
            </div>
          ))}
        </div>
      </div>

      <ProfileQrCard
        username={shareSlug}
        profileUrl={qrProfileUrl}
        accentColor={accentColor}
        title="Download your QR code"
        description="Export a tracked QR code with your username for print or sharing."
        className="shadow-brand-neon-lg border-brand-eggplant rounded-lg bg-white/95"
      />
    </div>
  </section>
);

export {
  CustomizationFormHeader,
  CustomizationQrPanel,
  CustomizationSaveBar,
  CustomizationTabList,
};
