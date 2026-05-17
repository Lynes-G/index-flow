export type InviteStatus =
  | "draft"
  | "sent"
  | "accepted"
  | "revoked"
  | "pending";

export const isInviteActive = (status: InviteStatus) =>
  status === "draft" || status === "sent" || status === "pending";

export const shouldShowSendAction = (status: InviteStatus) =>
  status === "draft" || status === "sent";

export const normalizeInviteStatus = (status: InviteStatus) =>
  status === "pending" ? "draft" : status;

export const isLegacyInvite = ({
  status,
}: {
  status: InviteStatus;
}) => status === "pending";

export const buildInviteLink = ({
  appUrl,
  token,
}: {
  appUrl: string;
  token: string;
}) => `${appUrl.replace(/\/$/, "")}/invite/${encodeURIComponent(token)}`;
