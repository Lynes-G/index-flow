import { v } from "convex/values";

import { internalMutation, internalQuery } from "../_generated/server";
import { isInviteActive, isLegacyInvite } from "../../lib/inviteManagement";

export const summarizeInviteSecurityState = internalQuery({
  args: {},
  returns: v.object({
    totalInvites: v.number(),
    invitesWithStoredRawTokens: v.number(),
    legacyPendingInvites: v.number(),
    activeInvites: v.number(),
    acceptedInvites: v.number(),
    revokedInvites: v.number(),
  }),
  handler: async ({ db }) => {
    const invites = await db.query("planInvites").collect();

    return {
      totalInvites: invites.length,
      invitesWithStoredRawTokens: invites.filter(
        (invite) => typeof (invite as { token?: unknown }).token === "string",
      ).length,
      legacyPendingInvites: invites.filter((invite) =>
        isLegacyInvite({ status: invite.status }),
      ).length,
      activeInvites: invites.filter((invite) => isInviteActive(invite.status)).length,
      acceptedInvites: invites.filter((invite) => invite.status === "accepted").length,
      revokedInvites: invites.filter((invite) => invite.status === "revoked").length,
    };
  },
});

export const cleanStoredInviteTokens = internalMutation({
  args: {},
  returns: v.object({
    rawTokensRemoved: v.number(),
    legacyInvitesRevoked: v.number(),
  }),
  handler: async ({ db }) => {
    const invites = await db.query("planInvites").collect();
    const now = Date.now();
    let rawTokensRemoved = 0;
    let legacyInvitesRevoked = 0;

    for (const invite of invites) {
      const patch: Record<string, unknown> = {};
      const hasStoredRawToken =
        typeof (invite as { token?: unknown }).token === "string";

      if (hasStoredRawToken) {
        patch.token = undefined;
        rawTokensRemoved += 1;
      }

      if (
        isLegacyInvite({ status: invite.status }) &&
        invite.status !== "accepted" &&
        invite.status !== "revoked"
      ) {
        patch.status = "revoked";
        patch.revokedAt = invite.revokedAt ?? now;
        legacyInvitesRevoked += 1;
      }

      if (Object.keys(patch).length > 0) {
        await db.patch(invite._id, patch);
      }
    }

    return {
      rawTokensRemoved,
      legacyInvitesRevoked,
    };
  },
});
