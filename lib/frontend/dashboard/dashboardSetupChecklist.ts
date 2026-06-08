import {
  defaultThemePresetKey,
  resolveThemePreset,
  type AvatarShape,
  type BackgroundType,
  type LayoutStyle,
  type LinkStyle,
} from "@/lib/frontend/appearance/themePresets";

type ChecklistCustomizationSnapshot = {
  accentColor?: string | null;
  backgroundSolidColor?: string | null;
  backgroundType?: string | null;
  backgroundValue?: string | null;
  avatarShape?: string | null;
  description?: string | null;
  fontFamily?: string | null;
  layoutStyle?: string | null;
  linkStyle?: string | null;
  profilePictureUrl?: string | null;
  themePreset?: string | null;
};

export type DashboardSetupChecklistItem = {
  key: "first-link" | "bio" | "profile-photo" | "theme";
  label: string;
  description: string;
  href: string;
  complete: boolean;
};

export type DashboardSetupAction = {
  href: string;
  label: string;
};

const defaultPreset = resolveThemePreset(defaultThemePresetKey);

const normalizeText = (value?: string | null) => value?.trim() ?? "";

export const hasConfiguredThemeDirection = (
  customization: ChecklistCustomizationSnapshot | null | undefined,
) => {
  if (!customization) {
    return false;
  }

  const themePreset = customization.themePreset ?? defaultThemePresetKey;
  if (themePreset !== defaultThemePresetKey) {
    return true;
  }

  return (
    (customization.accentColor ?? defaultPreset.accentColor) !==
      defaultPreset.accentColor ||
    normalizeText(customization.fontFamily) !==
      normalizeText(defaultPreset.fontFamily) ||
    ((customization.layoutStyle as LayoutStyle | null | undefined) ??
      defaultPreset.layoutStyle) !== defaultPreset.layoutStyle ||
    ((customization.linkStyle as LinkStyle | null | undefined) ??
      defaultPreset.linkStyle) !== defaultPreset.linkStyle ||
    ((customization.avatarShape as AvatarShape | null | undefined) ??
      "circle") !== "circle" ||
    ((customization.backgroundType as BackgroundType | null | undefined) ??
      defaultPreset.background.type) !== defaultPreset.background.type ||
    normalizeText(customization.backgroundValue) !==
      normalizeText(defaultPreset.background.value) ||
    normalizeText(customization.backgroundSolidColor) !==
      normalizeText(defaultPreset.background.baseColor)
  );
};

export const createDashboardSetupChecklist = ({
  customization,
  linkCount,
}: {
  customization: ChecklistCustomizationSnapshot | null | undefined;
  linkCount: number;
}): DashboardSetupChecklistItem[] => [
  {
    key: "first-link",
    label: "Add your first link",
    description: "Start with the clearest destination you want people to open.",
    href: "/dashboard",
    complete: linkCount > 0,
  },
  {
    key: "bio",
    label: "Add a short bio",
    description:
      "Give visitors one quick sentence about who you are or what this page is for.",
    href: "/dashboard/appearance",
    complete: normalizeText(customization?.description).length > 0,
  },
  {
    key: "profile-photo",
    label: "Upload a profile photo",
    description:
      "A recognizable image makes the page feel finished and easier to trust.",
    href: "/dashboard/appearance",
    complete: Boolean(customization?.profilePictureUrl),
  },
  {
    key: "theme",
    label: "Choose a page direction",
    description:
      "Pick a template or style direction so the page stops feeling like a blank default.",
    href: "/dashboard/appearance",
    complete: hasConfiguredThemeDirection(customization),
  },
];

export const getDashboardSetupProgress = (
  items: DashboardSetupChecklistItem[],
) => {
  const completedCount = items.filter((item) => item.complete).length;
  const totalCount = items.length;
  const progressPercent =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return {
    completedCount,
    totalCount,
    progressPercent,
    remainingItems: items.filter((item) => !item.complete),
  };
};

export const getDashboardSetupAction = (
  key: DashboardSetupChecklistItem["key"],
): DashboardSetupAction => {
  switch (key) {
    case "first-link":
      return {
        href: "/dashboard",
        label: "Add your first link",
      };
    case "bio":
      return {
        href: "/dashboard/appearance",
        label: "Write your bio",
      };
    case "profile-photo":
      return {
        href: "/dashboard/appearance",
        label: "Upload a photo",
      };
    case "theme":
      return {
        href: "/dashboard/appearance",
        label: "Choose a style",
      };
  }
};

export const getAppearanceChecklistItems = (
  items: DashboardSetupChecklistItem[],
) => items.filter((item) => item.key !== "first-link");
