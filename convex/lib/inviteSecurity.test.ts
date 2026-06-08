import assert from "node:assert/strict";
import test from "node:test";

import {
  cleanStoredInviteTokenRecords,
  summarizeInviteSecurityRecords,
} from "./inviteSecurity";

const invite = (
  status: "pending" | "draft" | "sent" | "accepted" | "revoked",
  extras: { token?: unknown; revokedAt?: number } = {},
) => ({
  _id: `invite_${status}`,
  status,
  ...extras,
});

test("summarizeInviteSecurityRecords counts token, legacy, active, and terminal invite states", () => {
  const summary = summarizeInviteSecurityRecords([
    invite("pending", { token: "raw-token" }),
    invite("draft"),
    invite("sent"),
    invite("accepted"),
    invite("revoked"),
  ] as never);

  assert.deepEqual(summary, {
    totalInvites: 5,
    invitesWithStoredRawTokens: 1,
    legacyPendingInvites: 1,
    activeInvites: 3,
    acceptedInvites: 1,
    revokedInvites: 1,
  });
});

test("cleanStoredInviteTokenRecords removes raw tokens and revokes legacy pending invites", async () => {
  const patches: Array<{ id: string; patch: Record<string, unknown> }> = [];
  const invites = [
    { _id: "invite_pending", status: "pending", token: "raw-token" },
    { _id: "invite_draft", status: "draft", token: "raw-token" },
    { _id: "invite_sent", status: "sent" },
    { _id: "invite_revoked", status: "revoked", token: "raw-token" },
  ] as never;

  const result = await cleanStoredInviteTokenRecords({
    db: {
      patch: async (id, patch) => {
        patches.push({ id, patch });
      },
    },
    invites,
    now: 1234,
  });

  assert.deepEqual(result, {
    rawTokensRemoved: 3,
    legacyInvitesRevoked: 1,
  });
  assert.deepEqual(patches, [
    {
      id: "invite_pending",
      patch: { token: undefined, status: "revoked", revokedAt: 1234 },
    },
    { id: "invite_draft", patch: { token: undefined } },
    { id: "invite_revoked", patch: { token: undefined } },
  ]);
});
