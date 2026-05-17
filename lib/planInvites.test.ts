import assert from "node:assert/strict";
import test from "node:test";

import { toAdminInviteSummary } from "@/lib/planInvites";

test("toAdminInviteSummary strips Convex document metadata fields", () => {
  const summary = toAdminInviteSummary({
    _id: "invite_123",
    _creationTime: 12345,
    email: "api@hotelaat.com",
    invitedPlan: "ultra",
    status: "draft",
    createdAt: 111,
    sentAt: undefined,
    lastSentAt: undefined,
    sendCount: 0,
    acceptedAt: undefined,
  });

  assert.deepEqual(summary, {
    _id: "invite_123",
    email: "api@hotelaat.com",
    invitedPlan: "ultra",
    status: "draft",
    createdAt: 111,
    sentAt: undefined,
    lastSentAt: undefined,
    sendCount: 0,
    acceptedAt: undefined,
    isLegacy: false,
  });
});
