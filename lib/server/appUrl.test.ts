import assert from "node:assert/strict";
import test from "node:test";

import { getAppUrl } from "@/lib/server/appUrl";

const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;

test.afterEach(() => {
  if (originalAppUrl === undefined) {
    delete process.env.NEXT_PUBLIC_APP_URL;
  } else {
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  }
});

test("getAppUrl reads NEXT_PUBLIC_APP_URL", () => {
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";

  assert.equal(getAppUrl(), "http://localhost:3000");
});

test("getAppUrl normalizes host-only app URLs to https origins", () => {
  process.env.NEXT_PUBLIC_APP_URL = "indexflow.example/path";

  assert.equal(getAppUrl(), "https://indexflow.example");
});

test("getAppUrl fails fast when NEXT_PUBLIC_APP_URL is missing", () => {
  delete process.env.NEXT_PUBLIC_APP_URL;

  assert.throws(() => getAppUrl(), /Missing NEXT_PUBLIC_APP_URL/);
});

test("getAppUrl fails fast when NEXT_PUBLIC_APP_URL is invalid", () => {
  process.env.NEXT_PUBLIC_APP_URL = "https://";

  assert.throws(() => getAppUrl(), /Invalid NEXT_PUBLIC_APP_URL/);
});
