import { v } from "convex/values";

import { mutation, query } from "../_generated/server";
import { isAdminUserId } from "../../lib/admin";
import { normalizeInviteEmail } from "../../lib/inviteEmail";
import { isInviteActive, isLegacyInvite } from "../../lib/inviteManagement";
import { toAdminInviteSummary } from "../../lib/planInvites";

const planGrantValidator = v.union(v.literal("pro"), v.literal("ultra"));
const createInviteToken = () => {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const hashInviteToken = async (token: string) => {
  const encodedToken = new TextEncoder().encode(token);
  const buffer = await crypto.subtle.digest("SHA-256", encodedToken);

  return Array.from(new Uint8Array(buffer), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
};
export const getActivePlanGrantForUser = query({
  args: { userId: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("planGrants"),
      plan: planGrantValidator,
      source: v.literal("admin_invite"),
      email: v.string(),
      grantedAt: v.number(),
    }),
  ),
  handler: async ({ db }, args) => {
    const grants = await db
      .query("planGrants")
      .withIndex("by_user_id", (q) => q.eq("userId", args.userId))
      .collect();

    const activeGrant = grants
      .filter((grant) => grant.active)
      .sort((left, right) => right.grantedAt - left.grantedAt)[0];

    if (!activeGrant) {
      return null;
    }

    return {
      _id: activeGrant._id,
      plan: activeGrant.plan,
      source: activeGrant.source,
      email: activeGrant.email,
      grantedAt: activeGrant.grantedAt,
    };
  },
});

export const getInviteByTokenHash = query({
  args: { tokenHash: v.string() },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id("planInvites"),
      email: v.string(),
      invitedPlan: planGrantValidator,
      status: v.union(
        v.literal("draft"),
        v.literal("sent"),
        v.literal("accepted"),
        v.literal("revoked"),
      ),
      acceptedByUserId: v.optional(v.string()),
      createdAt: v.number(),
      sentAt: v.optional(v.number()),
      lastSentAt: v.optional(v.number()),
      sendCount: v.number(),
      acceptedAt: v.optional(v.number()),
      isLegacy: v.boolean(),
    }),
  ),
  handler: async ({ db }, args) => {
    const invite = await db
      .query("planInvites")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", args.tokenHash))
      .unique();

    if (!invite) {
      return null;
    }

    return {
      _id: invite._id,
      email: invite.email,
      invitedPlan: invite.invitedPlan,
      status: invite.status === "pending" ? "draft" : invite.status,
      acceptedByUserId: invite.acceptedByUserId,
      createdAt: invite.createdAt,
      sentAt: invite.sentAt,
      lastSentAt: invite.lastSentAt,
      sendCount: invite.sendCount ?? 0,
      acceptedAt: invite.acceptedAt,
      isLegacy: isLegacyInvite({ status: invite.status }),
    };
  },
});

export const listAdminInvites = query({
  args: { createdByUserId: v.string() },
  returns: v.array(
    v.object({
      _id: v.id("planInvites"),
      email: v.string(),
      invitedPlan: planGrantValidator,
      status: v.union(
        v.literal("draft"),
        v.literal("sent"),
        v.literal("accepted"),
        v.literal("revoked"),
      ),
      createdAt: v.number(),
      sentAt: v.optional(v.number()),
      lastSentAt: v.optional(v.number()),
      sendCount: v.number(),
      acceptedAt: v.optional(v.number()),
      isLegacy: v.boolean(),
    }),
  ),
  handler: async ({ db }, args) => {
    const invites = await db
      .query("planInvites")
      .withIndex("by_created_by", (q) => q.eq("createdByUserId", args.createdByUserId))
      .order("desc")
      .collect();

    return invites.map((invite) => toAdminInviteSummary(invite));
  },
});

export const createAdminPlanInvite = mutation({
  args: {
    email: v.string(),
    invitedPlan: planGrantValidator,
  },
  returns: v.object({
    inviteId: v.id("planInvites"),
    token: v.string(),
  }),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;

    if (!isAdminUserId(userId)) {
      throw new Error("Forbidden");
    }

    const normalizedEmail = normalizeInviteEmail(args.email);
    const existingInvites = await db
      .query("planInvites")
      .withIndex("by_email", (q) => q.eq("email", normalizedEmail))
      .collect();

    const now = Date.now();
    const token = createInviteToken();
    const tokenHash = await hashInviteToken(token);

    for (const invite of existingInvites) {
      if (
        invite.invitedPlan === args.invitedPlan &&
        isInviteActive(invite.status)
      ) {
        await db.patch(invite._id, {
          status: "revoked",
          revokedAt: now,
        });
      }
    }

    const inviteId = await db.insert("planInvites", {
      email: normalizedEmail,
      invitedPlan: args.invitedPlan,
      tokenHash,
      status: "draft",
      createdByUserId: userId,
      createdAt: now,
      sendCount: 0,
    });

    return { inviteId, token };
  },
});

