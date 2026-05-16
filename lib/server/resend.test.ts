import assert from "node:assert/strict";
import test from "node:test";

import {
  buildInviteEmailPayload,
  getResendErrorMessage,
} from "@/lib/server/resend";

test("invite email payload includes exact-email warning and claim link", () => {
  const payload = buildInviteEmailPayload({
    email: "api@hotelaat.com",
    invitedPlan: "ultra",
    inviteLink: "https://indexflow.nullis.one/invite/token",
    fromEmail: "noreply@mail.nullis.one",
  });

  assert.equal(payload.from, "noreply@mail.nullis.one");
  assert.equal(payload.to, "api@hotelaat.com");
  assert.match(payload.subject, /Ultra/i);
  assert.match(payload.html, /exact email/i);
  assert.match(payload.html, /https:\/\/indexflow\.nullis\.one\/invite\/token/i);
});

test("resend error message includes provider details when available", () => {
  assert.equal(
    getResendErrorMessage({
      status: 403,
      bodyText: JSON.stringify({ message: "Domain not verified" }),
    }),
    "Failed to send invite email: Domain not verified",
  );
});
