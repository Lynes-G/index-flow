"use client";

import type { CSSProperties } from "react";
import { Sparkles, Type } from "lucide-react";
import type { AppearanceFontOption } from "@/lib/frontend/appearance/appearanceFonts";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DashboardColorPicker from "@/components/dashboard/appearance/DashboardColorPicker";

type CustomizationEssentialsPanelProps = {
  accentColor: string;
  fontFamily: string;
  fontGroups: Array<{
    category: string;
    fonts: AppearanceFontOption[];
  }>;
  sectionCardClass: string;
  sectionHeaderClass: string;
  sectionTitleClass: string;
  sectionHelpClass: string;
  accentBadgeStyle: CSSProperties;
  onAccentColorChange: (value: string) => void;
  onFontFamilyChange: (value: string) => void;
};

const CustomizationEssentialsPanel = ({
  accentColor,
  fontFamily,
  fontGroups,
  sectionCardClass,
  sectionHeaderClass,
  sectionTitleClass,
  sectionHelpClass,
  accentBadgeStyle,
  onAccentColorChange,
  onFontFamilyChange,
}: CustomizationEssentialsPanelProps) => {
  const selectedFont =
    fontGroups
      .flatMap((group) => group.fonts)
      .find((font) => font.family === fontFamily) ?? null;

  return (
    <section
      id="panel-essentials"
      role="tabpanel"
      aria-labelledby="tab-essentials"
      className={sectionCardClass}
    >
      <div className={sectionHeaderClass}>
        <div className="rounded-lg p-2" style={accentBadgeStyle}>
          <Sparkles className="size-4" />
        </div>
        <div>
          <p className="text-brand-purple text-[11px] font-semibold tracking-[0.24em] uppercase">
            Essentials
          </p>
          <p className={sectionTitleClass}>Brand basics</p>
          <p className={sectionHelpClass}>Set your brand color and font.</p>
        </div>
      </div>

      <div className="space-y-3.5 sm:space-y-4">
        <div className="dashboard-settings-panel space-y-4 p-3.5 sm:p-5">
          <DashboardColorPicker
            label="Accent Color"
            value={accentColor}
            onChange={onAccentColorChange}
            helperText="Choose the main brand color used for buttons, highlights, and emphasis across your page."
            dialogTitle="Accent color"
            triggerTitle="Pick accent color"
          />
          <p className="text-sm font-medium text-slate-700">
            Use this for buttons, highlights, and small moments of emphasis.
          </p>
        </div>

        <div className="dashboard-section-divider pt-4 sm:pt-5">
          <div className="dashboard-settings-panel space-y-3.5 p-3.5 sm:p-5">
            <Label className="flex items-center gap-2">
              <Type className="size-4" />
              Font Family
            </Label>
            <p className="text-sm text-slate-600">
              Pick the voice of your page. Sans-serif fonts feel clean, serif
              fonts feel editorial, display fonts feel expressive, and monospace
              feels technical.
            </p>
            <Select value={fontFamily} onValueChange={onFontFamilyChange}>
              <SelectTrigger className="h-12 rounded-[1rem] border-slate-200/80 bg-white/88 text-base text-slate-800 shadow-[0_1px_0_rgba(255,255,255,0.85)_inset] sm:text-sm">
                <SelectValue
                  placeholder="Choose a font"
                  style={{ fontFamily: selectedFont?.family || fontFamily }}
                />
              </SelectTrigger>
              <SelectContent className="border-slate-200/80 bg-white/96">
                {fontGroups.map((group) => (
                  <SelectGroup key={group.category}>
                    <SelectLabel className="mb-1 border-b border-slate-200 pb-2 text-slate-500">
                      {group.category}
                    </SelectLabel>
                    {group.fonts.map((font) => (
                      <SelectItem
                        key={font.key}
                        value={font.family}
                        className="min-h-11"
                        style={{ fontFamily: font.family }}
                      >
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectContent>
            </Select>
            {selectedFont ? (
              <div className="rounded-lg border border-slate-200/80 bg-slate-50/85 p-3">
                <p className="text-[11px] font-semibold tracking-[0.2em] text-slate-500 uppercase">
                  Selected style
                </p>
                <p
                  className="mt-2 text-lg text-slate-900"
                  style={{ fontFamily: selectedFont.family }}
                >
                  {selectedFont.label}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Category: {selectedFont.category}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CustomizationEssentialsPanel;
