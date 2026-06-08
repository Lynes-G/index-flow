import { appearanceFontFamilies } from "@/lib/frontend/appearance/appearanceFonts";

export type BackgroundType = "solid" | "gradient" | "pattern" | "image";
export type LayoutStyle = "classic" | "spotlight" | "editorial" | "grid";
export type LinkStyle =
  | "rounded"
  | "outline"
  | "shadow"
  | "pill"
  | "brutalist"
  | "glass";
export type AvatarShape = "circle" | "rounded" | "square";

const layoutStyles = [
  "classic",
  "spotlight",
  "editorial",
  "grid",
] as const satisfies LayoutStyle[];

export const layoutStyleLabels: Record<LayoutStyle, string> = {
  classic: "Classic",
  spotlight: "Spotlight",
  editorial: "Editorial",
  grid: "Grid",
};

export type BackgroundOverlayDefinition = {
  id: string;
  label: string;
  category: "Subtle" | "Structured" | "Atmospheric";
  description: string;
  bestOn: string[];
  preview: string;
  size?: string;
  repeat?: string;
  position?: string;
  build: (opacity: number) => string;
};

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

const themePresets: Record<string, ThemePreset> = {
  "Sunset Glow": {
    key: "Sunset Glow",
    label: "Sunset Glow",
    accentColor: "#FF6B6B",
    fontFamily: appearanceFontFamilies.playfairDisplay,
    layoutStyle: "classic",
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
    fontFamily: appearanceFontFamilies.spaceGrotesk,
    layoutStyle: "classic",
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
    fontFamily: appearanceFontFamilies.manrope,
    layoutStyle: "classic",
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
    fontFamily: appearanceFontFamilies.fredoka,
    layoutStyle: "classic",
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
    fontFamily: appearanceFontFamilies.sourceSerif4,
    layoutStyle: "classic",
    linkStyle: "shadow",
    background: {
      type: "pattern",
      baseColor: "#0F172A",
      value:
        "radial-gradient(circle at 8px 8px, rgba(255, 255, 255, 0.12) 0 1.6px, transparent 2px), radial-gradient(circle at 28px 26px, rgba(52, 211, 153, 0.14) 0 1.25px, transparent 1.7px)",
      size: "36px 36px",
    },
  },
  "Lavender Haze": {
    key: "Lavender Haze",
    label: "Lavender Haze",
    accentColor: "#7C3AED",
    fontFamily: appearanceFontFamilies.bricolageGrotesque,
    layoutStyle: "classic",
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
    fontFamily: appearanceFontFamilies.cormorantGaramond,
    layoutStyle: "classic",
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
    fontFamily: appearanceFontFamilies.ibmPlexMono,
    layoutStyle: "classic",
    linkStyle: "rounded",
    background: {
      type: "pattern",
      baseColor: "#0B132B",
      value:
        "radial-gradient(circle at 7px 7px, rgba(34, 211, 238, 0.22) 0 1.7px, transparent 2.1px), radial-gradient(circle at 24px 24px, rgba(208, 212, 23, 0.18) 0 1.2px, transparent 1.7px)",
      size: "32px 32px",
    },
  },
  "UV Storm": {
    key: "UV Storm",
    label: "UV Storm",
    accentColor: "#FD521F",
    fontFamily: appearanceFontFamilies.unbounded,
    layoutStyle: "classic",
    linkStyle: "pill",
    background: {
      type: "pattern",
      baseColor: "#4A1991",
      value:
        "radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.08) 1px, transparent 0), linear-gradient(135deg, #4A1991 0%, #671991 100%)",
      size: "20px 20px",
    },
  },
  Brutalist: {
    key: "Brutalist",
    label: "Brutalist",
    accentColor: "#111111",
    fontFamily: appearanceFontFamilies.unbounded,
    layoutStyle: "editorial",
    linkStyle: "brutalist",
    background: {
      type: "pattern",
      baseColor: "#F2EEE4",
      value:
        "radial-gradient(circle at 9px 9px, rgba(17, 17, 17, 0.18) 0 2px, transparent 2.45px), radial-gradient(circle at 29px 27px, rgba(17, 17, 17, 0.08) 0 1.25px, transparent 1.7px)",
      size: "38px 38px",
    },
  },
  "Glass Effect": {
    key: "Glass Effect",
    label: "Glass Effect",
    accentColor: "#6DA8FF",
    fontFamily: appearanceFontFamilies.manrope,
    layoutStyle: "spotlight",
    linkStyle: "glass",
    background: {
      type: "gradient",
      value: "linear-gradient(135deg, #EAF3FF 0%, #C9DFFF 38%, #DCCFFF 100%)",
    },
  },
};

