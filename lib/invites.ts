import { createHash, randomBytes } from "node:crypto";
export { maskInviteEmail, normalizeInviteEmail } from "./inviteEmail";

export const createInviteToken = () => randomBytes(24).toString("hex");

export const hashInviteToken = (token: string) =>
  createHash("sha256").update(token).digest("hex");
