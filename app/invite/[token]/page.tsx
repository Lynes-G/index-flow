import Link from "next/link";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";
import { fetchMutation, fetchQuery } from "convex/nextjs";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { maskInviteEmail, normalizeInviteEmail } from "@/lib/inviteEmail";
import { hashInviteToken } from "@/lib/invites";

interface InvitePageProps {
  params: Promise<{
    token: string;
  }>;
}

const InvitePage = async ({ params }: InvitePageProps) => {
  const { token } = await params;
  const tokenHash = hashInviteToken(token);
  const invite = await fetchQuery(api.lib.planEntitlements.getInviteByTokenHash, {
    tokenHash,
  });

  if (!invite) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Invite not found</h1>
          <p className="mt-3 text-slate-600">
            This invite link is invalid or no longer available.
          </p>
        </div>
      </div>
    );
  }

  const invitePath = `/invite/${token}`;
  const user = await currentUser();

  if (!user) {
    const inviteEmail = maskInviteEmail(invite.email);

    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-semibold tracking-[0.2em] text-emerald-700 uppercase">
            Free plan grant
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-slate-900">
            You were invited to IndexFlow {invite.invitedPlan.toUpperCase()}
          </h1>
          <p className="mt-3 text-slate-600">
            Sign in or sign up with <span className="font-medium">{inviteEmail}</span> to
            claim this permanent free access.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link href={`/sign-up?redirect_url=${encodeURIComponent(invitePath)}`}>
                Sign up to claim
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link href={`/sign-in?redirect_url=${encodeURIComponent(invitePath)}`}>
                Sign in instead
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const primaryEmail = user.primaryEmailAddress?.emailAddress ?? null;
  const normalizedPrimaryEmail = primaryEmail
    ? normalizeInviteEmail(primaryEmail)
    : null;
  const emailMatches = normalizedPrimaryEmail === invite.email;

  if (invite.status === "accepted" && invite.acceptedByUserId === user.id) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Invite already claimed</h1>
          <p className="mt-3 text-slate-700">
            This account already has the {invite.invitedPlan.toUpperCase()} grant.
          </p>
          <div className="mt-6">
            <Button asChild>
              <Link href="/dashboard/billing">Go to billing</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (invite.status === "accepted") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Invite already used</h1>
          <p className="mt-3 text-slate-600">
            This invite has already been claimed by another account.
          </p>
        </div>
      </div>
    );
  }

  if (invite.status === "revoked") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Invite revoked</h1>
          <p className="mt-3 text-slate-600">
            This invite is no longer active.
          </p>
        </div>
      </div>
    );
  }

  if (!emailMatches) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-8 shadow-sm">
          <h1 className="text-3xl font-semibold text-slate-900">Wrong account</h1>
          <p className="mt-3 text-slate-700">
            This invite was sent to <span className="font-medium">{invite.email}</span>, but
            you are signed in as{" "}
            <span className="font-medium">{primaryEmail ?? "an account without a primary email"}</span>.
          </p>
          <p className="mt-3 text-slate-700">
            Sign in with the invited email address to claim the free plan.
          </p>
          <div className="mt-6">
            <Button asChild variant="outline">
              <Link href="/dashboard/billing">Go back</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const claimInvite = async () => {
    "use server";

    const signedInUser = await currentUser();
    const signedInEmail = signedInUser?.primaryEmailAddress?.emailAddress;

    if (!signedInUser || !signedInEmail) {
      redirect(`/sign-in?redirect_url=${encodeURIComponent(invitePath)}`);
    }

    await fetchMutation(api.lib.planEntitlements.acceptPlanInvite, {
      tokenHash,
      email: normalizeInviteEmail(signedInEmail),
    });

    redirect("/dashboard/billing");
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-semibold tracking-[0.2em] text-emerald-700 uppercase">
          Claim invite
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-slate-900">
          Unlock {invite.invitedPlan.toUpperCase()} for free
        </h1>
        <p className="mt-3 text-slate-600">
          You are signed in with <span className="font-medium">{primaryEmail}</span>. Claiming
          this invite grants permanent {invite.invitedPlan.toUpperCase()} access on this account.
        </p>
        <form action={claimInvite} className="mt-6">
          <Button type="submit">Claim invite</Button>
        </form>
      </div>
    </div>
  );
};

export default InvitePage;
