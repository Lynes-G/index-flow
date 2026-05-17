import assert from "node:assert/strict";
import test from "node:test";

import { splitPublicProfileLinks } from "@/lib/publicProfileLinks";

const links = [
  { _id: "1", title: "GitHub", url: "https://github.com", order: 0 },
  { _id: "2", title: "Portfolio", url: "https://example.com", order: 1 },
];

test("public profile links fall back cleanly when featured link is missing", () => {
  const result = splitPublicProfileLinks(links, "missing");

  assert.equal(result.featuredLink, null);
  assert.deepEqual(result.remainingLinks, links);
});

test("public profile links separate a valid featured link from the rest", () => {
  const result = splitPublicProfileLinks(links, "2");

  assert.deepEqual(result.featuredLink, links[1]);
  assert.deepEqual(result.remainingLinks, [links[0]]);
});
