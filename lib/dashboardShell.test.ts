import assert from "node:assert/strict";
import test from "node:test";

import {
  dashboardTasks,
  getDashboardTaskFromPathname,
  getRailModeForTask,
} from "./dashboardShell.ts";

test("dashboardTasks exposes the approved task order", () => {
  assert.deepEqual(
    dashboardTasks.map((task) => task.id),
    ["links", "appearance", "analytics", "username", "billing"],
  );
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

test("getRailModeForTask returns the expected rail mode for each task", () => {
  assert.equal(getRailModeForTask("links"), "preview-compact");
  assert.equal(getRailModeForTask("appearance"), "preview-full");
  assert.equal(getRailModeForTask("analytics"), "analytics-summary");
  assert.equal(getRailModeForTask("username"), "username-summary");
  assert.equal(getRailModeForTask("billing"), "billing-summary");
});
