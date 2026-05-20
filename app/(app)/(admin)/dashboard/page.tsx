import CustomizationForm from "@/components/CustomizationForm";
import DashboardMetrics from "@/components/DashboardMetrics";
import DashboardMetricsSkeleton from "@/components/DashboardMetricsSkeleton";
import ManageLinks from "@/components/ManageLinks";
import UsernameForm from "@/components/UsernameForm";
import {
  AdminPageShell,
  AdminSurface,
} from "@/components/dashboard/AdminShell";
import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import { auth } from "@clerk/nextjs/server";
import { Eye, Lock } from "lucide-react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { checkTinybirdConnection } from "@/lib/checkTinybirdConnection";
import type { AnalyticsData } from "@/lib/fetchAnalytics";
import { fetchAnalytics } from "@/lib/fetchAnalytics";
import { getCreateLinkSheetHref } from "@/lib/linkCreationSheet";
import { getCurrentUserEntitlements } from "@/lib/server/entitlements";

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

const dashboardSurfaceClassName =
  "dashboard-shell dashboard-shell-inner border-transparent bg-transparent p-0 shadow-none backdrop-blur-0 sm:p-0 lg:p-0";

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

  const headerSection = (
    <AdminPageShell className={sectionContainerClass}>
      <AdminSurface className={dashboardSurfaceClassName}>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold tracking-[0.24em] text-slate-500 uppercase">
              Dashboard workspace
            </p>
            <h1 className="mt-3 font-['Sora',sans-serif] text-3xl leading-tight font-semibold tracking-[-0.05em] text-slate-900 sm:text-4xl">
              Shape your public page, links, and performance from one place.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">
              Update the pieces visitors see, keep your links in order, and
              check how your page is performing without leaving this workspace.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
            <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5">
              Links
            </span>
            <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5">
              Styling
            </span>
            <span className="rounded-full border border-slate-200/80 bg-white/80 px-3 py-1.5">
              Analytics
            </span>
          </div>
        </div>
        {isDevPreview ? (
          <div className="dashboard-section-divider mt-6 pt-4">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-medium text-amber-900">
              <Eye className="size-3.5" />
              Dev preview mode
            </div>
          </div>
        ) : null}
      </AdminSurface>
    </AdminPageShell>
  );

  const analyticsSection = entitlements.canAccessAnalytics ? (
    <Suspense fallback={<DashboardMetricsSkeleton />}>
      <DashboardMetrics
        analytics={analytics}
        canAccessUltraFeatures={entitlements.canAccessUltraFeatures}
      />
    </Suspense>
  ) : (
    <AdminPageShell className={sectionContainerClass}>
      <AdminSurface className={dashboardSurfaceClassName}>
        <div className="flex items-center gap-3">
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
        <div className="dashboard-section-divider mt-6 pt-6">
          <div className="rounded-2xl bg-gray-50 p-4">
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
      </AdminSurface>
    </AdminPageShell>
  );

  const tinybirdSection =
    isDev && tinybirdStatus ? (
      <AdminPageShell className={sectionContainerClass}>
        <AdminSurface
          className={`${dashboardSurfaceClassName} text-sm ${
            tinybirdStatus.ok
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-amber-200 bg-amber-50 text-amber-900"
          }`}
        >
          <p className="font-semibold">
            Tinybird status: {tinybirdStatus.ok ? "Connected" : "Check"}
          </p>
          <p className="mt-1 text-xs opacity-80">{tinybirdStatus.message}</p>
        </AdminSurface>
      </AdminPageShell>
    ) : null;

  const usernameSection = (
    <AdminPageShell className={sectionContainerClass}>
      <AdminSurface className={dashboardSurfaceClassName}>
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
      </AdminSurface>
    </AdminPageShell>
  );

  const customizationSection = (
    <AdminPageShell className={sectionContainerClass}>
      <CustomizationForm />
    </AdminPageShell>
  );

  const manageLinksSection = (
    <AdminPageShell className={sectionContainerClass}>
      <AdminSurface className={dashboardSurfaceClassName}>
        <div className="flex flex-col gap-3 sm:gap-4">
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
        <div className="dashboard-section-divider mt-8 pt-8">
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
              <Link
                href={getCreateLinkSheetHref()}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-center text-sm font-medium text-slate-600"
                scroll={false}
              >
                Add New Link
              </Link>
            </div>
          )}
        </div>
      </AdminSurface>
    </AdminPageShell>
  );

  const defaultSections = [
    analyticsSection,
    tinybirdSection,
    usernameSection,
    customizationSection,
    manageLinksSection,
  ];

  return (
    <div className="space-y-6 pb-10 sm:space-y-7">
      {headerSection}
      {defaultSections.map(
        (section, index) =>
          section && <Suspense key={index}>{section}</Suspense>,
      )}
    </div>
  );
};

export default DashboardPage;
