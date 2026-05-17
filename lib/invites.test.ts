import assert from "node:assert/strict";
import test from "node:test";

import { createInviteToken, hashInviteToken } from "@/lib/invites";

test("invite tokens are generated as 48-character hex strings", () => {
  const token = createInviteToken();

  assert.match(token, /^[0-9a-f]{48}$/);
});

test("hashInviteToken is deterministic for the same token", () => {
  const token = "abc123";

  assert.equal(hashInviteToken(token), hashInviteToken(token));
});
