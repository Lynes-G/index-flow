import type { Id } from "../_generated/dataModel";
import { isInviteActive, isLegacyInvite } from "../../lib/inviteManagement";

type PlanInviteSecurityRecord = {
  _id: Id<"planInvites">;
  status: "pending" | "draft" | "sent" | "accepted" | "revoked";
  revokedAt?: number;
  token?: unknown;
};

type PlanInviteSecurityDb = {
  patch: (
    id: Id<"planInvites">,
    patch: Record<string, unknown>,
  ) => Promise<void>;
};

const hasStoredRawToken = (invite: PlanInviteSecurityRecord) =>
  typeof invite.token === "string";

const shouldRevokeLegacyInvite = (invite: PlanInviteSecurityRecord) =>
  isLegacyInvite({ status: invite.status }) &&
  invite.status !== "accepted" &&
  invite.status !== "revoked";

export const summarizeInviteSecurityRecords = (
  invites: PlanInviteSecurityRecord[],
) => ({
  totalInvites: invites.length,
  invitesWithStoredRawTokens: invites.filter(hasStoredRawToken).length,
  legacyPendingInvites: invites.filter((invite) =>
    isLegacyInvite({ status: invite.status }),
  ).length,
  activeInvites: invites.filter((invite) => isInviteActive(invite.status))
    .length,
  acceptedInvites: invites.filter((invite) => invite.status === "accepted")
    .length,
  revokedInvites: invites.filter((invite) => invite.status === "revoked")
    .length,
});

export const cleanStoredInviteTokenRecords = async ({
  db,
  invites,
  now = Date.now(),
}: {
  db: PlanInviteSecurityDb;
  invites: PlanInviteSecurityRecord[];
  now?: number;
}) => {
  let rawTokensRemoved = 0;
  let legacyInvitesRevoked = 0;

  for (const invite of invites) {
    const patch: Record<string, unknown> = {};

    if (hasStoredRawToken(invite)) {
      patch.token = undefined;
      rawTokensRemoved += 1;
    }

    if (shouldRevokeLegacyInvite(invite)) {
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
};
