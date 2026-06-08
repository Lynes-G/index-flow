import assert from "node:assert/strict";
import test from "node:test";

import {
  createDashboardSetupChecklist,
  getAppearanceChecklistItems,
  getDashboardSetupAction,
  hasConfiguredThemeDirection,
} from "./dashboardSetupChecklist";
import {
  defaultThemePresetKey,
  resolveThemePreset,
} from "../appearance/themePresets";

test("theme direction stays incomplete when customization still matches the default preset", () => {
  const defaultPreset = resolveThemePreset(defaultThemePresetKey);

  assert.equal(hasConfiguredThemeDirection(null), false);
  assert.equal(
    hasConfiguredThemeDirection({
      accentColor: defaultPreset.accentColor,
      fontFamily: defaultPreset.fontFamily,
      layoutStyle: defaultPreset.layoutStyle,
      linkStyle: defaultPreset.linkStyle,
      avatarShape: "circle",
      backgroundType: defaultPreset.background.type,
      backgroundValue: defaultPreset.background.value,
      backgroundSolidColor: defaultPreset.background.baseColor,
      themePreset: defaultThemePresetKey,
    }),
    false,
  );
});

test("appearance checklist keeps only the appearance-focused setup items", () => {
  const checklist = createDashboardSetupChecklist({
    customization: null,
    linkCount: 0,
  });

  const appearanceItems = getAppearanceChecklistItems(checklist);

  assert.deepEqual(
    appearanceItems.map((item) => item.key),
    ["bio", "profile-photo", "theme"],
  );
});

test("dashboard setup action returns a clear call to action for each checklist item", () => {
  assert.deepEqual(getDashboardSetupAction("first-link"), {
    href: "/dashboard",
    label: "Add your first link",
  });
  assert.deepEqual(getDashboardSetupAction("bio"), {
    href: "/dashboard/appearance",
    label: "Write your bio",
  });
  assert.deepEqual(getDashboardSetupAction("profile-photo"), {
    href: "/dashboard/appearance",
    label: "Upload a photo",
  });
  assert.deepEqual(getDashboardSetupAction("theme"), {
    href: "/dashboard/appearance",
    label: "Choose a style",
  });
});
