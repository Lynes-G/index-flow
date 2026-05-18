import CreateLinkPanel from "@/components/CreateLinkPanel";
import { api } from "@/convex/_generated/api";
import { getCurrentUserEntitlements } from "@/lib/server/entitlements";
import { auth } from "@clerk/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
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
      <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="mb-4 text-2xl font-bold text-gray-900">
              Link Creation Limit Reached
            </h2>
            <p className="mb-4 text-gray-600">
              You have reached your link creation limit of links (
              {access.currentCount}/{access.limit}).
              {!hasUnlimitedLinks &&
                " Ultra access is currently available only through an admin invite."}
            </p>
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
              >
                <ArrowLeft className="size-4" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:outline-none"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </div>

      <div className="min-h-screen bg-slate-50 p-4 lg:p-8">
        <div className="mx-auto max-w-7xl">
          <CreateLinkPanel />
        </div>
      </div>
    </>
  );
};

export default NewLinkPage;
