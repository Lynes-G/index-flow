import assert from "node:assert/strict";
import test from "node:test";

import {
  formatAnalyticsDate,
  normalizeAnalyticsDateString,
  normalizeAnalyticsText,
} from "./analyticsFormatting";
import { normalizeAnalyticsData } from "./fetchAnalytics";

test("normalizeAnalyticsDateString removes empty and epoch-like values", () => {
  assert.equal(normalizeAnalyticsDateString(null), null);
  assert.equal(normalizeAnalyticsDateString(""), null);
  assert.equal(normalizeAnalyticsDateString("0"), null);
  assert.equal(normalizeAnalyticsDateString("1970-01-01"), null);
  assert.equal(normalizeAnalyticsDateString("1970-01-01T00:00:00.000Z"), null);
});

test("formatAnalyticsDate falls back cleanly for invalid analytics dates", () => {
  assert.equal(
    formatAnalyticsDate({ dateString: "1970-01-01T00:00:00.000Z" }),
    "No activity yet",
  );
  assert.equal(
    formatAnalyticsDate({ dateString: "not-a-date", fallback: "N/A" }),
    "N/A",
  );
});

test("normalizeAnalyticsText strips empty text values", () => {
  assert.equal(normalizeAnalyticsText("  "), null);
  assert.equal(normalizeAnalyticsText(" direct "), "direct");
});

test("normalizeAnalyticsData guards malformed dates and summary values", () => {
  const result = normalizeAnalyticsData({
    total_profile_views: "25",
    total_clicks: "12",
    unique_users: 4,
    countries_reached: undefined,
    total_links_clicked: "3",
    total_qr_scans: null,
    top_link_title: [""],
    top_referrer: ["https://example.com/post"],
    first_click: "1970-01-01T00:00:00.000Z",
    last_click: "2026-05-31T08:00:00.000Z",
  });

  assert.equal(result.profileViews, 25);
  assert.equal(result.totalClicks, 12);
  assert.equal(result.uniqueVisitors, 4);
  assert.equal(result.countriesReached, 0);
  assert.equal(result.totalLinksClicked, 3);
  assert.equal(result.qrScans, 0);
  assert.equal(result.topLinkTitle, null);
  assert.equal(result.topReferrer, "https://example.com/post");
  assert.equal(result.firstClick, null);
  assert.equal(result.lastClick, "2026-05-31T08:00:00.000Z");
});
