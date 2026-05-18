import assert from "node:assert/strict";
import test from "node:test";

import { getAccentForeground } from "@/lib/accentColor";

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
