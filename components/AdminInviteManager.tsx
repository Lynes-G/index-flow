"use client";

import { useState, useTransition } from "react";
import { useMutation, useQuery } from "convex/react";
import { Ban, Copy, Mail, RotateCcw, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  buildInviteLink,
  isInviteActive,
  normalizeInviteStatus,
  shouldShowSendAction,
  type InviteStatus,
} from "@/lib/inviteManagement";

type InvitePlan = "pro" | "ultra";

const normalizeEmail = (email: string) => email.trim().toLowerCase();

const formatDate = (timestamp: number | undefined) => {
  if (!timestamp) {
    return "N/A";
  }

  return new Date(timestamp).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const getInviteLink = (token: string) =>
  buildInviteLink({
    appUrl: window.location.origin,
    token,
  });

const getStatusClassName = (status: InviteStatus) => {
  const normalizedStatus = normalizeInviteStatus(status);

  if (normalizedStatus === "accepted") {
    return "bg-emerald-100 text-emerald-800";
  }

  if (normalizedStatus === "sent") {
    return "bg-blue-100 text-blue-800";
  }

  if (normalizedStatus === "revoked") {
    return "bg-rose-100 text-rose-700";
  }

  return "bg-amber-100 text-amber-800";
};

const getStatusLabel = (status: InviteStatus, isLegacy: boolean) => {
  if (isLegacy) {
    return "legacy";
  }

  return normalizeInviteStatus(status);
};

const AdminInviteManager = ({ currentUserId }: { currentUserId: string }) => {
  const invites = useQuery(api.lib.planEntitlements.listAdminInvites, {
    createdByUserId: currentUserId,
  });
  const createInvite = useMutation(api.lib.planEntitlements.createAdminPlanInvite);
  const issueInviteToken = useMutation(
    api.lib.planEntitlements.issueAdminInviteToken,
  );
  const markInviteSent = useMutation(api.lib.planEntitlements.markInviteSent);
  const revokeInvite = useMutation(api.lib.planEntitlements.revokeInvite);
  const revokeLegacyInvites = useMutation(
    api.lib.planEntitlements.revokeLegacyInvites,
  );

  const [email, setEmail] = useState("");
  const [invitedPlan, setInvitedPlan] = useState<InvitePlan>("ultra");
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [issuedTokens, setIssuedTokens] = useState<Record<string, string>>({});
  const [isPending, startTransition] = useTransition();

  const cacheIssuedToken = (inviteId: string, token: string) => {
    setIssuedTokens((current) => ({
      ...current,
      [inviteId]: token,
    }));
  };

  const getInviteToken = async ({
    inviteId,
    rotate,
  }: {
    inviteId: string;
    rotate: boolean;
  }) => {
    if (!rotate && issuedTokens[inviteId]) {
      return issuedTokens[inviteId];
    }

    const result = await issueInviteToken({ inviteId: inviteId as never });
    cacheIssuedToken(inviteId, result.token);
    return result.token;
  };

  const handleCreateInvite = () => {
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail) {
      toast.error("Enter an email address first.");
      return;
    }

    startTransition(async () => {
      setActiveAction("create");

      try {
        const result = await createInvite({
          email: normalizedEmail,
          invitedPlan,
        });
        cacheIssuedToken(result.inviteId as string, result.token);

        setEmail("");
        toast.success("Draft invite created.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to create draft invite.";
        toast.error(message);
      } finally {
        setActiveAction(null);
      }
    });
  };

  const handleCopyLink = (inviteId: string) => {
    startTransition(async () => {
      setActiveAction(`copy:${inviteId}`);

      try {
        const token = await getInviteToken({ inviteId, rotate: false });
        await navigator.clipboard.writeText(getInviteLink(token));
        toast.success("Invite link copied.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to copy invite link.";
        toast.error(message);
      } finally {
        setActiveAction(null);
      }
    });
  };

  const handleSendInvite = ({
    inviteId,
    email,
    invitedPlan,
    mode,
  }: {
    inviteId: string;
    email: string;
    invitedPlan: InvitePlan;
    mode: "send" | "resend";
  }) => {
    startTransition(async () => {
      setActiveAction(`${mode}:${inviteId}`);

      try {
        const token = await getInviteToken({
          inviteId,
          rotate: mode === "resend",
        });
        const response = await fetch("/api/admin/send-invite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            invitedPlan,
            token,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to send invite email");
        }

        await markInviteSent({ inviteId: inviteId as never });
        toast.success(
          mode === "send"
            ? "Invite email sent."
            : "Invite email resent. Older invite links were replaced.",
        );
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to send invite email.";
        toast.error(message);
      } finally {
        setActiveAction(null);
      }
    });
  };

  const handleRevokeInvite = (inviteId: string) => {
    startTransition(async () => {
      setActiveAction(`revoke:${inviteId}`);

      try {
        await revokeInvite({ inviteId: inviteId as never });
        toast.success("Invite revoked.");
      } catch (error) {
        const message =
          error instanceof Error ? error.message : "Failed to revoke invite.";
        toast.error(message);
      } finally {
        setActiveAction(null);
      }
    });
  };

  const handleRevokeLegacyInvites = () => {
    startTransition(async () => {
      setActiveAction("revoke-legacy");

      try {
        const result = await revokeLegacyInvites({});
        toast.success(`Revoked ${result.revokedCount} legacy invite(s).`);
      } catch (error) {
        const message =
          error instanceof Error
            ? error.message
            : "Failed to revoke legacy invites.";
        toast.error(message);
      } finally {
        setActiveAction(null);
      }
    });
  };

  const hasLegacyInvites = (invites ?? []).some((invite) => invite.isLegacy);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold tracking-wide text-emerald-700 uppercase">
            <ShieldCheck className="size-4" />
            Admin-only access grants
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-slate-900">
            Professional invite management
          </h2>
          <p className="mt-2 max-w-2xl text-sm text-slate-600">
            Create a draft first, then copy, send, resend, or revoke it later.
            The invited person still has to sign up with the exact email
            address you enter here. Resending rotates the invite link and
            disables older links.
          </p>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[minmax(0,1fr)_180px_auto]">
        <Input
          type="email"
          placeholder="person@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <select
          value={invitedPlan}
          onChange={(event) => setInvitedPlan(event.target.value as InvitePlan)}
          className="flex h-10 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-900 shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
        >
          <option value="pro">Pro</option>
          <option value="ultra">Ultra</option>
        </select>
        <Button
          type="button"
          onClick={handleCreateInvite}
          disabled={isPending && activeAction === "create"}
        >
          {isPending && activeAction === "create" ? "Creating..." : "Create draft"}
        </Button>
      </div>

      <div className="mt-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-lg font-semibold text-slate-900">Invites</h3>
          {hasLegacyInvites && (
            <Button
              type="button"
              variant="outline"
              onClick={handleRevokeLegacyInvites}
              disabled={isPending && activeAction === "revoke-legacy"}
            >
              {isPending && activeAction === "revoke-legacy"
                ? "Revoking legacy invites..."
                : "Revoke legacy invites"}
            </Button>
          )}
        </div>
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Plan</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium">Last sent</th>
                <th className="px-4 py-3 font-medium">Accepted</th>
                <th className="px-4 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {(invites ?? []).map((invite) => {
                const isRowBusy = (prefix: string) =>
                  isPending && activeAction === `${prefix}:${invite._id}`;
                const canCopy = !invite.isLegacy && isInviteActive(invite.status);
                const canSend = !invite.isLegacy && shouldShowSendAction(invite.status);
                const canRevoke =
                  !invite.isLegacy &&
                  invite.status !== "accepted" &&
                  invite.status !== "revoked";

                return (
                  <tr key={invite._id}>
                    <td className="px-4 py-3 text-slate-700">{invite.email}</td>
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {invite.invitedPlan.toUpperCase()}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusClassName(invite.status)}`}
                      >
                        {getStatusLabel(invite.status, invite.isLegacy)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(invite.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(invite.lastSentAt)}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDate(invite.acceptedAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {canCopy && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isRowBusy("copy")}
                            onClick={() => handleCopyLink(invite._id as string)}
                          >
                            <Copy className="size-4" />
                            Copy
                          </Button>
                        )}
                        {canSend && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isRowBusy(invite.status === "draft" ? "send" : "resend")}
                            onClick={() =>
                              handleSendInvite({
                                inviteId: invite._id as string,
                                email: invite.email,
                                invitedPlan: invite.invitedPlan,
                                mode: invite.status === "draft" ? "send" : "resend",
                              })
                            }
                          >
                            {invite.status === "draft" ? (
                              <>
                                <Mail className="size-4" />
                                Send
                              </>
                            ) : (
                              <>
                                <RotateCcw className="size-4" />
                                Resend
                              </>
                            )}
                          </Button>
                        )}
                        {canRevoke && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            disabled={isRowBusy("revoke")}
                            onClick={() => handleRevokeInvite(invite._id as string)}
                          >
                            <Ban className="size-4" />
                            Revoke
                          </Button>
                        )}
                        {invite.isLegacy && (
                          <span className="text-xs text-slate-500">
                            Legacy invite. Create a new draft to replace it.
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {invites?.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                    No invites created yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default AdminInviteManager;
