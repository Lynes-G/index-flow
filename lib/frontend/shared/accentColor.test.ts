import assert from "node:assert/strict";
import test from "node:test";

import {
  getAccentForeground,
  getAccentInkOnLight,
  getAccentShadowOnBrutalistSurface,
} from "@/lib/frontend/shared/accentColor";

test("getAccentForeground returns dark text for light accent colors", () => {
  assert.equal(getAccentForeground("#fcd34d"), "#0f172a");
  assert.equal(getAccentForeground("#22d3ee"), "#0f172a");
});

test("getAccentForeground returns white text for dark accent colors", () => {
  assert.equal(getAccentForeground("#111827"), "#ffffff");
  assert.equal(getAccentForeground("#7c3aed"), "#ffffff");
});

test("getAccentForeground falls back to white for invalid colors", () => {
  assert.equal(getAccentForeground("not-a-color"), "#ffffff");
});

test("getAccentInkOnLight darkens low-contrast accent colors for light surfaces", () => {
  assert.equal(getAccentInkOnLight("#d9ff8a"), "#637852");
  assert.equal(getAccentInkOnLight("#fcd34d"), "#86753c");
});

test("getAccentInkOnLight preserves already-readable accent colors", () => {
  assert.equal(getAccentInkOnLight("#111827"), "#111827");
  assert.equal(getAccentInkOnLight("#7c3aed"), "#7c3aed");
});

test("getAccentInkOnLight falls back to slate for invalid colors", () => {
  assert.equal(getAccentInkOnLight("not-a-color"), "#0f172a");
});

test("getAccentShadowOnBrutalistSurface lightens very dark accents for visibility", () => {
  const shadowColor = getAccentShadowOnBrutalistSurface("#111111");

  assert.match(shadowColor, /^#[0-9a-f]{6}$/i);
  assert.notEqual(shadowColor.toLowerCase(), "#111111");
});

test("getAccentShadowOnBrutalistSurface darkens very light accents for visibility", () => {
  const shadowColor = getAccentShadowOnBrutalistSurface("#fef3c7");

  assert.match(shadowColor, /^#[0-9a-f]{6}$/i);
  assert.notEqual(shadowColor.toLowerCase(), "#fef3c7");
});

test("getAccentShadowOnBrutalistSurface falls back safely for invalid colors", () => {
  assert.equal(getAccentShadowOnBrutalistSurface("not-a-color"), "#f8fafc");
});