export const defaultThemePresetKey = "Sunset Glow";
const defaultLayoutStyle: LayoutStyle = "classic";

const isLayoutStyle = (value: unknown): value is LayoutStyle =>
  typeof value === "string" && layoutStyles.includes(value as LayoutStyle);

export const resolveLayoutStyle = (value?: unknown): LayoutStyle =>
  isLayoutStyle(value) ? value : defaultLayoutStyle;

const clampOverlayOpacity = (value?: number) => {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return 0.18;
  }

  return Math.max(0.06, Math.min(0.5, Number(value.toFixed(2))));
};

export const backgroundOverlayDefinitions: BackgroundOverlayDefinition[] = [
  {
    id: "soft-dots",
    label: "Soft Dots",
    category: "Subtle",
    description: "Tiny dots that add a calm paper-like texture.",
    bestOn: ["Light solids", "Soft gradients"],
    preview:
      "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.2) 1px, transparent 0)",
    size: "18px 18px",
    repeat: "repeat",
    build: (opacity) =>
      `radial-gradient(circle at 1px 1px, rgba(15, 23, 42, ${opacity}) 1px, transparent 0)`,
  },
  {
    id: "graph-grid",
    label: "Dot Matrix",
    category: "Structured",
    description:
      "A crisp halftone field with enough structure to feel intentional.",
    bestOn: ["Gradients", "Dark solids"],
    preview:
      "radial-gradient(circle at 7px 7px, rgba(71, 85, 105, 0.28) 0 1.7px, transparent 2.1px), radial-gradient(circle at 23px 23px, rgba(177, 64, 127, 0.2) 0 1.15px, transparent 1.55px)",
    size: "32px 32px",
    repeat: "repeat",
    build: (opacity) =>
      `radial-gradient(circle at 7px 7px, rgba(71, 85, 105, ${opacity}) 0 1.7px, transparent 2.1px), radial-gradient(circle at 23px 23px, rgba(177, 64, 127, ${Math.max(opacity - 0.06, 0.06)}) 0 1.15px, transparent 1.55px)`,
  },
  {
    id: "diagonal-weave",
    label: "Offset Dots",
    category: "Structured",
    description:
      "Staggered dots that create movement without becoming a line grid.",
    bestOn: ["Bold gradients", "Techy themes"],
    preview:
      "radial-gradient(circle at 6px 8px, rgba(59, 130, 246, 0.24) 0 1.6px, transparent 2px), radial-gradient(circle at 24px 18px, rgba(208, 212, 23, 0.18) 0 1.2px, transparent 1.65px), radial-gradient(circle at 14px 30px, rgba(59, 130, 246, 0.16) 0 1.05px, transparent 1.5px)",
    size: "34px 34px",
    repeat: "repeat",
    build: (opacity) =>
      `radial-gradient(circle at 6px 8px, rgba(59, 130, 246, ${opacity}) 0 1.6px, transparent 2px), radial-gradient(circle at 24px 18px, rgba(208, 212, 23, ${Math.max(opacity - 0.04, 0.06)}) 0 1.2px, transparent 1.65px), radial-gradient(circle at 14px 30px, rgba(59, 130, 246, ${Math.max(opacity - 0.08, 0.06)}) 0 1.05px, transparent 1.5px)`,
  },
  {
    id: "pinstripes",
    label: "Micro Dots",
    category: "Subtle",
    description: "Fine halftone dots for a polished editorial feel.",
    bestOn: ["Light solids", "Minimal themes"],
    preview:
      "radial-gradient(circle at 3px 3px, rgba(15, 23, 42, 0.16) 0 0.85px, transparent 1.15px)",
    size: "10px 10px",
    repeat: "repeat",
    build: (opacity) =>
      `radial-gradient(circle at 3px 3px, rgba(15, 23, 42, ${opacity}) 0 0.85px, transparent 1.15px)`,
  },
  {
    id: "crosshatch",
    label: "Poster Dots",
    category: "Structured",
    description: "Bolder poster-style dots that stay readable on muted colors.",
    bestOn: ["Muted colors", "Editorial themes"],
    preview:
      "radial-gradient(circle at 10px 10px, rgba(15, 23, 42, 0.18) 0 2.2px, transparent 2.75px), radial-gradient(circle at 28px 28px, rgba(15, 23, 42, 0.1) 0 1.45px, transparent 1.9px)",
    size: "38px 38px",
    repeat: "repeat",
    build: (opacity) =>
      `radial-gradient(circle at 10px 10px, rgba(15, 23, 42, ${opacity}) 0 2.2px, transparent 2.75px), radial-gradient(circle at 28px 28px, rgba(15, 23, 42, ${Math.max(opacity - 0.08, 0.06)}) 0 1.45px, transparent 1.9px)`,
  },
  {
    id: "paper-grain",
    label: "Paper Grain",
    category: "Subtle",
    description:
      "A speckled texture that feels soft instead of obviously patterned.",
    bestOn: ["Warm backgrounds", "Neutral solids"],
    preview:
      "radial-gradient(circle at 20% 20%, rgba(15, 23, 42, 0.1) 0.8px, transparent 1px), radial-gradient(circle at 80% 30%, rgba(15, 23, 42, 0.08) 0.7px, transparent 1px), radial-gradient(circle at 35% 75%, rgba(15, 23, 42, 0.08) 0.7px, transparent 1px), radial-gradient(circle at 68% 82%, rgba(15, 23, 42, 0.06) 0.8px, transparent 1px)",
    size: "22px 22px",
    repeat: "repeat",
    build: (opacity) => {
      const strong = Math.min(opacity + 0.04, 0.22);
      const soft = Math.max(opacity - 0.03, 0.04);
      return `radial-gradient(circle at 20% 20%, rgba(15, 23, 42, ${strong}) 0.8px, transparent 1px), radial-gradient(circle at 80% 30%, rgba(15, 23, 42, ${opacity}) 0.7px, transparent 1px), radial-gradient(circle at 35% 75%, rgba(15, 23, 42, ${opacity}) 0.7px, transparent 1px), radial-gradient(circle at 68% 82%, rgba(15, 23, 42, ${soft}) 0.8px, transparent 1px)`;
    },
  },
  {
    id: "halo",
    label: "Halo Glow",
    category: "Atmospheric",
    description: "Large soft light pools spread across the full screen.",
    bestOn: ["Gradients", "Dark backgrounds"],
    preview:
      "radial-gradient(circle at 18% 24%, rgba(255, 255, 255, 0.38), transparent 34%), radial-gradient(circle at 82% 20%, rgba(255, 255, 255, 0.2), transparent 28%), radial-gradient(circle at 50% 76%, rgba(15, 23, 42, 0.14), transparent 34%)",
    size: "140% 140%",
    repeat: "no-repeat",
    position: "center",
    build: (opacity) => {
      const glow = Math.min(opacity + 0.14, 0.42);
      const secondary = Math.max(opacity - 0.02, 0.1);
      const shadow = Math.max(opacity - 0.08, 0.06);
      return `radial-gradient(circle at 18% 24%, rgba(255, 255, 255, ${glow}) 0%, transparent 34%), radial-gradient(circle at 82% 20%, rgba(255, 255, 255, ${secondary}) 0%, transparent 28%), radial-gradient(circle at 50% 76%, rgba(15, 23, 42, ${shadow}) 0%, transparent 34%)`;
    },
  },
  {
    id: "topography",
    label: "Big Halftone",
    category: "Structured",
    description: "Large-scale dots for a louder print-poster background.",
    bestOn: ["Solid colors", "Creative profiles"],
    preview:
      "radial-gradient(circle at 16px 16px, rgba(15, 23, 42, 0.2) 0 4px, transparent 4.7px), radial-gradient(circle at 48px 46px, rgba(15, 23, 42, 0.1) 0 2.7px, transparent 3.25px)",
    size: "64px 64px",
    repeat: "repeat",
    build: (opacity) =>
      `radial-gradient(circle at 16px 16px, rgba(15, 23, 42, ${opacity}) 0 4px, transparent 4.7px), radial-gradient(circle at 48px 46px, rgba(15, 23, 42, ${Math.max(opacity - 0.1, 0.06)}) 0 2.7px, transparent 3.25px)`,
  },
  {
    id: "sunrays",
    label: "Sunrays",
    category: "Atmospheric",
    description: "A gentle full-screen burst that lifts flatter backgrounds.",
    bestOn: ["Flat solids", "Warm gradients"],
    preview:
      "repeating-conic-gradient(from 0deg at 50% 50%, rgba(255, 255, 255, 0.16) 0deg 8deg, transparent 8deg 18deg)",
    size: "160% 160%",
    repeat: "no-repeat",
    position: "center",
    build: (opacity) =>
      `repeating-conic-gradient(from 0deg at 50% 50%, rgba(255, 255, 255, ${Math.min(opacity + 0.05, 0.24)}) 0deg 8deg, transparent 8deg 18deg)`,
  },
  {
    id: "mist",
    label: "Soft Mist",
    category: "Atmospheric",
    description: "A barely-there cloudiness that keeps the page feeling calm.",
    bestOn: ["Pastel gradients", "Calm themes"],
    preview:
      "radial-gradient(circle at 22% 28%, rgba(255, 255, 255, 0.28), transparent 36%), radial-gradient(circle at 78% 22%, rgba(255, 255, 255, 0.18), transparent 32%), radial-gradient(circle at 50% 80%, rgba(255, 255, 255, 0.22), transparent 30%)",
    size: "145% 145%",
    repeat: "no-repeat",
    position: "center",
    build: (opacity) => {
      const glow = Math.min(opacity + 0.08, 0.3);
      const soft = Math.max(opacity - 0.04, 0.08);
      return `radial-gradient(circle at 22% 28%, rgba(255, 255, 255, ${glow}) 0%, transparent 36%), radial-gradient(circle at 78% 22%, rgba(255, 255, 255, ${soft}) 0%, transparent 32%), radial-gradient(circle at 50% 80%, rgba(255, 255, 255, ${opacity}) 0%, transparent 30%)`;
    },
  },
];

