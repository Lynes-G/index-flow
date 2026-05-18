import CreateLinkForm from "@/components/CreateLinkForm";
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
          <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-16">
            {/* Left side - Title & Description */}
            <div className="lg:sticky lg:top-8 lg:w-2/5">
              <div className="space-y-6">
                <div>
                  <h1 className="to-gray-900 text-4xl leading-tight font-bold lg:text-5xl">
                    Create New Link
                  </h1>
                  <div className="mt-4 h-1 w-20 rounded-full bg-linear-to-r from-blue-500 to-orange-500" />
                </div>
                <p className="text-lg leading-relaxed text-gray-600">
                  Add a new link to you link-in-bio page. Your links will appear
                  in the order you create them (you can reorder them later),
                  making it easy for your audience to find what matters most.
                </p>

                <div className="space-y-4 pt-4">
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-blue-500" />
                    <span className="text-gray-600">
                      Easy drag & drop reordering
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-orange-500" />
                    <span className="text-gray-600">
                      Automatic URL validation
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-2 rounded-full bg-green-600" />
                    <span className="text-gray-600">
                      Click tracking analytics
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side - New Link Form */}
            <div className="lg:w-3/5">
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-6">
                  <h2 className="mb-2 text-xl font-semibold text-gray-900">
                    Link Details
                  </h2>
                  <p className="text-gray-500">
                    Fill in the information below to create your link.
                  </p>
                </div>

                <CreateLinkForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewLinkPage;
