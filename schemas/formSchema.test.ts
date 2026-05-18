import assert from "node:assert/strict";
import test from "node:test";

import { createLinkFormSchema } from "./formSchema";

test("createLinkFormSchema trims submitted values", () => {
  const parsed = createLinkFormSchema.parse({
    title: "  My portfolio  ",
    url: "  https://example.com  ",
  });

  assert.deepEqual(parsed, {
    title: "My portfolio",
    url: "https://example.com",
  });
});

test("createLinkFormSchema rejects a blank link name after trimming", () => {
  const result = createLinkFormSchema.safeParse({
    title: "   ",
    url: "https://example.com",
  });

  assert.equal(result.success, false);
  assert.equal(result.error.issues[0]?.message, "Link name is required");
});

test("createLinkFormSchema explains valid URL requirements clearly", () => {
  const result = createLinkFormSchema.safeParse({
    title: "Launch",
    url: "ftp://example.com",
  });

  assert.equal(result.success, false);
  assert.equal(
    result.error.issues[0]?.message,
    "Enter a full URL or a domain like example.com",
  );
});
