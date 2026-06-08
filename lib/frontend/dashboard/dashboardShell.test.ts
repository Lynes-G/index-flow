import assert from "node:assert/strict";
import test from "node:test";

import {
  DASHBOARD_DEV_PREVIEW_PARAM,
  dashboardTasks,
  getDashboardTaskFromPathname,
  isDashboardShellPath,
  withDashboardDevPreview,
} from "./dashboardShell.ts";

test("dashboardTasks exposes the approved task order", () => {
  assert.deepEqual(
    dashboardTasks.map((task) => task.id),
    ["links", "appearance", "analytics", "billing"],
  );
  assert.equal(dashboardTasks[0]?.label, "Profile");
});

test("getDashboardTaskFromPathname resolves each dashboard route", () => {
  assert.equal(getDashboardTaskFromPathname("/dashboard"), "links");
  assert.equal(
    getDashboardTaskFromPathname("/dashboard/appearance"),
    "appearance",
  );
  assert.equal(
    getDashboardTaskFromPathname("/dashboard/analytics"),
    "analytics",
  );
  assert.equal(getDashboardTaskFromPathname("/dashboard/username"), "username");
  assert.equal(getDashboardTaskFromPathname("/dashboard/billing"), "billing");
});

test("getDashboardTaskFromPathname falls back to links for unknown paths", () => {
  assert.equal(getDashboardTaskFromPathname("/dashboard/unknown"), "links");
});

test("getDashboardTaskFromPathname does not misroute similar prefixes", () => {
  assert.equal(getDashboardTaskFromPathname("/dashboard/appearancex"), "links");
  assert.equal(
    getDashboardTaskFromPathname("/dashboard/analytics-old"),
    "links",
  );
});

test("isDashboardShellPath only matches routes rendered inside the shell", () => {
  assert.equal(isDashboardShellPath("/dashboard"), true);
  assert.equal(isDashboardShellPath("/dashboard/appearance"), true);
  assert.equal(isDashboardShellPath("/dashboard/analytics/trends"), true);
  assert.equal(isDashboardShellPath("/dashboard/new-link"), false);
  assert.equal(isDashboardShellPath("/dashboard/link/123"), false);
});

test("withDashboardDevPreview preserves shell navigation preview state", () => {
  assert.equal(
    withDashboardDevPreview("/dashboard/appearance", true),
    `/dashboard/appearance?${DASHBOARD_DEV_PREVIEW_PARAM}=1`,
  );
  assert.equal(
    withDashboardDevPreview("/dashboard/billing?tab=access", true),
    `/dashboard/billing?tab=access&${DASHBOARD_DEV_PREVIEW_PARAM}=1`,
  );
  assert.equal(
    withDashboardDevPreview("/dashboard/username", false),
    "/dashboard/username",
  );
});
