import CustomizationForm from "@/components/CustomizationForm";
import DashboardMetrics from "@/components/DashboardMetrics";
import DashboardMetricsSkeleton from "@/components/DashboardMetricsSkeleton";
import ManageLinks from "@/components/ManageLinks";
import UsernameForm from "@/components/UsernameForm";
import { api } from "@/convex/_generated/api";
import { fetchAnalytics } from "@/lib/fetchAnalytics";
import { checkTinybirdConnection } from "@/lib/checkTinybirdConnection";
import type { AnalyticsData } from "@/lib/fetchAnalytics";
import { getCurrentUserEntitlements } from "@/lib/server/entitlements";
import { headers } from "next/headers";
import { auth } from "@clerk/nextjs/server";
import { preloadQuery } from "convex/nextjs";
import { Eye, Lock } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const emptyAnalytics: AnalyticsData = {
  totalClicks: 0,
  uniqueVisitors: 0,
  countriesReached: 0,
  totalLinksClicked: 0,
  qrScans: 0,
  topLinkTitle: null,
  topReferrer: null,
  firstClick: null,
  lastClick: null,
};

const isLocalHostname = (hostname: string) =>
  hostname === "localhost" ||
  hostname === "127.0.0.1" ||
  hostname === "::1" ||
  hostname === "[::1]";

