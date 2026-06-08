export type BrandSurfaceTone = "light" | "dark";

function byTone<T>(
  tone: BrandSurfaceTone,
  assets: Record<BrandSurfaceTone, T>,
) {
  return assets[tone];
}

export function getBrandLogoSrc(tone: BrandSurfaceTone) {
  return byTone(tone, {
    light: "/indexflow-light.svg",
    dark: "/indexflow-dark.svg",
  });
}

export function getBrandIconSrc(tone?: BrandSurfaceTone) {
  void tone;
  return "/indexflow-icon.svg";
}
