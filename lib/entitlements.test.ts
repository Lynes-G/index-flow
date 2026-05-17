import test from "node:test";
import assert from "node:assert/strict";

import {
  canAccessAnalytics,
  getLinkLimit,
  resolveEffectivePlan,
} from "@/lib/entitlements";

test("admin invite can upgrade a free user to ultra", () => {
  assert.equal(resolveEffectivePlan({ paidPlan: "free", grantedPlan: "ultra" }), "ultra");
});

test("paid ultra stays ultra even without an admin grant", () => {
  assert.equal(resolveEffectivePlan({ paidPlan: "ultra", grantedPlan: null }), "ultra");
});

test("admin users resolve to ultra even without a paid plan or invite grant", () => {
  assert.equal(
    resolveEffectivePlan({ paidPlan: "free", grantedPlan: null, isAdmin: true }),
    "ultra",
  );
});

test("analytics is available from pro and above", () => {
  assert.equal(canAccessAnalytics("free"), false);
  assert.equal(canAccessAnalytics("pro"), true);
  assert.equal(canAccessAnalytics("ultra"), true);
});

test("link limits match the effective plan", () => {
  assert.equal(getLinkLimit("free"), 3);
  assert.equal(getLinkLimit("pro"), 10);
  assert.equal(getLinkLimit("ultra"), null);
});