const DashboardPage = async ({
  searchParams,
}: {
  searchParams?: Promise<{ devPreview?: string }>;
}) => {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const isDev = process.env.NODE_ENV === "development";
  const requestHeaders = await headers();
  const forwardedHost = requestHeaders.get("x-forwarded-host");
  const rawHost = forwardedHost || requestHeaders.get("host") || "";
  const hostname = rawHost.split(":")[0];
  const isDevPreview =
    isDev &&
    isLocalHostname(hostname) &&
    resolvedSearchParams?.devPreview === "1";
  const { userId } = await auth();

  if (!userId && !isDevPreview) {
    redirect("/sign-in");
  }

  const preloadedLinks = userId
    ? await preloadQuery(api.lib.links.getLinksByUserId, {
        userId,
      })
    : null;

  const entitlements = userId
    ? await getCurrentUserEntitlements()
    : {
        canAccessAnalytics: true,
        canAccessUltraFeatures: false,
      };
  const analytics = userId ? await fetchAnalytics(userId) : emptyAnalytics;
  const tinybirdStatus =
    isDev && userId ? await checkTinybirdConnection(userId) : null;
  const sectionContainerClass = "mx-auto max-w-7xl px-3 sm:px-4 lg:px-8";
  const sectionCardClass =
    "rounded-3xl border border-slate-200/70 bg-white/95 p-5 shadow-sm sm:p-6 lg:p-8";
  const headerSection = (
    <div className={sectionContainerClass}>
      <div className="flex flex-col gap-4 rounded-3xl border border-slate-200/70 bg-white/95 px-4 py-5 shadow-sm sm:px-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 sm:text-3xl">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Manage your links, page style, and analytics.
          </p>
        </div>
        {isDevPreview ? (
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900">
            <Eye className="size-3.5" />
            Dev preview mode
          </div>
        ) : null}
      </div>
    </div>
  );
  const analyticsSection = entitlements.canAccessAnalytics ? (
    <Suspense fallback={<DashboardMetricsSkeleton />}>
      <DashboardMetrics
        analytics={analytics}
        canAccessUltraFeatures={entitlements.canAccessUltraFeatures}
      />
    </Suspense>
  ) : (
    <div className={sectionContainerClass}>
      <div className={sectionCardClass}>
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-xl bg-gray-400 p-3">
            <Lock className="size-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Analytics Overview
            </h2>
            <p className="text-gray-600">
              Detailed analytics unlock on Pro and above, but billing is
              currently paused.
            </p>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <p className="text-gray-600">
            New accounts stay on Free by default. Pro and Ultra access
            currently come from admin-issued invites rather than direct
            checkout.
          </p>
          <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-600">
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1">
              Top links
            </span>
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1">
              Referrers
            </span>
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1">
              Countries
            </span>
          </div>
        </div>
      </div>
    </div>
  );
  const tinybirdSection =
    isDev && tinybirdStatus ? (
      <div className={sectionContainerClass}>
        <div
          className={`rounded-3xl border p-5 text-sm shadow-sm sm:p-6 ${
            tinybirdStatus.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <p className="font-semibold">
            Tinybird status: {tinybirdStatus.ok ? "Connected" : "Check"}
          </p>
          <p className="mt-1 text-xs opacity-80">{tinybirdStatus.message}</p>
        </div>
      </div>
    ) : null;
  const usernameSection = (
    <div className={sectionContainerClass}>
      <div className={sectionCardClass}>
        {userId ? (
          <UsernameForm />
        ) : (
          <div className="space-y-6">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                Customize your link
              </h3>
              <p className="text-sm text-gray-600">
                Preview the username section layout without connecting it to a
                real account.
              </p>
            </div>
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="size-2 rounded-full bg-green-500" />
                  <span className="text-sm font-medium text-green-900">
                    Current username
                  </span>
                </div>
                <span className="rounded bg-white/75 px-2 py-1 font-mono text-sm text-green-800">
                  your-profile
                </span>
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="mb-2 flex items-center gap-2">
                <span className="size-2 rounded-full bg-slate-400" />
                <span className="text-sm font-medium text-slate-700">
                  Your Link Preview
                </span>
              </div>
              <div className="rounded-md border border-slate-200 bg-white px-3 py-2 font-mono text-sm text-slate-700">
                http://localhost:3000/u/your-profile
              </div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="space-y-3">
                <div>
                  <p className="mb-2 text-sm font-medium text-slate-800">
                    Username
                  </p>
                  <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                    your-profile
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-md border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="rounded-md bg-slate-900 px-4 py-2 text-sm text-white"
                  >
                    Save Username
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
  const customizationSection = (
    <div className={sectionContainerClass}>
      <CustomizationForm />
    </div>
  );
  const manageLinksSection = (
    <div className={sectionContainerClass}>
      <div className={sectionCardClass}>
        <div className="mb-8 flex flex-col gap-3 border-b border-slate-200/80 pb-6 sm:gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">
              Manage your links
            </h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
              Organize and customize your link-in-bio page. Drag and drop to
              reorder, edit details, or remove links that are no longer needed.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              Drag & drop
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              Realtime updates
            </span>
            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1">
              Click tracking
            </span>
          </div>
        </div>

        {preloadedLinks ? (
          <ManageLinks preloadedLinks={preloadedLinks} />
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              {["Portfolio", "Newsletter", "Book a call"].map((title) => (
                <div
                  key={title}
                  className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg p-1 text-slate-400">⋮⋮</div>
                    <div>
                      <p className="text-base font-semibold text-slate-900">
                        {title}
                      </p>
                      <p className="text-sm text-slate-600">
                        https://example.com/
                        {title.toLowerCase().replace(/\s+/g, "-")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">
                      Stats
                    </span>
                    <span className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-500">
                      Edit
                    </span>
                    <span className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1.5 text-xs text-rose-600">
                      Delete
                    </span>
                  </div>
                </div>
              ))}
            </div>
            <button
              type="button"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600"
            >
              Add New Link
            </button>
          </div>
        )}
      </div>
    </div>
  );
  const defaultSections = [
    analyticsSection,
    tinybirdSection,
    usernameSection,
    customizationSection,
    manageLinksSection,
  ];

  return (
    <div className="space-y-6 pb-10">
      {headerSection}
      {defaultSections.map(
        (section, index) => section && <Suspense key={index}>{section}</Suspense>,
      )}
    </div>
  );
};

export default DashboardPage;
