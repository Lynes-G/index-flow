import assert from "node:assert/strict";
import test from "node:test";

import {
  getHostnameFromHostHeader,
  isDashboardDevPreviewBypass,
  isDashboardDevPreviewRequest,
  isLocalHostname,
  searchParamsFromObject,
} from "@/lib/server/clerkMiddleware";

test("isLocalHostname accepts the standard local development hosts", () => {
  assert.equal(isLocalHostname("localhost"), true);
  assert.equal(isLocalHostname("127.0.0.1"), true);
  assert.equal(isLocalHostname("::1"), true);
  assert.equal(isLocalHostname("[::1]"), true);
  assert.equal(isLocalHostname("indexflow.nullis.one"), false);
});

test("dashboard dev preview bypass applies to local dashboard shell routes only", () => {
  assert.equal(
    isDashboardDevPreviewBypass({
      hostname: "localhost",
      pathname: "/dashboard",
      searchParams: new URLSearchParams("devPreview=1"),
      nodeEnv: "development",
    }),
    true,
  );

  assert.equal(
    isDashboardDevPreviewBypass({
      hostname: "localhost",
      pathname: "/dashboard/appearance",
      searchParams: new URLSearchParams("devPreview=1"),
      nodeEnv: "development",
    }),
    true,
  );

  assert.equal(
    isDashboardDevPreviewBypass({
      hostname: "localhost",
      pathname: "/dashboard/analytics/trends",
      searchParams: new URLSearchParams("devPreview=1"),
      nodeEnv: "development",
    }),
    true,
  );

  assert.equal(
    isDashboardDevPreviewBypass({
      hostname: "localhost",
      pathname: "/dashboard/new-link",
      searchParams: new URLSearchParams("devPreview=1"),
      nodeEnv: "development",
    }),
    false,
  );

  assert.equal(
    isDashboardDevPreviewBypass({
      hostname: "indexflow.nullis.one",
      pathname: "/dashboard",
      searchParams: new URLSearchParams("devPreview=1"),
      nodeEnv: "development",
    }),
    false,
  );
});

test("searchParamsFromObject preserves scalar and repeated values", () => {
  const result = searchParamsFromObject({
    devPreview: "1",
    tag: ["alpha", "beta"],
    empty: undefined,
  });

  assert.equal(result.get("devPreview"), "1");
  assert.deepEqual(result.getAll("tag"), ["alpha", "beta"]);
  assert.equal(result.has("empty"), false);
});

test("getHostnameFromHostHeader strips ports safely", () => {
  assert.equal(getHostnameFromHostHeader("localhost:3000"), "localhost");
  assert.equal(getHostnameFromHostHeader("[::1]:3000"), "[::1]");
  assert.equal(getHostnameFromHostHeader(null), "");
});

test("dashboard dev preview request accepts host headers from local dev", () => {
  assert.equal(
    isDashboardDevPreviewRequest({
      hostHeader: "localhost:3000",
      pathname: "/dashboard/username",
      searchParams: { devPreview: "1" },
      nodeEnv: "development",
    }),
    true,
  );
});
