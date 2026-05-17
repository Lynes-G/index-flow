import assert from "node:assert/strict";
import test from "node:test";

import { hasTrustedOrigin } from "@/lib/server/requestOrigin";

test("trusted origin check allows same-origin requests", () => {
  const request = new Request("https://indexflow.nullis.one/api/admin/send-invite", {
    headers: {
      origin: "https://indexflow.nullis.one",
      host: "indexflow.nullis.one",
      "x-forwarded-proto": "https",
    },
  });

  assert.equal(hasTrustedOrigin(request), true);
});

test("trusted origin check blocks cross-origin requests", () => {
  const request = new Request("https://indexflow.nullis.one/api/admin/send-invite", {
    headers: {
      origin: "https://evil.example",
      host: "indexflow.nullis.one",
      "x-forwarded-proto": "https",
    },
  });

  assert.equal(hasTrustedOrigin(request), false);
});
