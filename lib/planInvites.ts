import {
  isLegacyInvite,
  normalizeInviteStatus,
  type InviteStatus,
} from "./inviteManagement";

export type AdminInviteSummary<TId = unknown> = {
  _id: TId;
  email: string;
  invitedPlan: "pro" | "ultra";
  status: "draft" | "sent" | "accepted" | "revoked";
  createdAt: number;
  sentAt?: number;
  lastSentAt?: number;
  sendCount: number;
  acceptedAt?: number;
  isLegacy: boolean;
};

export const toAdminInviteSummary = <TId>(invite: {
  _id: TId;
  _creationTime?: number;
  email: string;
  invitedPlan: "pro" | "ultra";
  status: InviteStatus;
  createdAt: number;
  sentAt?: number;
  lastSentAt?: number;
  sendCount?: number;
  acceptedAt?: number;
}): AdminInviteSummary<TId> => ({
  _id: invite._id,
  email: invite.email,
  invitedPlan: invite.invitedPlan,
  status: normalizeInviteStatus(invite.status),
  createdAt: invite.createdAt,
  sentAt: invite.sentAt,
  lastSentAt: invite.lastSentAt,
  sendCount: invite.sendCount ?? 0,
  acceptedAt: invite.acceptedAt,
  isLegacy: isLegacyInvite({ status: invite.status }),
});
