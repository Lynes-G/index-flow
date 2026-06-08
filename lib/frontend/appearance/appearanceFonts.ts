export type AppearanceFontCategory =
  | "Sans Serif"
  | "Serif"
  | "Display"
  | "Monospace";

export type AppearanceFontOption = {
  key: string;
  label: string;
  category: AppearanceFontCategory;
  family: string;
  googleFamily: string;
};

const createFontOption = (
  key: string,
  label: string,
  category: AppearanceFontCategory,
  family: string,
  googleFamily: string,
): AppearanceFontOption => ({
  key,
  label,
  category,
  family,
  googleFamily,
});

export const appearanceFontOptions: AppearanceFontOption[] = [
  createFontOption(
    "dmSans",
    "DM Sans",
    "Sans Serif",
    '"DM Sans", "Helvetica Neue", sans-serif',
    "DM+Sans:wght@400;500;600;700;800",
  ),
  createFontOption(
    "sora",
    "Sora",
    "Sans Serif",
    '"Sora", "Helvetica Neue", sans-serif',
    "Sora:wght@400;500;600;700;800",
  ),
  createFontOption(
    "spaceGrotesk",
    "Space Grotesk",
    "Sans Serif",
    '"Space Grotesk", "Helvetica Neue", sans-serif',
    "Space+Grotesk:wght@400;500;600;700",
  ),
  createFontOption(
    "manrope",
    "Manrope",
    "Sans Serif",
    '"Manrope", "Helvetica Neue", sans-serif',
    "Manrope:wght@400;500;600;700;800",
  ),
  createFontOption(
    "plusJakartaSans",
    "Plus Jakarta Sans",
    "Sans Serif",
    '"Plus Jakarta Sans", "Helvetica Neue", sans-serif',
    "Plus+Jakarta+Sans:wght@400;500;600;700;800",
  ),
  createFontOption(
    "outfit",
    "Outfit",
    "Sans Serif",
    '"Outfit", "Helvetica Neue", sans-serif',
    "Outfit:wght@400;500;600;700;800",
  ),
  createFontOption(
    "fredoka",
    "Fredoka",
    "Sans Serif",
    '"Fredoka", "Helvetica Neue", sans-serif',
    "Fredoka:wght@400;500;600;700",
  ),
  createFontOption(
    "montserrat",
    "Montserrat",
    "Sans Serif",
    '"Montserrat", "Helvetica Neue", sans-serif',
    "Montserrat:wght@400;500;600;700",
  ),
  createFontOption(
    "bricolageGrotesque",
    "Bricolage Grotesque",
    "Display",
    '"Bricolage Grotesque", "Helvetica Neue", sans-serif',
    "Bricolage+Grotesque:opsz,wght@12..96,400;12..96,500;12..96,600;12..96,700;12..96,800",
  ),
  createFontOption(
    "playfairDisplay",
    "Playfair Display",
    "Display",
    '"Playfair Display", "Georgia", serif',
    "Playfair+Display:wght@400;500;600;700",
  ),
  createFontOption(
    "unbounded",
    "Unbounded",
    "Display",
    '"Unbounded", "Helvetica Neue", sans-serif',
    "Unbounded:wght@400;500;600;700;800",
  ),
  createFontOption(
    "fraunces",
    "Fraunces",
    "Display",
    '"Fraunces", "Georgia", serif',
    "Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700",
  ),
  createFontOption(
    "sourceSerif4",
    "Source Serif 4",
    "Serif",
    '"Source Serif 4", "Times New Roman", serif',
    "Source+Serif+4:opsz,wght@8..60,400;8..60,500;8..60,600;8..60,700",
  ),
  createFontOption(
    "cormorantGaramond",
    "Cormorant Garamond",
    "Serif",
    '"Cormorant Garamond", "Georgia", serif',
    "Cormorant+Garamond:wght@400;500;600;700",
  ),
  createFontOption(
    "libreBaskerville",
    "Libre Baskerville",
    "Serif",
    '"Libre Baskerville", "Georgia", serif',
    "Libre+Baskerville:wght@400;700",
  ),
  createFontOption(
    "ibmPlexMono",
    "IBM Plex Mono",
    "Monospace",
    '"IBM Plex Mono", "SFMono-Regular", monospace',
    "IBM+Plex+Mono:wght@400;500;600",
  ),
];

export const appearanceFontFamilies = Object.freeze(
  Object.fromEntries(
    appearanceFontOptions.map((font) => [font.key, font.family]),
  ) as Record<string, string>,
);

export const defaultAppearanceFontFamily = appearanceFontFamilies.sora;

const appearanceFontFamilySet = new Set(
  appearanceFontOptions.map((font) => font.family),
);

export const appearanceFontsByCategory = appearanceFontOptions.reduce<
  Array<{
    category: AppearanceFontCategory;
    fonts: AppearanceFontOption[];
  }>
>((groups, font) => {
  const existingGroup = groups.find(
    (group) => group.category === font.category,
  );

  if (existingGroup) {
    existingGroup.fonts.push(font);
    return groups;
  }

  groups.push({ category: font.category, fonts: [font] });
  return groups;
}, []);

export const sanitizeAppearanceFontFamily = (fontFamily?: string) => {
  if (fontFamily && appearanceFontFamilySet.has(fontFamily)) {
    return fontFamily;
  }

  return defaultAppearanceFontFamily;
};

export const appearanceGoogleFontsHref = `https://fonts.googleapis.com/css2?${appearanceFontOptions
  .map((font) => `family=${font.googleFamily}`)
  .join("&")}&display=swap`;
