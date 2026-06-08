import { v } from "convex/values";

import { internalMutation, internalQuery } from "../_generated/server";
import {
  cleanStoredInviteTokenRecords,
  summarizeInviteSecurityRecords,
} from "./inviteSecurity";

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

    return summarizeInviteSecurityRecords(invites);
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

    return cleanStoredInviteTokenRecords({ db, invites });
  },
});