const backgroundOverlayById = new Map(
  backgroundOverlayDefinitions.map((overlay) => [overlay.id, overlay]),
);

const legacyOverlayAliases = new Map<string, string>([
  [
    "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.08) 1px, transparent 0)",
    "soft-dots",
  ],
  [
    "linear-gradient(0deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
    "graph-grid",
  ],
  [
    "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%), linear-gradient(225deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%), linear-gradient(45deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%), linear-gradient(315deg, rgba(59, 130, 246, 0.1) 25%, transparent 25%)",
    "diagonal-weave",
  ],
]);

export const resolveThemePreset = (key?: string) => {
  if (key && themePresets[key]) return themePresets[key];
  return themePresets[defaultThemePresetKey];
};

export const resolveBackgroundOverlay = (
  overlayValue?: string,
  overlayOpacity?: number,
) => {
  if (!overlayValue) {
    return null;
  }

  const normalizedOverlayValue =
    legacyOverlayAliases.get(overlayValue) || overlayValue;
  const preset = backgroundOverlayById.get(normalizedOverlayValue);

  if (preset) {
    const opacity = clampOverlayOpacity(overlayOpacity);
    return {
      id: preset.id,
      label: preset.label,
      category: preset.category,
      opacity,
      css: preset.build(opacity),
      size: preset.size,
      repeat: preset.repeat,
      position: preset.position,
      preset,
    };
  }

  return {
    id: overlayValue,
    label: "Custom Overlay",
    opacity: clampOverlayOpacity(overlayOpacity),
    css: overlayValue,
    size: "24px 24px",
    repeat: "repeat",
    position: "left top",
    preset: null,
  };
};

