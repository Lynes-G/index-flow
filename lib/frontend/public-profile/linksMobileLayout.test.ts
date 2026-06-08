import assert from "node:assert/strict";
import test from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import Links from "@/components/public-profile/Links";

const links = [
  {
    _id: "facebook",
    title: "Facebook",
    url: "https://facebook.com",
    order: 0,
  },
  {
    _id: "youtube",
    title: "Youtube",
    url: "https://youtube.com",
    order: 1,
  },
];

test("forced mobile grid layout does not emit desktop two-column breakpoint classes", () => {
  const markup = renderToStaticMarkup(
    createElement(Links, {
      links,
      username: "lynes",
      accentColor: "#35c92f",
      layoutStyle: "grid",
      linkStyle: "pill",
      interactive: false,
      forceMobileLayout: true,
    }),
  );

  assert.match(markup, /grid max-w-4xl gap-3/);
  assert.doesNotMatch(markup, /sm:grid-cols-2/);
});
