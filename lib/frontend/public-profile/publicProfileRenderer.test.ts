import assert from "node:assert/strict";
import test from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";

import PublicProfileRenderer from "@/components/public-profile/PublicProfileRenderer";
import { resolveThemePreset } from "@/lib/frontend/appearance/themePresets";

const baseProps = {
  username: "lynes",
  accentColor: "#35c92f",
  avatarShape: "circle" as const,
  featuredLink: {
    _id: "link_featured",
    title: "LinkedIn",
    url: "https://linkedin.com",
    order: 0,
  },
  links: [
    {
      _id: "link_website",
      title: "Website",
      url: "https://example.com",
      order: 1,
    },
  ],
  layoutStyle: "classic" as const,
  linkStyle: "rounded" as const,
  backgroundStyle: {},
  fontFamily: "Inter, sans-serif",
  profileUrl: "https://indexflow.test/q/lynes",
  preset: resolveThemePreset(undefined),
};

test("public profile renderer can hide QR card and footer for editor previews", () => {
  const markup = renderToStaticMarkup(
    createElement(PublicProfileRenderer, {
      ...baseProps,
      showQrCard: false,
      showFooter: false,
      interactive: false,
    }),
  );

  assert.match(markup, /@lynes/);
  assert.match(markup, /LinkedIn/);
  assert.doesNotMatch(markup, /Share this profile/);
  assert.doesNotMatch(markup, /Powered by:/);
});

test("public profile renderer shows QR card and footer for public pages by default", () => {
  process.env.NEXT_PUBLIC_APP_URL = "https://indexflow.test";

  const markup = renderToStaticMarkup(
    createElement(PublicProfileRenderer, baseProps),
  );

  assert.match(markup, /Share this profile/);
  assert.match(markup, /Powered by:/);
});

test("forced mobile profile renderer avoids viewport breakpoint layout classes", () => {
  const markup = renderToStaticMarkup(
    createElement(PublicProfileRenderer, {
      ...baseProps,
      forceMobileLayout: true,
      interactive: false,
      showQrCard: false,
      showFooter: false,
    }),
  );

  assert.match(markup, /Open link/);
  assert.doesNotMatch(markup, /sm:flex-row/);
  assert.doesNotMatch(markup, /sm:w-auto/);
  assert.doesNotMatch(markup, /sm:px-5/);
  assert.doesNotMatch(markup, /sm:text-xl/);
});
