import assert from "node:assert/strict";
import test from "node:test";

import {
  getBackgroundStyle,
  resolveBackgroundOverlay,
  resolveLayoutStyle,
  resolveThemePreset,
} from "./themePresets";

test("resolveBackgroundOverlay maps legacy raw CSS values to named overlays", () => {
  const overlay = resolveBackgroundOverlay(
    "radial-gradient(circle at 1px 1px, rgba(15, 23, 42, 0.08) 1px, transparent 0)",
    0.24,
  );

  assert.equal(overlay?.id, "soft-dots");
  assert.equal(overlay?.opacity, 0.24);
  assert.match(overlay?.css || "", /rgba\(15, 23, 42, 0.24\)/);
});

test("getBackgroundStyle composes the selected overlay with a gradient background", () => {
  const preset = resolveThemePreset("Sunset Glow");
  const style = getBackgroundStyle({
    backgroundType: "gradient",
    backgroundValue: "linear-gradient(135deg, #111827 0%, #1D4ED8 100%)",
    backgroundSolidColor: "#111827",
    patternOverlayEnabled: true,
    patternOverlayValue: "graph-grid",
    patternOverlayOpacity: 0.27,
    preset,
  });

  assert.equal(style.backgroundColor, "#111827");
  assert.match(style.backgroundImage || "", /rgba\(71, 85, 105, 0.27\)/);
  assert.match(
    style.backgroundImage || "",
    /linear-gradient\(135deg, #111827 0%, #1D4ED8 100%\)/,
  );
  assert.equal(style.backgroundRepeat, "repeat, no-repeat");
});

test("getBackgroundStyle keeps full-screen atmospheric overlays centered instead of tiling from the edge", () => {
  const preset = resolveThemePreset("Sunset Glow");
  const style = getBackgroundStyle({
    backgroundType: "solid",
    backgroundSolidColor: "#F8FAFC",
    patternOverlayEnabled: true,
    patternOverlayValue: "sunrays",
    patternOverlayOpacity: 0.18,
    preset,
  });

  assert.equal(style.backgroundSize, "160% 160%");
  assert.equal(style.backgroundRepeat, "no-repeat");
  assert.equal(style.backgroundPosition, "center");
});

test("resolveLayoutStyle defaults missing or invalid values to classic", () => {
  assert.equal(resolveLayoutStyle(undefined), "classic");
  assert.equal(resolveLayoutStyle("not-a-layout"), "classic");
  assert.equal(resolveLayoutStyle("spotlight"), "spotlight");
});