export const isResolvedBackgroundDark = ({
  backgroundType,
  backgroundValue,
  backgroundSolidColor,
  preset,
}: {
  backgroundType?: BackgroundType;
  backgroundValue?: string;
  backgroundSolidColor?: string;
  preset: ThemePreset;
}) => {
  const sourceValue =
    backgroundType === "solid"
      ? backgroundSolidColor ||
        backgroundValue ||
        preset.background.baseColor ||
        preset.background.value
      : backgroundType === "gradient"
        ? backgroundValue || preset.background.value
        : backgroundType === "pattern"
          ? backgroundSolidColor ||
            preset.background.baseColor ||
            backgroundValue ||
            preset.background.value
          : backgroundValue ||
            backgroundSolidColor ||
            preset.background.value ||
            preset.background.baseColor;

  const matches = sourceValue?.match(/#[0-9a-fA-F]{3,6}/g) || [];
  if (matches.length === 0) {
    return false;
  }

  const toRgb = (hex: string) => {
    const normalized = hex.replace("#", "");
    if (normalized.length === 3) {
      const [r, g, b] = normalized.split("");
      return {
        r: parseInt(`${r}${r}`, 16),
        g: parseInt(`${g}${g}`, 16),
        b: parseInt(`${b}${b}`, 16),
      };
    }
    if (normalized.length === 6) {
      return {
        r: parseInt(normalized.slice(0, 2), 16),
        g: parseInt(normalized.slice(2, 4), 16),
        b: parseInt(normalized.slice(4, 6), 16),
      };
    }
    return null;
  };

  const getLuminance = ({ r, g, b }: { r: number; g: number; b: number }) => {
    const toLinear = (channel: number) => {
      const value = channel / 255;
      return value <= 0.03928
        ? value / 12.92
        : Math.pow((value + 0.055) / 1.055, 2.4);
    };

    const rLin = toLinear(r);
    const gLin = toLinear(g);
    const bLin = toLinear(b);
    return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
  };

  const luminanceValues = matches
    .map((hex) => toRgb(hex))
    .filter((rgb): rgb is { r: number; g: number; b: number } => rgb !== null)
    .map(getLuminance);

  if (luminanceValues.length === 0) {
    return false;
  }

  const average =
    luminanceValues.reduce((sum, value) => sum + value, 0) /
    luminanceValues.length;
  return average < 0.4;
};

export const getBackgroundStyle = ({
  backgroundType,
  backgroundValue,
  backgroundImageUrl,
  backgroundSolidColor,
  patternOverlayEnabled,
  patternOverlayValue,
  patternOverlayOpacity,
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
  patternOverlayOpacity?: number;
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
  const resolvedOverlay =
    patternOverlayEnabled === true
      ? resolveBackgroundOverlay(
          patternOverlayValue || legacyPattern,
          patternOverlayOpacity,
        )
      : patternOverlayEnabled === false
        ? null
        : resolveBackgroundOverlay(legacyPattern, patternOverlayOpacity);
  const resolvedGradient =
    resolvedType === "gradient" ? resolvedValue : undefined;

  const layers = [resolvedOverlay?.css, resolvedGradient].filter(
    Boolean,
  ) as string[];
  if (layers.length > 0 || resolvedSolid) {
    const overlaySize =
      resolvedOverlay?.size || preset.background.size || "24px 24px";
    const overlayPosition = resolvedOverlay?.position || "left top";
    const hasGradient = Boolean(resolvedGradient);
    return {
      backgroundColor: resolvedSolid,
      backgroundImage: layers.length > 0 ? layers.join(", ") : undefined,
      backgroundPosition: resolvedOverlay
        ? hasGradient
          ? `${overlayPosition}, center`
          : overlayPosition
        : undefined,
      backgroundRepeat: resolvedOverlay
        ? hasGradient
          ? `${resolvedOverlay.repeat || "repeat"}, no-repeat`
          : resolvedOverlay.repeat || "repeat"
        : undefined,
      backgroundSize: resolvedOverlay
        ? hasGradient
          ? `${overlaySize}, cover`
          : overlaySize
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
