import assert from "node:assert/strict";
import test from "node:test";

import { getBaseUrl } from "@/lib/frontend/shared/getBaseUrl";

const originalAppUrl = process.env.NEXT_PUBLIC_APP_URL;
const originalWindowDescriptor = Object.getOwnPropertyDescriptor(
  globalThis,
  "window",
);

test.afterEach(() => {
  if (originalAppUrl === undefined) {
    delete process.env.NEXT_PUBLIC_APP_URL;
  } else {
    process.env.NEXT_PUBLIC_APP_URL = originalAppUrl;
  }

  if (originalWindowDescriptor) {
    Object.defineProperty(globalThis, "window", originalWindowDescriptor);
  } else {
    delete (globalThis as { window?: unknown }).window;
  }
});

test("getBaseUrl uses the configured app URL during browser hydration", () => {
  process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3001";
  Object.defineProperty(globalThis, "window", {
    configurable: true,
    value: {
      location: {
        origin: "https://indexflow.nullis.one",
      },
    },
  });

  assert.equal(getBaseUrl(), "http://localhost:3001");
});
