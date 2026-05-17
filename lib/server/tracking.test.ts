import assert from "node:assert/strict";
import test from "node:test";

import { validateTrackingEventPayload } from "@/lib/server/tracking";

test("tracking payload validation accepts a valid click payload", () => {
  const result = validateTrackingEventPayload({
    profileUsername: "indexflow",
    linkId: "abc123",
  });

  assert.deepEqual(result, {
    profileUsername: "indexflow",
    linkId: "abc123",
  });
});

test("tracking payload validation rejects malformed payloads", () => {
  assert.throws(
    () =>
      validateTrackingEventPayload({
        profileUsername: "",
        linkId: "abc123",
      }),
  );

  assert.throws(
    () =>
      validateTrackingEventPayload({
        profileUsername: "indexflow",
        linkId: "",
      }),
  );
});
