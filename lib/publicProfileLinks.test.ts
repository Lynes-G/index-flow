import test from "node:test";
import assert from "node:assert/strict";

const { splitPublicProfileLinks } = await import(
  new URL("./publicProfileLinks.ts", import.meta.url).href
);

test("splitPublicProfileLinks returns the selected featured link first and excludes it from the remaining list", () => {
  const links = [
    {
      _id: "one",
      title: "Portfolio",
      url: "https://example.com/portfolio",
      order: 0,
    },
    {
      _id: "two",
      title: "Book a Call",
      url: "https://example.com/book",
      order: 1,
    },
    {
      _id: "three",
      title: "YouTube",
      url: "https://youtube.com/@indexflow",
      order: 2,
    },
  ];

  assert.deepEqual(splitPublicProfileLinks(links, "two"), {
    featuredLink: links[1],
    remainingLinks: [links[0], links[2]],
  });
});

test("splitPublicProfileLinks falls back cleanly when the featured id is missing", () => {
  const links = [
    {
      _id: "one",
      title: "Portfolio",
      url: "https://example.com/portfolio",
      order: 0,
    },
    {
      _id: "two",
      title: "Book a Call",
      url: "https://example.com/book",
      order: 1,
    },
  ];

  assert.deepEqual(splitPublicProfileLinks(links, "missing"), {
    featuredLink: null,
    remainingLinks: links,
  });
});

test("splitPublicProfileLinks falls back cleanly when no featured link is configured", () => {
  const links = [
    {
      _id: "one",
      title: "Portfolio",
      url: "https://example.com/portfolio",
      order: 0,
    },
    {
      _id: "two",
      title: "Book a Call",
      url: "https://example.com/book",
      order: 1,
    },
  ];

  assert.deepEqual(splitPublicProfileLinks(links), {
    featuredLink: null,
    remainingLinks: links,
  });
});
