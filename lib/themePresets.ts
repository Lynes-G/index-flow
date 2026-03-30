export type BackgroundType = "solid" | "gradient" | "pattern" | "image";
export type LayoutStyle = "stacked" | "cards" | "grid";
export type LinkStyle = "rounded" | "outline" | "shadow" | "pill";
export type AvatarShape = "circle" | "rounded" | "square";

export interface PresetBackground {
  type: Exclude<BackgroundType, "image">;
  value: string;
  baseColor?: string;
  size?: string;
}

export interface ThemePreset {
  key: string;
  label: string;
  accentColor: string;
  fontFamily: string;
  layoutStyle: LayoutStyle;
  linkStyle: LinkStyle;
  background: PresetBackground;
}

export const themePresets: Record<string, ThemePreset> = {
  "Sunset Glow": {
    key: "Sunset Glow",
    label: "Sunset Glow",
    accentColor: "#FF6B6B",
    fontFamily: '"Playfair Display", "Georgia", serif',
    layoutStyle: "stacked",
    linkStyle: "pill",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #FF8A5B 0%, #FCD5CE 100%)",
    },
  },
  "Mono Ink": {
    key: "Mono Ink",
    label: "Mono Ink",
    accentColor: "#111827",
    fontFamily: '"Space Grotesk", "Helvetica Neue", sans-serif',
    layoutStyle: "cards",
    linkStyle: "outline",
    background: {
      type: "pattern",
      baseColor: "#F7F7F2",
      value:
        "radial-gradient(circle at 1px 1px, rgba(17, 24, 39, 0.12) 1px, transparent 0)",
      size: "18px 18px",
    },
  },
  "Ocean Night": {
    key: "Ocean Night",
    label: "Ocean Night",
    accentColor: "#38BDF8",
    fontFamily: '"DM Sans", "Helvetica Neue", sans-serif',
    layoutStyle: "cards",
    linkStyle: "shadow",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #0B1026 0%, #0F2D5C 100%)",
    },
  },
  "Citrus Pop": {
    key: "Citrus Pop",
    label: "Citrus Pop",
    accentColor: "#EA580C",
    fontFamily: '"Sora", "Helvetica Neue", sans-serif',
    layoutStyle: "stacked",
    linkStyle: "rounded",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #FDE047 0%, #FDBA74 100%)",
    },
  },
  "Forest Calm": {
    key: "Forest Calm",
    label: "Forest Calm",
    accentColor: "#34D399",
    fontFamily: '"Source Serif 4", "Times New Roman", serif',
    layoutStyle: "cards",
    linkStyle: "shadow",
    background: {
      type: "pattern",
      baseColor: "#0F172A",
      value:
        "linear-gradient(0deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px)",
      size: "24px 24px",
    },
  },
  "Lavender Haze": {
    key: "Lavender Haze",
    label: "Lavender Haze",
    accentColor: "#7C3AED",
    fontFamily: '"Fraunces", "Georgia", serif',
    layoutStyle: "stacked",
    linkStyle: "pill",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #F5E9FF 0%, #E9D5FF 100%)",
    },
  },
  "Studio Warmth": {
    key: "Studio Warmth",
    label: "Studio Warmth",
    accentColor: "#B45309",
    fontFamily: '"Cormorant Garamond", "Georgia", serif',
    layoutStyle: "cards",
    linkStyle: "outline",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #FDF6E3 0%, #F4D3A3 100%)",
    },
  },
  "Cyber Mint": {
    key: "Cyber Mint",
    label: "Cyber Mint",
    accentColor: "#22D3EE",
    fontFamily: '"IBM Plex Mono", "SFMono-Regular", monospace',
    layoutStyle: "grid",
    linkStyle: "rounded",
    background: {
      type: "pattern",
      baseColor: "#0B132B",
      value:
        "linear-gradient(transparent 23px, rgba(34, 211, 238, 0.12) 24px, transparent 25px), linear-gradient(90deg, transparent 23px, rgba(34, 211, 238, 0.12) 24px, transparent 25px)",
      size: "24px 24px",
    },
  },
  "UV Storm": {
    key: "UV Storm",
    label: "UV Storm",
    accentColor: "#FD521F",
    fontFamily: '"Montserrat", "Helvetica Neue", sans-serif',
    layoutStyle: "cards",
    linkStyle: "pill",
    background: {
      type: "pattern",
      baseColor: "#4A1991",
      value:
        "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1px, transparent 0), linear-gradient(135deg, #4A1991 0%, #671991 100%)",
      size: "20px 20px",
    },
  },
};

export const defaultThemePresetKey = "Sunset Glow";

export const themePresetList = Object.values(themePresets);

export const resolveThemePreset = (key?: string) => {
  if (key && themePresets[key]) return themePresets[key];
  return themePresets[defaultThemePresetKey];
};

export const getBackgroundStyle = ({
  backgroundType,
  backgroundValue,
  backgroundImageUrl,
  backgroundSolidColor,
  patternOverlayEnabled,
  patternOverlayValue,
  backgroundImagePositionX,
  backgroundImagePositionY,
  preset,
}: {
  backgroundType?: BackgroundType;
  backgroundValue?: string;
  backgroundImageUrl?: string;
  backgroundSolidColor?: string;
  patternOverlayEnabled?: boolean;
  patternOverlayValue?: string;
  backgroundImagePositionX?: number;
  backgroundImagePositionY?: number;
  preset: ThemePreset;
}) => {
  if (backgroundType === "image" && backgroundImageUrl) {
    return {
      backgroundImage: `url(${backgroundImageUrl})`,
      backgroundSize: "cover",
      backgroundPosition: `${backgroundImagePositionX ?? 50}% ${backgroundImagePositionY ?? 50}%`,
    } as const;
  }

  const resolvedType = backgroundType || preset.background.type;
  const resolvedValue = backgroundValue || preset.background.value;
  const resolvedSolid =
    backgroundSolidColor ||
    preset.background.baseColor ||
    (resolvedType === "solid" ? resolvedValue : undefined);
  const legacyPattern = resolvedType === "pattern" ? resolvedValue : undefined;
  const resolvedPattern =
    patternOverlayEnabled === true
      ? patternOverlayValue || legacyPattern
      : patternOverlayEnabled === false
        ? undefined
        : legacyPattern;
  const resolvedGradient =
    resolvedType === "gradient" ? resolvedValue : undefined;

  const layers = [resolvedPattern, resolvedGradient].filter(
    Boolean,
  ) as string[];
  if (layers.length > 0 || resolvedSolid) {
    const patternSize = preset.background.size || "24px 24px";
    const hasGradient = Boolean(resolvedGradient);
    return {
      backgroundColor: resolvedSolid,
      backgroundImage: layers.length > 0 ? layers.join(", ") : undefined,
      backgroundRepeat: resolvedPattern
        ? hasGradient
          ? "repeat, no-repeat"
          : "repeat"
        : undefined,
      backgroundSize: resolvedPattern
        ? hasGradient
          ? `${patternSize}, cover`
          : patternSize
        : undefined,
    } as const;
  }

  const presetBackground = preset.background;
  return {
    backgroundImage: presetBackground.value,
    backgroundColor: presetBackground.baseColor,
    backgroundSize: presetBackground.size,
    backgroundRepeat:
      presetBackground.type === "pattern" ? "repeat" : undefined,
  } as const;
};
