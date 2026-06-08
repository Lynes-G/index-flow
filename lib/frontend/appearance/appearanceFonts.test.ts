import assert from "node:assert/strict";
import test from "node:test";

import {
  appearanceFontsByCategory,
  appearanceGoogleFontsHref,
  appearanceFontOptions,
  defaultAppearanceFontFamily,
  sanitizeAppearanceFontFamily,
} from "./appearanceFonts";

test("sanitizeAppearanceFontFamily keeps supported fonts", () => {
  const supportedFont = appearanceFontOptions[0]?.family;

  assert.equal(sanitizeAppearanceFontFamily(supportedFont), supportedFont);
});

test("sanitizeAppearanceFontFamily falls back for unknown fonts", () => {
  assert.equal(
    sanitizeAppearanceFontFamily('"Unknown Font", sans-serif'),
    defaultAppearanceFontFamily,
  );
});

test("appearance fonts are grouped for dashboard rendering", () => {
  assert.equal(appearanceFontsByCategory.length > 1, true);
  assert.equal(
    appearanceFontsByCategory.some((group) => group.category === "Sans Serif"),
    true,
  );
});

test("appearanceGoogleFontsHref includes new font families", () => {
  assert.match(appearanceGoogleFontsHref, /Plus\+Jakarta\+Sans/);
  assert.match(appearanceGoogleFontsHref, /Libre\+Baskerville/);
});
