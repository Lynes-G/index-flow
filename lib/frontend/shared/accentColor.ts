const hexToRgb = (hex: string) => {
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

const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) =>
  `#${[r, g, b]
    .map((channel) => Math.round(channel).toString(16).padStart(2, "0"))
    .join("")}`;

const getRelativeLuminance = ({
  r,
  g,
  b,
}: {
  r: number;
  g: number;
  b: number;
}) => {
  const toLinear = (channel: number) => {
    const value = channel / 255;
    return value <= 0.03928
      ? value / 12.92
      : Math.pow((value + 0.055) / 1.055, 2.4);
  };

  const rLinear = toLinear(r);
  const gLinear = toLinear(g);
  const bLinear = toLinear(b);

  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
};

const getContrastRatio = (
  foreground: { r: number; g: number; b: number },
  background: { r: number; g: number; b: number },
) => {
  const foregroundLuminance = getRelativeLuminance(foreground);
  const backgroundLuminance = getRelativeLuminance(background);
  const lighter = Math.max(foregroundLuminance, backgroundLuminance);
  const darker = Math.min(foregroundLuminance, backgroundLuminance);

  return (lighter + 0.05) / (darker + 0.05);
};

const blendRgb = (
  source: { r: number; g: number; b: number },
  target: { r: number; g: number; b: number },
  ratio: number,
) => ({
  r: source.r + (target.r - source.r) * ratio,
  g: source.g + (target.g - source.g) * ratio,
  b: source.b + (target.b - source.b) * ratio,
});

export const getAccentForeground = (accentColor: string) => {
  const rgb = hexToRgb(accentColor);

  if (!rgb) return "#ffffff";

  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;

  return luminance > 0.62 ? "#0f172a" : "#ffffff";
};

export const getAccentInkOnLight = (accentColor: string) => {
  const rgb = hexToRgb(accentColor);

  if (!rgb) return "#0f172a";

  const white = { r: 255, g: 255, b: 255 };
  const slate900 = { r: 15, g: 23, b: 42 };

  if (getContrastRatio(rgb, white) >= 4.5) {
    return rgbToHex(rgb);
  }

  for (let step = 1; step <= 12; step += 1) {
    const candidate = blendRgb(rgb, slate900, step / 12);

    if (getContrastRatio(candidate, white) >= 4.5) {
      return rgbToHex(candidate);
    }
  }

  return "#0f172a";
};

export const getAccentShadowOnBrutalistSurface = (accentColor: string) => {
  const rgb = hexToRgb(accentColor);

  if (!rgb) return "#f8fafc";

  const surface = { r: 255, g: 248, b: 231 };
  const black = { r: 17, g: 17, b: 17 };
  const white = { r: 255, g: 255, b: 255 };
  const slate900 = { r: 15, g: 23, b: 42 };
  const minimumButtonContrast = 3;
  const minimumSurfaceContrast = 1.6;

  const shadowContrastOnButton = getContrastRatio(rgb, black);
  const shadowContrastOnSurface = getContrastRatio(rgb, surface);

  if (
    shadowContrastOnButton >= minimumButtonContrast &&
    shadowContrastOnSurface >= minimumSurfaceContrast
  ) {
    return rgbToHex(rgb);
  }

  if (shadowContrastOnButton < minimumButtonContrast) {
    for (let step = 1; step <= 12; step += 1) {
      const candidate = blendRgb(rgb, white, step / 12);

      if (
        getContrastRatio(candidate, black) >= minimumButtonContrast &&
        getContrastRatio(candidate, surface) >= minimumSurfaceContrast
      ) {
        return rgbToHex(candidate);
      }
    }
  }

  for (let step = 1; step <= 12; step += 1) {
    const candidate = blendRgb(rgb, slate900, step / 12);

    if (
      getContrastRatio(candidate, black) >= minimumButtonContrast &&
      getContrastRatio(candidate, surface) >= minimumSurfaceContrast
    ) {
      return rgbToHex(candidate);
    }
  }

  return shadowContrastOnButton < minimumButtonContrast ? "#f8fafc" : "#334155";
};
