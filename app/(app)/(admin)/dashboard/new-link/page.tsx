import CreateLinkPanel from "@/components/CreateLinkPanel";
import {
  AdminPageShell,
  AdminSurface,
} from "@/components/dashboard/AdminShell";
import { api } from "@/convex/_generated/api";
import { getCurrentUserEntitlements } from "@/lib/server/entitlements";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const NewLinkPage = async () => {
  const { userId } = await auth();
  const entitlements = await getCurrentUserEntitlements();
  const hasUnlimitedLinks = entitlements.linkLimit === null;

  const linkCount = await fetchQuery(api.lib.links.getLinkCountByUserId, {
    userId: userId || "",
  });

  const access = {
    canCreate:
      entitlements.linkLimit === null ? true : linkCount < entitlements.linkLimit,
    limit: entitlements.linkLimit ?? "unlimited",
    currentCount: linkCount,
  };

  if (!access.canCreate) {
    return (
      <div className="space-y-6 pb-10">
        <AdminPageShell>
          <AdminSurface className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <ArrowLeft className="size-4" />
                Back to Dashboard
              </Link>
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold tracking-wide text-amber-900 uppercase">
                <AlertCircle className="size-3.5" />
                Limit reached
              </span>
            </div>
            <div className="space-y-3">
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                Link creation limit reached
              </h1>
              <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                You have reached your current link limit (
                {access.currentCount}/{access.limit}).
                {!hasUnlimitedLinks &&
                  " Ultra access is currently available only through an admin invite."}
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50/90 p-5">
              <p className="text-sm font-medium text-slate-800">
                Your existing links stay active and editable. Return to the
                dashboard to reorganize them or remove one before creating a
                new link.
              </p>
            </div>
          </AdminSurface>
        </AdminPageShell>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      <AdminPageShell>
        <AdminSurface className="space-y-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-100 hover:text-slate-900 focus-visible:ring-2 focus-visible:ring-slate-300 focus-visible:ring-offset-2 focus-visible:outline-none"
          >
            <ArrowLeft className="size-4" />
            Back to Dashboard
          </Link>
          <div>
            <p className="text-sm font-medium text-slate-500">
              Dashboard / Links
            </p>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Add a new destination without leaving the dashboard styling
              system. Your link will appear on your public page as soon as it
              is saved.
            </p>
          </div>
        </AdminSurface>
      </AdminPageShell>

      <AdminPageShell>
        <CreateLinkPanel />
      </AdminPageShell>
    </div>
  );
};

export default NewLinkPage;
