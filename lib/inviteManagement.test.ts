import assert from "node:assert/strict";
import test from "node:test";

import {
  buildInviteLink,
  isInviteActive,
  isLegacyInvite,
  normalizeInviteStatus,
  shouldShowSendAction,
} from "@/lib/inviteManagement";

test("active invites are draft or sent only", () => {
  assert.equal(isInviteActive("draft"), true);
  assert.equal(isInviteActive("sent"), true);
  assert.equal(isInviteActive("pending"), true);
  assert.equal(isInviteActive("accepted"), false);
  assert.equal(isInviteActive("revoked"), false);
});

test("buildInviteLink joins app url and token", () => {
  assert.equal(
    buildInviteLink({
      appUrl: "https://indexflow.nullis.one",
      token: "abc123",
    }),
    "https://indexflow.nullis.one/invite/abc123",
  );
});

test("draft invites can be sent and sent invites can be resent", () => {
  assert.equal(shouldShowSendAction("draft"), true);
  assert.equal(shouldShowSendAction("sent"), true);
  assert.equal(shouldShowSendAction("accepted"), false);
  assert.equal(shouldShowSendAction("revoked"), false);
});

test("legacy pending status is normalized to draft for display", () => {
  assert.equal(normalizeInviteStatus("pending"), "draft");
});

test("legacy invites are detected from pending status", () => {
  assert.equal(isLegacyInvite({ status: "pending" }), true);
  assert.equal(isLegacyInvite({ status: "draft" }), false);
  assert.equal(isLegacyInvite({ status: "sent" }), false);
});