export const summarizeInviteSecurityState = query({
  args: {},
  returns: v.object({
    totalInvites: v.number(),
    invitesWithStoredRawTokens: v.number(),
    legacyPendingInvites: v.number(),
    activeInvites: v.number(),
    acceptedInvites: v.number(),
    revokedInvites: v.number(),
  }),
  handler: async ({ db, auth }) => {
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (!isAdminUserId(identity.subject)) {
      throw new Error("Forbidden");
    }

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

export const issueAdminInviteToken = mutation({
  args: {
    inviteId: v.id("planInvites"),
  },
  returns: v.object({
    token: v.string(),
  }),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (!isAdminUserId(identity.subject)) {
      throw new Error("Forbidden");
    }

    const invite = await db.get(args.inviteId);

    if (!invite) {
      throw new Error("Invite not found");
    }

    if (invite.status === "accepted" || invite.status === "revoked") {
      throw new Error("Invite can no longer issue a link");
    }

    if (isLegacyInvite({ status: invite.status })) {
      throw new Error("Legacy invite cannot issue a link. Create a new draft instead.");
    }

    const token = createInviteToken();
    const tokenHash = await hashInviteToken(token);

    await db.patch(invite._id, {
      tokenHash,
    });

    return { token };
  },
});

export const markInviteSent = mutation({
  args: {
    inviteId: v.id("planInvites"),
  },
  returns: v.null(),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (!isAdminUserId(identity.subject)) {
      throw new Error("Forbidden");
    }

    const invite = await db.get(args.inviteId);

    if (!invite) {
      throw new Error("Invite not found");
    }

    if (invite.status === "revoked" || invite.status === "accepted") {
      throw new Error("Invite can no longer be sent");
    }

    if (isLegacyInvite({ status: invite.status })) {
      throw new Error("Legacy invite cannot be sent. Create a new draft instead.");
    }

    const now = Date.now();
    await db.patch(invite._id, {
      status: "sent",
      sentAt: invite.sentAt ?? now,
      lastSentAt: now,
      sendCount: (invite.sendCount ?? 0) + 1,
    });

    return null;
  },
});

export const revokeInvite = mutation({
  args: {
    inviteId: v.id("planInvites"),
  },
  returns: v.null(),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (!isAdminUserId(identity.subject)) {
      throw new Error("Forbidden");
    }

    const invite = await db.get(args.inviteId);

    if (!invite) {
      throw new Error("Invite not found");
    }

    const relatedGrants = await db
      .query("planGrants")
      .withIndex("by_invite_id", (q) => q.eq("inviteId", invite._id))
      .collect();

    for (const grant of relatedGrants) {
      await db.delete(grant._id);
    }

    await db.delete(invite._id);

    return null;
  },
});

export const revokeLegacyInvites = mutation({
  args: {},
  returns: v.object({
    revokedCount: v.number(),
  }),
  handler: async ({ db, auth }) => {
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (!isAdminUserId(identity.subject)) {
      throw new Error("Forbidden");
    }

    const invites = await db.query("planInvites").collect();
    const now = Date.now();
    let revokedCount = 0;

    for (const invite of invites) {
      if (
        isLegacyInvite({ status: invite.status }) &&
        invite.status !== "accepted" &&
        invite.status !== "revoked"
      ) {
        await db.patch(invite._id, {
          status: "revoked",
          revokedAt: invite.revokedAt ?? now,
        });
        revokedCount += 1;
      }
    }

    return { revokedCount };
  },
});

export const cleanStoredInviteTokens = mutation({
  args: {},
  returns: v.object({
    rawTokensRemoved: v.number(),
    legacyInvitesRevoked: v.number(),
  }),
  handler: async ({ db, auth }) => {
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    if (!isAdminUserId(identity.subject)) {
      throw new Error("Forbidden");
    }

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

export const acceptPlanInvite = mutation({
  args: {
    tokenHash: v.string(),
    email: v.string(),
  },
  returns: v.object({
    inviteId: v.id("planInvites"),
    plan: planGrantValidator,
  }),
  handler: async ({ db, auth }, args) => {
    const identity = await auth.getUserIdentity();

    if (!identity) {
      throw new Error("Unauthorized");
    }

    const userId = identity.subject;

    const invite = await db
      .query("planInvites")
      .withIndex("by_token_hash", (q) => q.eq("tokenHash", args.tokenHash))
      .unique();

    if (!invite) {
      throw new Error("Invite not found");
    }

    if (invite.status === "revoked") {
      throw new Error("Invite has been revoked");
    }

    if (invite.status === "accepted") {
      if (invite.acceptedByUserId === userId) {
        return { inviteId: invite._id, plan: invite.invitedPlan };
      }

      throw new Error("Invite has already been accepted");
    }

    if (!isInviteActive(invite.status)) {
      throw new Error("Invite is not claimable");
    }

    if (invite.email !== normalizeInviteEmail(args.email)) {
      throw new Error("Invite email does not match the signed-in account");
    }

    const existingGrants = await db
      .query("planGrants")
      .withIndex("by_user_id", (q) => q.eq("userId", userId))
      .collect();

    for (const grant of existingGrants) {
      if (grant.active) {
        await db.patch(grant._id, { active: false });
      }
    }

    await db.insert("planGrants", {
      userId,
      email: invite.email,
      plan: invite.invitedPlan,
      source: "admin_invite",
      inviteId: invite._id,
      grantedByUserId: invite.createdByUserId,
      grantedAt: Date.now(),
      active: true,
    });

    await db.patch(invite._id, {
      status: "accepted",
      acceptedByUserId: userId,
      acceptedAt: Date.now(),
    });

    return { inviteId: invite._id, plan: invite.invitedPlan };
  },
});
