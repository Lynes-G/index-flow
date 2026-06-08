import assert from "node:assert/strict";
import test from "node:test";
import { buildDashboardPreviewModel } from "./dashboardPreview";

test("dashboard preview falls back to demo links when there are no user links", () => {
  const result = buildDashboardPreviewModel({
    displayName: "Ada",
    currentSlug: "ada",
    fallbackShareSlug: "user_123",
    userLinks: [],
    featuredLinkId: null,
  });

  assert.equal(result.selectedFeaturedLink, null);
  assert.deepEqual(result.previewLinks, [
    {
      id: "demo-portfolio",
      title: "Portfolio",
      url: "https://example.com",
      order: 0,
    },
    {
      id: "demo-latest-work",
      title: "Latest Work",
      url: "https://example.com",
      order: 1,
    },
    {
      id: "demo-newsletter",
      title: "Newsletter",
      url: "https://example.com",
      order: 2,
    },
  ]);
});

test("dashboard preview excludes the featured link from the remaining links", () => {
  const result = buildDashboardPreviewModel({
    displayName: "Ada",
    currentSlug: "ada",
    fallbackShareSlug: "user_123",
    userLinks: [
      { id: "1", title: "Portfolio", url: "https://portfolio.com", order: 0 },
      { id: "2", title: "Newsletter", url: "https://newsletter.com", order: 1 },
    ],
    featuredLinkId: "2",
  });

  assert.deepEqual(result.selectedFeaturedLink, {
    id: "2",
    title: "Newsletter",
    url: "https://newsletter.com",
    order: 1,
  });
  assert.deepEqual(result.previewLinks, [
    {
      id: "1",
      title: "Portfolio",
      url: "https://portfolio.com",
      order: 0,
    },
  ]);
});

test("dashboard preview falls back cleanly when the featured link does not match", () => {
  const result = buildDashboardPreviewModel({
    displayName: "Ada",
    currentSlug: "ada",
    fallbackShareSlug: "user_123",
    userLinks: [],
    featuredLinkId: "missing",
  });

  assert.equal(result.selectedFeaturedLink, null);
  assert.deepEqual(result.previewLinks, [
    {
      id: "demo-portfolio",
      title: "Portfolio",
      url: "https://example.com",
      order: 0,
    },
    {
      id: "demo-latest-work",
      title: "Latest Work",
      url: "https://example.com",
      order: 1,
    },
    {
      id: "demo-newsletter",
      title: "Newsletter",
      url: "https://example.com",
      order: 2,
    },
  ]);
});

test("dashboard preview derives shareSlug from currentSlug before the fallback value", () => {
  const result = buildDashboardPreviewModel({
    displayName: "Ada",
    currentSlug: "ada-lovelace",
    fallbackShareSlug: "user_123",
    userLinks: [],
    featuredLinkId: null,
  });

  assert.equal(result.shareSlug, "ada-lovelace");
});

test('dashboard preview falls back to "Your Name" when displayName is empty or null', () => {
  const emptyNameResult = buildDashboardPreviewModel({
    displayName: "",
    currentSlug: null,
    fallbackShareSlug: "user_123",
    userLinks: [],
    featuredLinkId: null,
  });

  const nullNameResult = buildDashboardPreviewModel({
    displayName: null,
    currentSlug: null,
    fallbackShareSlug: "user_123",
    userLinks: [],
    featuredLinkId: null,
  });

  assert.equal(emptyNameResult.displayName, "Your Name");
  assert.equal(nullNameResult.displayName, "Your Name");
});
